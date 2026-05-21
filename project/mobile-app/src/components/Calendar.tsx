import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTransactionStore, ITransaction } from '../store/transactionStore';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string; // YYYY-MM-DD
}

interface DayIndicatorData {
  date: string;
  total: number;
  ocrCount: number;
  manualCount: number;
  firstOcrImage?: string;
}

export default function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const { monthlyTransactions, fetchMonthlyTransactions } = useTransactionStore();

  // Fetch monthly transactions when month changes
  useEffect(() => {
    const yearMonth = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    console.log(`[CALENDAR] Fetching transactions for month: ${yearMonth}`);
    fetchMonthlyTransactions(yearMonth);
  }, [currentMonth, fetchMonthlyTransactions]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Get transactions for a specific day
  const getTransactionsForDay = (day: number): ITransaction[] => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthlyTransactions.filter(tx => tx.createdAt.startsWith(dateStr));
  };

  // Compute indicator data for a day
  const getIndicatorData = (day: number): DayIndicatorData | null => {
    const dayTransactions = getTransactionsForDay(day);
    
    if (dayTransactions.length === 0) {
      console.log(`[CALENDAR] Day ${day}: no transactions`);
      return null;
    }

    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const ocrTransactions = dayTransactions.filter(tx => tx.source === 'ocr');
    const manualTransactions = dayTransactions.filter(tx => tx.source === 'manual');
    const total = dayTransactions.length;

    console.log(`[TRANSACTION] Day ${day}: total=${total}, ocr=${ocrTransactions.length}, manual=${manualTransactions.length}`);

    if (ocrTransactions.length > 0) {
      console.log(`[OCR] Day ${day}: found ${ocrTransactions.length} OCR transactions, first image: ${ocrTransactions[0].imageUrl || 'none'}`);
    }
    if (manualTransactions.length > 0) {
      console.log(`[MANUAL] Day ${day}: found ${manualTransactions.length} manual transactions`);
    }

    return {
      date: dateStr,
      total,
      ocrCount: ocrTransactions.length,
      manualCount: manualTransactions.length,
      firstOcrImage: ocrTransactions[0]?.imageUrl,
    };
  };

  const handleDatePress = (day: number) => {
    if (!day) return;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log(`[CALENDAR] User selected date: ${dateStr}`);
    onDateSelect(dateStr);
  };

  const isSelected = (day: number) => {
    if (!day) return false;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  const formatBadgeText = (count: number): string => {
    return count > 99 ? '99+' : String(count);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm mb-6">
      <View className="flex-row justify-between items-center mb-4 px-2">
        <TouchableOpacity 
          className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-2"
          onPress={() => {
            const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
            setCurrentMonth(prev);
          }}
        >
          <Text className="font-bold text-lg text-text">
            {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-primary rounded-full px-4 py-2"
          onPress={() => {
            const now = new Date();
            setCurrentMonth(now);
            onDateSelect(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
          }}
        >
          <Text className="text-white font-bold text-sm">Hôm nay</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-2 px-2">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
          <Text key={i} className={`w-10 text-center text-xs font-bold ${i === 6 ? 'text-red-500' : 'text-gray-400'}`}>
            {d}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap px-1">
        {days.map((day, index) => {
          // Only compute indicator data for actual days (not padding)
          const indicatorData = day ? getIndicatorData(day) : null;
          
          return (
            <TouchableOpacity 
              key={index} 
              className="w-[14.28%] p-1 mb-2 aspect-square"
              onPress={() => day && handleDatePress(day)}
              disabled={!day}
            >
              {day && (
                <View 
                  className={`w-full h-full rounded-2xl items-center justify-center relative overflow-hidden ${
                    isSelected(day) ? 'bg-primary' : 'bg-gray-50'
                  }`}
                >
                  {/* Date Number */}
                  <Text 
                    className={`font-medium text-sm ${
                      isSelected(day) ? 'text-white font-bold' : 'text-text'
                    }`}
                  >
                    {day}
                  </Text>

                  {/* Transaction Indicators - Below date number */}
                  {indicatorData && (
                    <View className="absolute bottom-0.5 w-full flex-row items-center justify-center">
                      {/* CASE 1: ONLY MANUAL TRANSACTIONS */}
                      {indicatorData.ocrCount === 0 && indicatorData.manualCount > 0 && (
                        <View className="bg-purple-500 rounded-full w-5 h-5 items-center justify-center">
                          <Text className="text-white font-bold text-xs">
                            {formatBadgeText(indicatorData.manualCount)}
                          </Text>
                        </View>
                      )}

                      {/* CASE 2 & 4: OCR (with or without manual) */}
                      {indicatorData.ocrCount > 0 && (
                        <View className="relative">
                          {/* OCR Thumbnail */}
                          {indicatorData.firstOcrImage ? (
                            <Image
                              source={{ uri: indicatorData.firstOcrImage }}
                              className="w-6 h-6 rounded"
                              style={{ resizeMode: 'cover' }}
                            />
                          ) : (
                            /* Fallback: Gray placeholder for OCR */
                            <View className="w-6 h-6 rounded bg-gray-400 items-center justify-center">
                              <Text className="text-white text-xs font-bold">📷</Text>
                            </View>
                          )}

                          {/* Badge (Total count: OCR + Manual) */}
                          <View className="absolute -top-1 -right-1 bg-purple-500 rounded-full w-4 h-4 items-center justify-center border border-white">
                            <Text className="text-white font-bold text-xs">
                              {formatBadgeText(indicatorData.total)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
