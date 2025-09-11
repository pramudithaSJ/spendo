export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  userId: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  date: Date;
  userId: string;
  createdAt: Date;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}