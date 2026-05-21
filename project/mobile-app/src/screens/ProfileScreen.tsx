import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-text mb-6 mt-2">Hồ sơ cá nhân</Text>
        
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary rounded-full items-center justify-center shadow-sm mb-4">
            <Text className="text-3xl text-white font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
          <Text className="text-xl font-bold text-text">{user?.name || 'Người dùng'}</Text>
          <Text className="text-gray-500">{user?.email || 'email@example.com'}</Text>
        </View>

        <Card className="mb-4 p-0 overflow-hidden">
          <View className="p-4 border-b border-gray-100 flex-row justify-between">
            <Text className="text-text font-medium">Cài đặt tài khoản</Text>
            <Text className="text-gray-400">&gt;</Text>
          </View>
          <View className="p-4 border-b border-gray-100 flex-row justify-between">
            <Text className="text-text font-medium">Thông báo</Text>
            <Text className="text-gray-400">&gt;</Text>
          </View>
          <View className="p-4 flex-row justify-between">
            <Text className="text-text font-medium">Bảo mật</Text>
            <Text className="text-gray-400">&gt;</Text>
          </View>
        </Card>

        <View className="mt-4">
          <Button 
            title="Đăng xuất" 
            onPress={handleLogout} 
            variant="outline" 
          />
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}