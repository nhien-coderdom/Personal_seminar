import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTransactionStore, ICategory } from '../store/transactionStore';

export default function ManualTransactionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { createTransaction, fetchCategories, categories } = useTransactionStore();

  // Get selectedDate from route params (passed from Dashboard)
  const selectedDateFromRoute = route.params?.selectedDate;
  const defaultDate = selectedDateFromRoute || new Date().toISOString().split('T')[0];

  console.log(`[MANUAL_TRANSACTION] Screen opened with selectedDate: ${selectedDateFromRoute}`);

  const [saving, setSaving] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: defaultDate,
    note: '',
    isIncome: false,
  });

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    console.log('[MANUAL_TRANSACTION] Screen mounted');
    console.log(`[DATE_SYNC] Form initialized with date: ${defaultDate}`);
    
    // Fetch real categories from backend
    fetchCategories();
  }, []);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const expenseCategory = categories.find(c => c.name.includes('Ăn')) || categories[0];
      setSelectedCategory(expenseCategory);
      setFormData(prev => ({ ...prev, categoryId: expenseCategory.id }));
      console.log('[MANUAL_TRANSACTION] Default category set:', expenseCategory.name);
    }
  }, [categories]);

  const handleCategorySelect = (category: ICategory) => {
    console.log('[MANUAL_TRANSACTION] Category selected:', category.name);
    setSelectedCategory(category);
    setFormData({ ...formData, categoryId: category.id });
    setShowCategoryPicker(false);
  };

  // Realtime currency formatting for amount input
  const handleAmountChange = (text: string) => {
    // Remove all non-digit characters
    const cleanedText = text.replace(/[^\d]/g, '');
    
    console.log('[FORM] Amount input changed:', cleanedText);
    
    setAmountInput(cleanedText);
    setFormData({ ...formData, amount: cleanedText });
  };

  // Format number with thousand separators
  const formatCurrency = (value: string): string => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleDateChange = (text: string) => {
    console.log('[DATE_SYNC] Date field changed:', text);
    setFormData({ ...formData, date: text });
  };

  const handleNoteChange = (text: string) => {
    setFormData({ ...formData, note: text });
  };

  const handleTypeChange = (value: boolean) => {
    console.log('[FORM] Transaction type changed:', value ? 'income' : 'expense');
    setFormData({ ...formData, isIncome: value });
  };

  const validateForm = (): boolean => {
    console.log('[FORM] Validating form');

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ (lớn hơn 0)');
      return false;
    }

    if (!formData.categoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
      return false;
    }

    if (!formData.date) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày giao dịch');
      return false;
    }

    console.log('[FORM] Validation passed');
    return true;
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;

    try {
      console.log('[MANUAL_TRANSACTION] Saving transaction');
      console.log(`[DATE_SYNC] Transaction date: ${formData.date}`);
      setSaving(true);

      const transactionData = {
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        note: formData.note || selectedCategory?.name || 'Manual transaction',
        source: 'manual' as const,
        type: formData.isIncome ? ('income' as const) : ('expense' as const),
        date: formData.date,
      };

      console.log('[MANUAL_TRANSACTION] Transaction data:', transactionData);

      await createTransaction(transactionData);

      console.log('[MANUAL_TRANSACTION] Success - transaction created');

      Alert.alert('Thành công', 'Giao dịch được tạo thành công!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('[MANUAL_TRANSACTION] Closing screen');
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('[MANUAL_TRANSACTION] Error:', error);
      Alert.alert('Lỗi', 'Không thể lưu giao dịch. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const formattedAmount = formatCurrency(amountInput);
  const numAmount = parseFloat(formData.amount) || 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-3">
            <Text className="text-blue-500 font-semibold">← Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-text">Nhập thủ công</Text>
          <Text className="text-sm text-gray-600 mt-1">Tạo giao dịch mới</Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
          {/* Transaction Type */}
          <View className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-text mb-1">Loại giao dịch</Text>
                <Text className="text-xs text-gray-600">
                  {formData.isIncome ? '💰 Tiền vào' : '💤 Tiền ra'}
                </Text>
              </View>
              <Switch
                value={formData.isIncome}
                onValueChange={handleTypeChange}
                trackColor={{ false: '#fecaca', true: '#a7f3d0' }}
                thumbColor={formData.isIncome ? '#10b981' : '#ef4444'}
              />
            </View>
          </View>

          {/* Amount - Realtime Currency */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-text mb-2">Số tiền *</Text>
            <View className="bg-white border-2 border-primary rounded-2xl px-4 py-3">
              <View className="flex-row items-baseline gap-2">
                <Text className="text-2xl font-bold text-primary">₫</Text>
                <TextInput
                  className="flex-1 text-3xl font-bold text-text"
                  placeholder="0"
                  keyboardType="decimal-pad"
                  value={amountInput}
                  onChangeText={handleAmountChange}
                  placeholderTextColor="#ddd"
                />
              </View>
              {amountInput && (
                <Text className="text-base font-semibold text-primary mt-2">
                  = {formattedAmount} đ
                </Text>
              )}
            </View>
            <Text className="text-xs text-gray-500 mt-2">Nhập số tiền VND</Text>
          </View>

          {/* Category */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-text mb-2">Danh mục *</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryPicker(true)}
              className="bg-white border border-gray-300 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">{selectedCategory?.icon || '📋'}</Text>
                <Text className="text-base font-semibold text-text">{selectedCategory?.name || 'Chọn danh mục'}</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-text mb-2">Ngày giao dịch *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-2xl px-4 py-3 text-base text-text font-semibold"
              placeholder="YYYY-MM-DD"
              value={formData.date}
              onChangeText={handleDateChange}
              editable={true}
            />
            <Text className="text-xs text-gray-500 mt-2">Ví dụ: 2026-05-17</Text>
          </View>

          {/* Note */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-text mb-2">Mô tả (Tùy chọn)</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-2xl px-4 py-3 text-base text-text h-20"
              placeholder="Thêm mô tả..."
              multiline
              value={formData.note}
              onChangeText={handleNoteChange}
              placeholderTextColor="#999"
            />
          </View>

          {/* Summary Section */}
          <View className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4 border border-gray-200 mb-6">
            <Text className="text-sm font-bold text-text mb-4">Tóm tắt</Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Loại:</Text>
                <Text className={`text-sm font-bold ${formData.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.isIncome ? '📥 Tiền vào' : '📤 Tiền ra'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Số tiền:</Text>
                <Text className="text-sm font-bold text-primary">
                  {numAmount > 0 ? `₫${numAmount.toLocaleString('vi-VN')}` : '-'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
                <Text className="text-sm text-gray-600">Danh mục:</Text>
                <Text className="text-sm font-bold text-text">
                  {selectedCategory?.icon || '📋'} {selectedCategory?.name || '-'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">Ngày:</Text>
                <Text className="text-sm font-bold text-text">{formData.date}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mb-8">
            <TouchableOpacity
              onPress={handleSaveTransaction}
              disabled={saving}
              className="bg-primary rounded-2xl py-4 items-center border-2 border-primary"
            >
              {saving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-base">✓ Lưu giao dịch</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-200 rounded-2xl py-4 items-center"
            >
              <Text className="text-text font-bold">Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-3xl max-h-3/4">
              {/* Modal Header */}
              <View className="border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-text">Chọn danh mục</Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <Text className="text-2xl text-gray-400">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Category List */}
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCategorySelect(item)}
                    className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                      selectedCategory?.id === item.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <Text className="text-3xl mr-4">{item.icon || '📋'}</Text>
                    <Text className="text-base text-text flex-1 font-medium">{item.name}</Text>
                    {selectedCategory?.id === item.id && (
                      <Text className="text-lg text-primary font-bold">✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                scrollEnabled={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
