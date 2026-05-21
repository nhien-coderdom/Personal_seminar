import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ITransaction } from '../store/transactionStore';

export default function TransactionCard({ transaction }: { transaction: ITransaction }) {
  const navigation = useNavigation<any>();
  const isExpense = transaction.type === 'expense';
  
  // Category name (never null/undefined)
  const categoryName = transaction.category?.name || 'Khác';
  const categoryIcon = transaction.category?.icon || '📋';
  
  // Date formatting
  const dateStr = new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleCardPress = () => {
    console.log(`[NAVIGATION] Transaction card clicked: ${transaction.id}`);
    console.log('[NAVIGATION] Navigate to TransactionDetailView');
    navigation.navigate('TransactionDetailView', { transactionId: transaction.id });
  };

  return (
    <TouchableOpacity 
      onPress={handleCardPress}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center p-4">
        {/* Left: Category Icon/Avatar */}
        <View 
          className={`w-14 h-14 rounded-full items-center justify-center ${
            isExpense ? 'bg-red-50' : 'bg-green-50'
          }`}
        >
          <Text className="text-2xl">{categoryIcon}</Text>
        </View>

        {/* Center: Category Name, Date, Note, OCR Badge */}
        <View className="flex-1 ml-3">
          {/* Category Title */}
          <Text className="font-bold text-text text-base mb-1">
            {categoryName}
          </Text>
          
          {/* Date & OCR Badge */}
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-gray-500 text-xs">📅 {dateStr}</Text>
            {transaction.source === 'ocr' && (
              <View className="bg-purple-100 rounded-full px-2 py-0.5">
                <Text className="text-purple-700 text-xs font-semibold">📸 OCR</Text>
              </View>
            )}
          </View>

          {/* Note (optional subtitle) */}
          {transaction.note && (
            <Text className="text-gray-600 text-xs line-clamp-1 mt-0.5">
              {transaction.note}
            </Text>
          )}
        </View>

        {/* Right: Amount */}
        <View className="items-end ml-2">
          <Text 
            className={`font-bold text-lg ${isExpense ? 'text-red-600' : 'text-green-600'}`}
          >
            {isExpense ? '-' : '+'}₫{transaction.amount.toLocaleString('vi-VN')}
          </Text>
          <Text className={`text-xs mt-1 ${isExpense ? 'text-red-500/60' : 'text-green-500/60'}`}>
            {transaction.type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}