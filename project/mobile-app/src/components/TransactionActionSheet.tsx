import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
} from 'react-native';

interface TransactionActionSheetProps {
  visible: boolean;
  onManualTransactionPress: () => void;
  onScanReceiptPress: () => void;
  onClose: () => void;
}

export default function TransactionActionSheet({
  visible,
  onManualTransactionPress,
  onScanReceiptPress,
  onClose,
}: TransactionActionSheetProps) {
  const slideAnim = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleManualTransaction = () => {
    console.log('[ACTION_SHEET] Nhập thủ công selected');
    onClose();
    // Add small delay to allow sheet to close first
    setTimeout(onManualTransactionPress, 100);
  };

  const handleScanReceipt = () => {
    console.log('[ACTION_SHEET] Quét hóa đơn selected');
    onClose();
    // Add small delay to allow sheet to close first
    setTimeout(onScanReceiptPress, 100);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Dark Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50"
      />

      {/* Action Sheet */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl"
      >
        <SafeAreaView className="bg-white">
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Title */}
          <View className="px-6 pb-2">
            <Text className="text-xl font-bold text-text">Tạo giao dịch mới</Text>
            <Text className="text-sm text-gray-500 mt-1">Chọn cách thức nhập liệu</Text>
          </View>

          {/* Actions */}
          <View className="px-6 py-4 gap-3">
            {/* Nhập thủ công Action */}
            <TouchableOpacity
              onPress={handleManualTransaction}
              className="flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
            >
              <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-4">
                <Text className="text-2xl">✏️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-text">Nhập thủ công</Text>
                <Text className="text-xs text-gray-600 mt-1">Nhập thông tin giao dịch trực tiếp</Text>
              </View>
              <Text className="text-gray-300 text-xl">›</Text>
            </TouchableOpacity>

            {/* Quét hóa đơn Action */}
            <TouchableOpacity
              onPress={handleScanReceipt}
              className="flex-row items-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200"
            >
              <View className="w-12 h-12 rounded-full bg-purple-500 items-center justify-center mr-4">
                <Text className="text-2xl">📸</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-text">Quét hóa đơn</Text>
                <Text className="text-xs text-gray-600 mt-1">Chụp ảnh hoặc chọn từ thư viện</Text>
              </View>
              <Text className="text-gray-300 text-xl">›</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-100 rounded-2xl py-3 items-center"
            >
              <Text className="text-text font-semibold">Hủy</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}
