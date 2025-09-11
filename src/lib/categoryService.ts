import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Category } from './types';

const CATEGORIES_COLLECTION = 'categories';

export const categoryService = {
  async getCategories(userId: string): Promise<Category[]> {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Category[];
    
    // Sort by name alphabetically for better UX
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  },

  async addCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...category,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'userId'>>): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, updates);
  },

  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  },
};

// Default categories that will be created for new users
export const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'income' as const, icon: 'Banknote' },
  { name: 'Freelance', type: 'income' as const, icon: 'Laptop' },
  { name: 'Investment', type: 'income' as const, icon: 'TrendingUp' },
  { name: 'Gift', type: 'income' as const, icon: 'Gift' },
  { name: 'Other Income', type: 'income' as const, icon: 'Plus' },
  
  // Expense categories
  { name: 'Food & Dining', type: 'expense' as const, icon: 'Utensils' },
  { name: 'Transportation', type: 'expense' as const, icon: 'Car' },
  { name: 'Shopping', type: 'expense' as const, icon: 'ShoppingBag' },
  { name: 'Entertainment', type: 'expense' as const, icon: 'Film' },
  { name: 'Bills & Utilities', type: 'expense' as const, icon: 'Receipt' },
  { name: 'Healthcare', type: 'expense' as const, icon: 'Heart' },
  { name: 'Education', type: 'expense' as const, icon: 'BookOpen' },
  { name: 'Home', type: 'expense' as const, icon: 'Home' },
  { name: 'Travel', type: 'expense' as const, icon: 'Plane' },
  { name: 'Other Expenses', type: 'expense' as const, icon: 'Minus' },
];