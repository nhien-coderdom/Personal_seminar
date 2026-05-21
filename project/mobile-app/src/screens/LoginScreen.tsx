import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useAuthStore } from '../store/authStore';
import { fetchWithAuth } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const signIn = useAuthStore((state) => state.signIn);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("[AUTH] Starting login process...");
    console.log("[LOADING] Set isLoading to true");
    setIsLoading(true);
    try {
      console.log(`[API] POST /auth/login with email: ${data.email}`);
      const response = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      console.log("[API] Response received from /auth/login");
      // Assuming response contains { accessToken, user }
      if (response && response.accessToken) {
        console.log("[TOKEN] Access token received");
        await signIn(response.accessToken, response.user || { id: '1', email: data.email });
        console.log("[NAVIGATION] Navigate to MainApp automatically via RootNavigator");
      } else {
        console.error("[AUTH] Error: Token is missing in response", response);
        throw new Error('Không nhận được token từ server');
      }
    } catch (error: any) {
      console.error("[AUTH ERROR] Login failed:", error.message || error);
      Alert.alert('Đăng nhập thất bại', error.message || 'Sai tài khoản hoặc mật khẩu.');
    } finally {
      console.log("[LOADING] Set isLoading to false");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }} showsVerticalScrollIndicator={false}>
          <View className="items-center mb-10">
            <Text className="text-4xl font-extrabold text-primary mb-2">S.Budget</Text>
            <Text className="text-gray-500 font-medium">Quản lý chi tiêu thông minh</Text>
          </View>
          
          <Card>
            <Text className="text-2xl font-bold text-text mb-6">Đăng nhập</Text>
            
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Email" 
                  placeholder="Nhập email của bạn" 
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Mật khẩu" 
                  placeholder="Nhập mật khẩu" 
                  value={value}
                  onChangeText={onChange}
                  isPassword
                  error={errors.password?.message}
                />
              )}
            />

            <View className="mt-2 items-end mb-6">
              <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}>
                <Text className="text-primary font-medium">Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-2">
              <Button title="Đăng nhập" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            </View>
            
            <View className="mt-6 flex-row justify-center items-center">
              <Text className="text-gray-500">Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-primary font-bold">Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}