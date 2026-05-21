import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import TransactionCard from '../components/TransactionCard';
import { useTransactionStore } from '../store/transactionStore';

export default function TransactionScreen() {
  const { monthlyTransactions, isLoading, fetchMonthlyTransactions } = useTransactionStore();

  useEffect(() => {
    console.log('[DETAIL] TransactionScreen (Tab "Giao dịch") mounted');
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    console.log('[STORE] Fetching monthly transactions for:', yearMonth);
    fetchMonthlyTransactions(yearMonth);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('[DETAIL] TransactionScreen focused - refreshing transaction history');
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      fetchMonthlyTransactions(yearMonth);
    }, [])
  );

  const expenseTransactions = monthlyTransactions.filter(t => t.type === 'expense');
  const incomeTransactions = monthlyTransactions.filter(t => t.type === 'income');

  // Calculate totals
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Log when transactions are loaded
  React.useEffect(() => {
    if (!isLoading && monthlyTransactions.length > 0) {
      console.log(`[STORE] Loaded ${monthlyTransactions.length} total transactions`);
      console.log(`[STORE] Expense: ${expenseTransactions.length}, Income: ${incomeTransactions.length}`);
    }
  }, [monthlyTransactions, isLoading]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-text">Giao dịch</Text>
          <Text className="text-sm text-gray-600 mt-2">Lịch sử tháng này</Text>
        </View>

        {/* Summary Cards */}
        {monthlyTransactions.length > 0 && (
          <View className="px-4 mb-6 gap-3 flex-row">
            {/* Expense Summary */}
            {expenseTransactions.length > 0 && (
              <View className="flex-1 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
                <Text className="text-xs font-semibold text-gray-600 mb-1">Chi tiêu</Text>
                <Text className="text-xl font-bold text-red-600">
                  ₫{totalExpense.toLocaleString('vi-VN')}
                </Text>
              </View>
            )}

            {/* Income Summary */}
            {incomeTransactions.length > 0 && (
              <View className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                <Text className="text-xs font-semibold text-gray-600 mb-1">Thu nhập</Text>
                <Text className="text-xl font-bold text-green-600">
                  ₫{totalIncome.toLocaleString('vi-VN')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Loading State */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-500 mt-4 text-sm">Đang tải dữ liệu...</Text>
          </View>
        ) : monthlyTransactions.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-4">
            <Text className="text-6xl mb-4">📭</Text>
            <Text className="text-text font-bold text-lg text-center">Chưa có giao dịch nào</Text>
            <Text className="text-gray-600 text-center mt-3 text-sm">
              Sử dụng nút + trên trang chủ để tạo giao dịch đầu tiên của bạn
            </Text>
          </View>
        ) : (
          <View className="px-4 pb-8">
            {/* Expense Section */}
            {expenseTransactions.length > 0 && (
              <View className="mb-8">
                <View className="flex-row items-center mb-4 pb-3 border-b border-gray-200">
                  <Text className="text-lg font-bold text-text">📤 Chi tiêu gần đây</Text>
                  <Text className="text-sm text-gray-500 ml-2">({expenseTransactions.length})</Text>
                </View>
                <View className="gap-3">
                  {expenseTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </View>
              </View>
            )}

            {/* Income Section */}
            {incomeTransactions.length > 0 && (
              <View className="mb-8">
                <View className="flex-row items-center mb-4 pb-3 border-b border-gray-200">
                  <Text className="text-lg font-bold text-text">📥 Thu nhập</Text>
                  <Text className="text-sm text-gray-500 ml-2">({incomeTransactions.length})</Text>
                </View>
                <View className="gap-3">
                  {incomeTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}