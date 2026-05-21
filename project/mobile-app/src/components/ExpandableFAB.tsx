import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';

interface ExpandableFABProps {
  onManualTransactionPress: () => void;
  onScanReceiptPress: () => void;
}

export default function ExpandableFAB({
  onManualTransactionPress,
  onScanReceiptPress,
}: ExpandableFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    console.log(`[FAB] ${isExpanded ? 'Collapsed' : 'Expanded'} quick actions`);
    
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsExpanded(!isExpanded);
  };

  const handleManualTransaction = () => {
    console.log('[FAB] Navigate to ManualTransactionScreen');
    setIsExpanded(false);
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    onManualTransactionPress();
  };

  const handleScanReceipt = () => {
    console.log('[FAB] Navigate to OCRScanScreen');
    setIsExpanded(false);
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    onScanReceiptPress();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View className="absolute bottom-6 right-6 items-center">
      {/* Overlay when expanded */}
      {isExpanded && (
        <TouchableOpacity
          className="absolute w-full h-full"
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            left: -Dimensions.get('window').width / 2 + 32,
            top: -Dimensions.get('window').height / 2 + 32,
          }}
          onPress={toggleExpand}
        />
      )}

      {/* Action Buttons Container */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        }}
        className="absolute bottom-20 gap-3"
      >
        {/* Quét hóa đơn Button */}
        <TouchableOpacity
          onPress={handleScanReceipt}
          className="flex-row items-center justify-end gap-3 mb-3"
        >
          <View className="bg-white rounded-lg px-4 py-3 shadow-md">
            <Text className="text-text font-semibold text-sm">Quét hóa đơn</Text>
          </View>
          <View className="w-14 h-14 bg-secondary rounded-full items-center justify-center border-2 border-primary shadow-md">
            <Text className="text-2xl">📸</Text>
          </View>
        </TouchableOpacity>

        {/* Nhập thủ công Button */}
        <TouchableOpacity
          onPress={handleManualTransaction}
          className="flex-row items-center justify-end gap-3"
        >
          <View className="bg-white rounded-lg px-4 py-3 shadow-md">
            <Text className="text-text font-semibold text-sm">Nhập thủ công</Text>
          </View>
          <View className="w-14 h-14 bg-secondary rounded-full items-center justify-center border-2 border-primary shadow-md">
            <Text className="text-2xl">✏️</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main FAB Button */}
      <TouchableOpacity
        onPress={toggleExpand}
        className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Animated.Text
          style={{
            transform: [{ rotate }],
          }}
          className="text-white text-3xl"
        >
          +
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}
