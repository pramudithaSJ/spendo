import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, TransactionWithCategory, Category } from './types';

const TRANSACTIONS_COLLECTION = 'transactions';

export const transactionService = {
  async getTransactions(userId: string, limitCount?: number): Promise<TransactionWithCategory[]> {
    // Use simpler query to avoid index issues
    let q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    let transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Transaction[];

    // Sort by date in JavaScript instead of Firestore
    transactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Apply limit if specified
    if (limitCount) {
      transactions = transactions.slice(0, limitCount);
    }

    // Get categories for each transaction
    const categoryIds = [...new Set(transactions.map(t => t.categoryId))];
    if (categoryIds.length === 0) {
      return [];
    }

    // Get categories in batches to avoid 'in' limit
    const categoriesMap = new Map<string, Category>();
    
    // Process in chunks of 10 (Firestore 'in' limit)
    for (let i = 0; i < categoryIds.length; i += 10) {
      const chunk = categoryIds.slice(i, i + 10);
      const categoriesSnapshot = await getDocs(
        query(collection(db, 'categories'), where('__name__', 'in', chunk))
      );
      
      categoriesSnapshot.docs.forEach(doc => {
        categoriesMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Category);
      });
    }

    return transactions.map(transaction => ({
      ...transaction,
      category: categoriesMap.get(transaction.categoryId)!,
    })).filter(t => t.category); // Filter out transactions with missing categories
  },

  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt' | 'userId'>>): Promise<void> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, id);
    const updateData = { ...updates };
    
    if (updateData.date) {
      updateData.date = Timestamp.fromDate(updateData.date) as any;
    }
    
    await updateDoc(docRef, updateData);
  },

  async deleteTransaction(id: string): Promise<void> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  async getTransactionsByDateRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<TransactionWithCategory[]> {
    // Use simpler query and filter in JavaScript
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    let transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Transaction[];

    // Filter by date range in JavaScript
    transactions = transactions.filter(transaction => {
      const transactionDate = transaction.date;
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Sort by date
    transactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Get categories for each transaction
    const categoryIds = [...new Set(transactions.map(t => t.categoryId))];
    if (categoryIds.length === 0) {
      return [];
    }

    const categoriesMap = new Map<string, Category>();
    
    // Process in chunks of 10 (Firestore 'in' limit)
    for (let i = 0; i < categoryIds.length; i += 10) {
      const chunk = categoryIds.slice(i, i + 10);
      const categoriesSnapshot = await getDocs(
        query(collection(db, 'categories'), where('__name__', 'in', chunk))
      );
      
      categoriesSnapshot.docs.forEach(doc => {
        categoriesMap.set(doc.id, {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Category);
      });
    }

    return transactions.map(transaction => ({
      ...transaction,
      category: categoriesMap.get(transaction.categoryId)!,
    })).filter(t => t.category);
  },

  async getMonthlyStats(userId: string, year: number, month: number): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await this.getTransactionsByDateRange(userId, startDate, endDate);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  },
};