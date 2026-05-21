import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    console.log("[APP] Application started. Initializing Splash Screen...");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center">
      <Animated.View style={{ opacity: fadeAnim }} className="items-center">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
          <Text className="text-4xl font-extrabold text-primary">S</Text>
        </View>
        <Text className="text-4xl font-extrabold text-white mb-2 tracking-wider">S.Budget</Text>
        <Text className="text-white/80 text-lg mb-12 font-medium">Quản lý chi tiêu thông minh</Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </Animated.View>
    </SafeAreaView>
  );
}
