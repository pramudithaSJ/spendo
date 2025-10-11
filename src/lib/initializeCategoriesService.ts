import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { categoryService, defaultCategories } from './categoryService';

const USER_METADATA_COLLECTION = 'userMetadata';

interface UserMetadata {
  userId: string;
  categoriesInitialized: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

/**
 * Initialize default categories for a new user
 * This function includes duplicate prevention and atomic operations
 * to ensure categories are only created once per user
 */
export const initializeUserCategories = async (userId: string): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required to initialize categories');
  }

  try {
    // Use a transaction to ensure atomic check-and-create
    await runTransaction(db, async (transaction) => {
      const metadataRef = doc(db, USER_METADATA_COLLECTION, userId);
      const metadataDoc = await transaction.get(metadataRef);

      // Check if categories were already initialized
      if (metadataDoc.exists() && metadataDoc.data()?.categoriesInitialized) {
        console.log('Categories already initialized for user:', userId);
        return;
      }

      // Double-check: verify no categories exist in the database
      const existingCategories = await categoryService.getCategories(userId);
      if (existingCategories.length > 0) {
        console.log('Categories already exist for user:', userId);

        // Mark as initialized even though we didn't create them
        transaction.set(metadataRef, {
          userId,
          categoriesInitialized: true,
          createdAt: new Date(),
          lastUpdated: new Date(),
        });
        return;
      }

      // Create metadata document to mark initialization in progress
      transaction.set(metadataRef, {
        userId,
        categoriesInitialized: true,
        createdAt: new Date(),
        lastUpdated: new Date(),
      });
    });

    // After successful transaction, create the categories
    // This is done outside the transaction to avoid timeout issues
    const categoriesAlreadyExist = await categoryService.getCategories(userId);

    if (categoriesAlreadyExist.length === 0) {
      console.log('Creating default categories for user:', userId);

      // Create all default categories
      const promises = defaultCategories.map(cat =>
        categoryService.addCategory({
          ...cat,
          userId,
        })
      );

      await Promise.all(promises);
      console.log('Successfully created default categories for user:', userId);
    }
  } catch (error) {
    console.error('Error initializing user categories:', error);
    throw error;
  }
};

/**
 * Check if categories have been initialized for a user
 */
export const areCategoriesInitialized = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const metadataRef = doc(db, USER_METADATA_COLLECTION, userId);
    const metadataDoc = await getDoc(metadataRef);

    return metadataDoc.exists() && metadataDoc.data()?.categoriesInitialized === true;
  } catch (error) {
    console.error('Error checking categories initialization:', error);
    return false;
  }
};

/**
 * Ensure categories are initialized for a user
 * Safe to call multiple times - will only initialize once
 */
export const ensureCategoriesInitialized = async (userId: string): Promise<void> => {
  const initialized = await areCategoriesInitialized(userId);

  if (!initialized) {
    await initializeUserCategories(userId);
  }
};

/**
 * Remove duplicate categories for a user (cleanup utility)
 * Keeps the oldest category of each name+type combination
 */
export const removeDuplicateCategories = async (userId: string): Promise<void> => {
  if (!userId) return;

  try {
    const categories = await categoryService.getCategories(userId);

    // Group categories by name and type
    const categoryMap = new Map<string, typeof categories>();

    categories.forEach(cat => {
      const key = `${cat.name.toLowerCase()}-${cat.type}`;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, []);
      }
      categoryMap.get(key)?.push(cat);
    });

    // Find duplicates and delete extras
    let deletedCount = 0;
    for (const [key, cats] of categoryMap.entries()) {
      if (cats.length > 1) {
        // Sort by creation date, keep the oldest
        cats.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        // Delete all but the first one
        for (let i = 1; i < cats.length; i++) {
          await categoryService.deleteCategory(cats[i].id);
          deletedCount++;
          console.log(`Deleted duplicate category: ${cats[i].name} (${cats[i].type})`);
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`Removed ${deletedCount} duplicate categories for user ${userId}`);
    } else {
      console.log('No duplicate categories found');
    }
  } catch (error) {
    console.error('Error removing duplicate categories:', error);
    throw error;
  }
};
