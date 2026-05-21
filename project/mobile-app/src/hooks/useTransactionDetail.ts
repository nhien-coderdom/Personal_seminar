import { useEffect, useState } from 'react';
import api from '../services/api';
import { ITransaction, useTransactionStore } from '../store/transactionStore';

interface UseTransactionDetailReturn {
  transaction: ITransaction | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để fetch chi tiết giao dịch từ API
 * - Kiểm tra Zustand store trước (nhanh)
 * - Nếu không có → fetch từ API: GET /transactions/:id
 * - Include category relation
 */
export function useTransactionDetail(transactionId: string): UseTransactionDetailReturn {
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get categories from store
  const { categories } = useTransactionStore();

  const fetchTransaction = async () => {
    if (!transactionId) {
      console.error('[DETAIL] transactionId is undefined or null');
      setError('Không có ID giao dịch');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[DETAIL] Fetching transaction:', transactionId);
      console.log('[API] GET /transactions/:id');

      const response = await api.get(`/transactions/${transactionId}`);
      
      console.log('[DETAIL] API Response structure:', {
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {}),
        fullResponse: response.data
      });
      
      // Handle different response formats:
      let rawData = response.data;
      
      if (response.data?.data && typeof response.data.data === 'object') {
        rawData = response.data.data;
      }
      
      console.log('[DETAIL] Parsed raw data:', {
        id: rawData?.id,
        amount: rawData?.amount,
        type: rawData?.type,
        categoryId: rawData?.categoryId,
        hasCategory: !!rawData?.category
      });
      
      if (!rawData?.id) {
        throw new Error('Dữ liệu giao dịch không hợp lệ: thiếu ID');
      }

      // If API doesn't return category, fetch from store by categoryId
      let category = rawData.category;
      if (!category && rawData.categoryId && categories.length > 0) {
        console.log('[DETAIL] Category not in response, fetching from store');
        category = categories.find(c => c.id === rawData.categoryId) || undefined;
        console.log('[DETAIL] Category from store:', category?.name);
      }

      const data: ITransaction = {
        id: rawData.id,
        amount: rawData.amount,
        type: rawData.type,
        categoryId: rawData.categoryId,
        date: rawData.date || rawData.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        note: rawData.note,
        source: rawData.source || 'manual',
        imageUrl: rawData.imageUrl,
        createdAt: rawData.createdAt,
        category: category,  // Use enriched category
      };

      console.log('[DETAIL] Transaction parsed successfully:', {
        id: data.id,
        amount: data.amount,
        category: data.category?.name || 'Khác',
        source: data.source,
      });
      
      setTransaction(data);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải dữ liệu giao dịch';
      console.error('[DETAIL] Error loading transaction:', errorMessage);
      console.error('[DETAIL] Full error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        data: err.response?.data
      });
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[DETAIL] useTransactionDetail hook effect triggered for transactionId:', transactionId);
    if (transactionId) {
      console.log('[DETAIL] Starting fetch for', transactionId);
      fetchTransaction();
    } else {
      console.warn('[DETAIL] transactionId is empty, cannot fetch');
      setError('ID giao dịch không hợp lệ');
    }
  }, [transactionId]);
  
  // IMPORTANT: Separate effect to re-enrich if categories list loads AFTER initial fetch
  useEffect(() => {
    if (transaction && !transaction.category && transaction.categoryId && categories.length > 0) {
      console.log('[DETAIL] Categories loaded AFTER initial fetch, re-enriching transaction');
      const enrichedCategory = categories.find(c => c.id === transaction.categoryId);
      if (enrichedCategory) {
        console.log('[DETAIL] Re-enriching with category from store:', enrichedCategory.name);
        setTransaction({
          ...transaction,
          category: enrichedCategory
        });
      }
    }
  }, [categories, transaction?.categoryId]);

  return {
    transaction,
    loading,
    error,
    refetch: fetchTransaction,
  };
}
