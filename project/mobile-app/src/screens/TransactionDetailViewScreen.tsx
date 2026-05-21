import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionDetail } from '../hooks/useTransactionDetail';
import { OCRReceiptPreview } from '../components/OCRReceiptPreview';
import { useTransactionStore } from '../store/transactionStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

// ─── Type Definitions ───────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetailView'>;

// ─── Component ──────────────────────────────────────────────────────────────

function TransactionDetailViewScreen(props: Props) {
  const { route, navigation } = props;
  const transactionId = route.params?.transactionId;
  const { transaction, loading, error, refetch } =
    useTransactionDetail(transactionId);
  const { deleteTransaction } = useTransactionStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Log when screen mounts - ONLY log on transactionId change
  // DO NOT include transaction/loading/error in dependencies to avoid unmount loop
  React.useEffect(() => {
    console.log(`[DETAIL] TransactionDetailViewScreen mounted with transactionId: ${transactionId}`);
    console.log(`[DETAIL] route.params:`, route.params);
    
    return () => {
      console.log(`[DETAIL] TransactionDetailViewScreen unmounted (transactionId: ${transactionId})`);
    };
  }, [transactionId]);

  // Separate effect to log state changes (won't cause mount/unmount loop)
  React.useEffect(() => {
    console.log('[DETAIL] State changed:', {
      hasTransaction: !!transaction,
      loading,
      error,
      category: transaction?.category?.name || 'undefined'
    });
  }, [transaction, loading, error]);

  // Format amount with VND currency
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes}, ${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Get transaction type label
  const getTypeLabel = (type: string): string => {
    return type === 'income' ? 'Thu nhập' : 'Chi tiêu';
  };

  // Handle delete transaction
  const handleDeleteTransaction = () => {
    console.log('[DETAIL] Delete button tapped');
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('[DETAIL] Delete cancelled by user'),
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              setIsDeleting(true);
              console.log('[DETAIL] Confirmed delete for transaction:', transactionId);
              console.log('[API] DELETE /transactions/:id');

              await deleteTransaction(transactionId);

              console.log('[DETAIL] Transaction deleted successfully');
              console.log('[STORE] Transaction removed from state, totals updated');
              
              Alert.alert('Thành công', 'Giao dịch đã được xóa', [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('[NAVIGATION] Navigate back after successful delete');
                    navigation.goBack();
                  },
                },
              ]);
            } catch (err: any) {
              console.error('[DETAIL] Delete error:', err);
              Alert.alert('Lỗi', err.message || 'Không thể xóa giao dịch');
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  // Handle edit transaction
  const handleEditTransaction = () => {
    if (!transaction) {
      console.warn('[DETAIL] Edit clicked but transaction is null');
      return;
    }

    console.log('[DETAIL] Edit button tapped');
    console.log('[NAVIGATION] Navigating to edit screen based on source:', transaction.source);

    if (transaction.source === 'ocr') {
      navigation.navigate('OCRResult', { transactionId });
    } else {
      navigation.navigate('ManualTransaction', { transactionId });
    }
  };

  // Loading state
  if (loading) {
    console.log('[DETAIL] Rendering loading state');
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-4 text-gray-600">Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    const displayError = error;
    console.log('[DETAIL] Rendering error state:', { error, displayError });
    
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={() => {
              console.log('[NAVIGATION] Navigate back from error state');
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-gray-700 font-semibold">
            {displayError}
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-xs">
            ID: {transactionId}
          </Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg"
            onPress={() => {
              console.log('[DETAIL] Retry button pressed');
              refetch();
            }}
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Not found state
  if (!transaction) {
    console.log('[DETAIL] Rendering not found state');
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-gray-700 font-semibold">
            Không tìm thấy giao dịch
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-xs">
            ID: {transactionId}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determine amount color
  const amountColor = transaction.type === 'expense' ? '#ef4444' : '#22c55e';
  const amountPrefix = transaction.type === 'expense' ? '-' : '+';

  // Provide default category if undefined
  const displayCategory = transaction.category || {
    id: 'unknown',
    name: 'Giao dịch khác',
    icon: '💰',
    color: '#f3f4f6',
  };

  console.log('[DETAIL RENDER] Rendering transaction with:', {
    id: transaction.id,
    amount: transaction.amount,
    categoryName: displayCategory.name,
    hasRealCategory: !!transaction.category,
    isUsingFallback: !transaction.category
  });

  // Safety check for required fields
  if (!transaction.id || transaction.amount === undefined) {
    console.error('[DETAIL] Transaction missing required fields:', {
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type
    });
    
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-gray-700 font-semibold">
            Dữ liệu giao dịch không đầy đủ
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-xs">
            Thiếu thông tin quan trọng
          </Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg"
            onPress={() => {
              console.log('[DETAIL] Retry after data validation error');
              refetch();
            }}
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* ─── HEADER ──────────────────────────────────────────────────────────── */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          {/* Back button */}
          <TouchableOpacity
            onPress={() => {
              console.log('[NAVIGATION] Back button pressed from detail screen');
              navigation.goBack();
            }}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-bold text-gray-900">Chi tiết</Text>

          {/* Options button */}
          <TouchableOpacity
            onPress={() => console.log('[NAVIGATION] Open options menu')}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── BODY ────────────────────────────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 1. SUMMARY SECTION ──────────────────────────────────────────────────── */}
        <View className="items-center py-6 px-4">
          {/* Category Avatar */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: displayCategory.color || '#f3f4f6',
            }}
          >
            <Text className="text-3xl">
              {displayCategory.icon || '💰'}
            </Text>
          </View>

          {/* Category Name */}
          <Text className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3">
            {displayCategory.name || 'Khác'}
          </Text>

          {/* Amount */}
          <Text className="text-4xl font-bold" style={{ color: amountColor }}>
            {amountPrefix}
            {formatAmount(transaction.amount)}
          </Text>
        </View>

        {/* 2. INFORMATION SECTION ──────────────────────────────────────────────── */}
        <View className="px-4 py-4">
          <View className="bg-white rounded-xl overflow-hidden shadow-sm">
            {/* Thời gian */}
            <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 font-medium">Thời gian</Text>
              <Text className="text-sm text-gray-900 font-semibold">
                {formatDate(transaction.date)}
              </Text>
            </View>

            {/* Danh mục */}
            <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 font-medium">Danh mục</Text>
              <Text className="text-sm text-gray-900 font-semibold">
                {displayCategory.name || 'Khác'}
              </Text>
            </View>

            {/* Loại giao dịch */}
            <View className="px-4 py-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 font-medium">Loại GD</Text>
              <Text className="text-sm text-gray-900 font-semibold">
                {getTypeLabel(transaction.type)}
              </Text>
            </View>

            {/* Ghi chú (nếu có) */}
            {transaction.note && (
              <View className="px-4 py-4 border-b border-gray-200">
                <Text className="text-sm text-gray-600 font-medium mb-2">
                  Ghi chú
                </Text>
                <Text className="text-sm text-gray-900 leading-relaxed">
                  {transaction.note}
                </Text>
              </View>
            )}

            {/* Nguồn */}
            <View className="px-4 py-4 flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 font-medium">Nguồn</Text>
              <View className="flex-row items-center gap-2">
                {transaction.source === 'ocr' && (
                  <Ionicons name="camera" size={16} color="#6366f1" />
                )}
                <Text className="text-sm text-gray-900 font-semibold capitalize">
                  {transaction.source === 'ocr'
                    ? 'OCR'
                    : transaction.source === 'manual'
                    ? 'Thủ công'
                    : transaction.source}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. OCR RECEIPT SECTION (Conditional) ────────────────────────────────── */}
        {transaction.source === 'ocr' && transaction.imageUrl && (
          <OCRReceiptPreview
            imageUrl={transaction.imageUrl}
            source={transaction.source}
          />
        )}
      </ScrollView>

      {/* ─── BOTTOM ACTION BUTTONS ───────────────────────────────────────────── */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row gap-3">
          {/* Edit Button */}
          <TouchableOpacity
            onPress={handleEditTransaction}
            disabled={isDeleting}
            className="flex-1 bg-teal-100 rounded-lg py-3 items-center justify-center"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="pencil" size={18} color="#0d9488" />
              <Text className="text-teal-700 font-semibold">Chỉnh sửa</Text>
            </View>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDeleteTransaction}
            disabled={isDeleting}
            className="flex-1 bg-red-100 rounded-lg py-3 items-center justify-center"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Ionicons name="trash" size={18} color="#ef4444" />
                <Text className="text-red-600 font-semibold">Xóa</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TransactionDetailViewScreen;
