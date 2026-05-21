import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTransactionStore } from '../store/transactionStore';

export default function TransactionDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const date = route.params?.date;
  
  const { 
    selectedTransactions, 
    totalIncome, 
    totalExpense, 
    isLoading, 
    error,
    fetchTransactionsByDate
  } = useTransactionStore();

  useEffect(() => {
    console.log('[DETAIL] TransactionDetailScreen (Date view) mounted with date:', date);
    if (date) {
      console.log('[STORE] Fetching transactions for selected date:', date);
      fetchTransactionsByDate(date);
    }
  }, [date]);

  // Log when transactions are loaded
  React.useEffect(() => {
    if (!isLoading && selectedTransactions.length > 0) {
      console.log(`[STORE] Loaded ${selectedTransactions.length} transactions for date: ${date}`);
    }
  }, [selectedTransactions, isLoading]);

  const netBalance = totalIncome - totalExpense;
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(`[NAVIGATION] Transaction item clicked from date view: ${item.id}`);
        console.log('[NAVIGATION] Navigating to TransactionDetailView');
        navigation.navigate('TransactionDetailView', { transactionId: item.id });
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Text className="text-xl">{item.category?.icon || '🛒'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-text font-bold text-base">{item.category?.name || 'Giao dịch'}</Text>
            <Text className="text-gray-400 text-xs">{item.note || 'Không có ghi chú'}</Text>
          </View>
        </View>
        <Text className={`font-bold text-lg ${item.type === 'income' ? 'text-green-500' : 'text-text'}`}>
          {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Text className="font-bold text-xl text-text">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text">
          {date ? formatDate(date) : 'Chi tiết giao dịch'}
        </Text>
        <View className="w-10 h-10" />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-primary px-6 py-2 rounded-full"
            onPress={() => date && fetchTransactionsByDate(date)}
          >
            <Text className="text-white font-bold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* SUMMARY */}
          <View className="mx-4 mb-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-500 text-xs font-medium mb-1">Thu nhập</Text>
                <Text className="text-blue-600 font-bold text-base">{totalIncome.toLocaleString('vi-VN')} đ</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-xs font-medium mb-1">Chi tiêu</Text>
                <Text className="text-red-500 font-bold text-base">{totalExpense.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
            <View className="h-[1px] bg-gray-100 w-full mb-4" />
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 font-bold">Biến động số dư</Text>
              <Text className={`font-bold text-lg ${netBalance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>

          {/* TRANSACTIONS LIST */}
          <View className="flex-1 px-4">
            <Text className="text-lg font-bold text-text mb-4">
              Giao dịch ({selectedTransactions.length})
            </Text>
            {selectedTransactions.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-6xl mb-4">📭</Text>
                <Text className="text-gray-500 text-center font-medium">Không có giao dịch nào{'\n'}trong ngày này</Text>
              </View>
            ) : (
              <FlatList
                data={selectedTransactions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
