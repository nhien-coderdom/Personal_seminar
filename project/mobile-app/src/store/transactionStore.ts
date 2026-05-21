import { create } from 'zustand';
import api from '../services/api';

export interface ICategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface ITransaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  category?: ICategory;
  note?: string;
  source: 'manual' | 'ocr' | 'quick_add' | 'share'; // manual | ocr | quick_add | share
  imageUrl?: string; // URL to OCR receipt image
  date: string;
  createdAt: string;
}

interface CreateTransactionData {
  amount: number;
  categoryId: string;
  note?: string;
  imageUrl?: string;
  source: 'manual' | 'ocr' | 'quick_add' | 'share';
  type: 'expense' | 'income';
  date?: string;
  createdAt?: string;
}

interface TransactionState {
  selectedDate: string;
  selectedTransactions: ITransaction[];
  monthlyTransactions: ITransaction[]; // All transactions in current month
  totalIncome: number;
  totalExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  categories: ICategory[];
  isLoading: boolean;
  error: string | null;

  setSelectedDate: (date: string) => void;
  fetchCategories: () => Promise<void>;
  fetchTransactionsByDate: (date: string) => Promise<void>;
  fetchMonthlySummary: (yearMonth: string) => Promise<void>;
  fetchMonthlyTransactions: (yearMonth: string) => Promise<void>;
  createTransaction: (data: CreateTransactionData) => Promise<ITransaction>;
  updateTransaction: (id: string, data: Partial<CreateTransactionData>) => Promise<ITransaction>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0],
  selectedTransactions: [],
  monthlyTransactions: [],
  totalIncome: 0,
  totalExpense: 0,
  monthlyIncome: 0,
  monthlyExpense: 0,
  categories: [],
  isLoading: false,
  error: null,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('[STORE] Fetching categories from backend');
      
      const response = await api.get('/transactions/categories');
      const categories = response.data.data || response.data || [];
      
      console.log(`[STORE] Fetched ${categories.length} categories:`, categories);
      set({ categories, isLoading: false });
    } catch (error: any) {
      console.error('[STORE ERROR] fetchCategories failed:', error);
      // Fallback to empty array, but don't crash
      set({ categories: [], isLoading: false });
    }
  },

  fetchTransactionsByDate: async (date: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log(`[STORE] Fetching transactions for date: ${date}`);
      
      const response = await api.get(`/transactions/by-date?date=${date}`);
      
      console.log(`[STORE] Fetched ${response.data.transactions.length} transactions for ${date}`);
      set({ 
        selectedTransactions: response.data.transactions,
        totalIncome: response.data.totalIncome,
        totalExpense: response.data.totalExpense,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('[STORE ERROR] fetchTransactionsByDate failed:', error);
      set({ error: error.message || 'Failed to fetch transactions', isLoading: false });
    }
  },

  fetchMonthlySummary: async (yearMonth: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log(`[STORE] Fetching monthly summary for: ${yearMonth}`);
      
      // Simple approach: get all transactions for the month using start/end date
      const [year, month] = yearMonth.split('-');
      const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString();
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999).toISOString();
      
      const response = await api.get(`/transactions?startDate=${startDate}&endDate=${endDate}&limit=1000`);
      
      const transactions = response.data.data || [];
      
      let mIncome = 0;
      let mExpense = 0;
      
      transactions.forEach((tx: any) => {
        if (tx.type === 'income') mIncome += tx.amount;
        if (tx.type === 'expense') mExpense += tx.amount;
      });
      
      console.log(`[STORE] Monthly summary computed: Income=${mIncome}, Expense=${mExpense}`);
      set({ 
        monthlyIncome: mIncome,
        monthlyExpense: mExpense,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('[STORE ERROR] fetchMonthlySummary failed:', error);
      set({ error: error.message || 'Failed to fetch monthly summary', isLoading: false });
    }
  },

  fetchMonthlyTransactions: async (yearMonth: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log(`[STORE] Fetching all monthly transactions for: ${yearMonth}`);
      
      const [year, month] = yearMonth.split('-');
      const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString();
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999).toISOString();
      
      const response = await api.get(`/transactions?startDate=${startDate}&endDate=${endDate}&limit=1000`);
      
      const transactions = response.data.data || [];
      console.log(`[STORE] Fetched ${transactions.length} transactions for month`);
      
      set({ 
        monthlyTransactions: transactions,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('[STORE ERROR] fetchMonthlyTransactions failed:', error);
      set({ error: error.message || 'Failed to fetch monthly transactions', isLoading: false });
    }
  },

  createTransaction: async (data: CreateTransactionData) => {
    try {
      console.log('[STORE_CREATE] Creating new transaction:', data);
      set({ isLoading: true, error: null });

      // Prepare API payload
      const payload = {
        amount: data.amount,
        categoryId: data.categoryId,
        note: data.note || '',
        imageUrl: data.imageUrl || undefined,
        source: data.source,
        type: data.type,
        date: data.date,
      };

      console.log('[STORE_CREATE] API payload:', payload);

      // Call API to create transaction
      const response = await api.post('/transactions', payload);
      
      const newTransaction: ITransaction = {
        id: response.data.id,
        amount: response.data.amount,
        type: response.data.type,
        categoryId: response.data.categoryId,
        note: response.data.note,
        source: response.data.source,
        imageUrl: response.data.imageUrl,
        date: response.data.date,
        createdAt: response.data.createdAt,
        category: response.data.category,
      };

      console.log('[STORE_CREATE] Transaction created successfully:', newTransaction);

      // Update store with new transaction
      set((state) => {
        const updated = [...state.monthlyTransactions, newTransaction];
        
        // Recalculate totals
        let newMonthlyIncome = state.monthlyIncome;
        let newMonthlyExpense = state.monthlyExpense;

        if (newTransaction.type === 'income') {
          newMonthlyIncome += newTransaction.amount;
        } else {
          newMonthlyExpense += newTransaction.amount;
        }

        console.log(`[STORE_CREATE] Updated monthly totals: Income=${newMonthlyIncome}, Expense=${newMonthlyExpense}`);

        return {
          monthlyTransactions: updated,
          monthlyIncome: newMonthlyIncome,
          monthlyExpense: newMonthlyExpense,
          isLoading: false,
        };
      });

      // If transaction is for today, also add to selectedTransactions
      const today = new Date().toISOString().split('T')[0];
      if (data.createdAt && data.createdAt.startsWith(today)) {
        console.log('[STORE_CREATE] Transaction is for today - updating selectedTransactions');
        set((state) => ({
          selectedTransactions: [...state.selectedTransactions, newTransaction],
        }));
      }

      return newTransaction;
    } catch (error: any) {
      console.error('[STORE ERROR] createTransaction failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create transaction';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateTransaction: async (id: string, data: Partial<CreateTransactionData>) => {
    try {
      console.log('[STORE_UPDATE] Updating transaction:', id, data);
      set({ isLoading: true, error: null });

      const response = await api.put(`/transactions/${id}`, data);
      
      const updatedTransaction: ITransaction = {
        id: response.data.id,
        amount: response.data.amount,
        type: response.data.type,
        categoryId: response.data.categoryId,
        note: response.data.note,
        source: response.data.source,
        imageUrl: response.data.imageUrl,
        date: response.data.date,
        createdAt: response.data.createdAt,
        category: response.data.category,
      };

      console.log('[STORE_UPDATE] Transaction updated successfully:', updatedTransaction);

      // Update in monthly transactions
      set((state) => {
        const updated = state.monthlyTransactions.map((tx) =>
          tx.id === id ? updatedTransaction : tx
        );

        return {
          monthlyTransactions: updated,
          isLoading: false,
        };
      });

      return updatedTransaction;
    } catch (error: any) {
      console.error('[STORE ERROR] updateTransaction failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update transaction';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      console.log('[STORE_DELETE] Deleting transaction:', id);
      set({ isLoading: true, error: null });

      await api.delete(`/transactions/${id}`);

      console.log('[STORE_DELETE] Transaction deleted successfully');

      // Remove from monthly transactions
      set((state) => {
        const deleted = state.monthlyTransactions.find(tx => tx.id === id);
        const updated = state.monthlyTransactions.filter((tx) => tx.id !== id);

        // Recalculate totals
        let newMonthlyIncome = state.monthlyIncome;
        let newMonthlyExpense = state.monthlyExpense;

        if (deleted) {
          if (deleted.type === 'income') {
            newMonthlyIncome -= deleted.amount;
          } else {
            newMonthlyExpense -= deleted.amount;
          }
        }

        console.log(`[STORE_DELETE] Updated monthly totals: Income=${newMonthlyIncome}, Expense=${newMonthlyExpense}`);

        return {
          monthlyTransactions: updated,
          selectedTransactions: state.selectedTransactions.filter(tx => tx.id !== id),
          monthlyIncome: newMonthlyIncome,
          monthlyExpense: newMonthlyExpense,
          isLoading: false,
        };
      });
    } catch (error: any) {
      console.error('[STORE ERROR] deleteTransaction failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete transaction';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
