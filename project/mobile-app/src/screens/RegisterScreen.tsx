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
import { fetchWithAuth } from '../services/api';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine(val => val === true, { message: 'Bạn phải đồng ý với điều khoản sử dụng' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', agreedToTerms: false }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password
        }),
      });
      
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            className="mb-6 mt-2"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-primary font-bold">← Quay lại</Text>
          </TouchableOpacity>

          <View className="mb-6">
            <Text className="text-3xl font-extrabold text-text mb-2">Tạo tài khoản</Text>
            <Text className="text-gray-500 font-medium">Bắt đầu quản lý tài chính hiệu quả</Text>
          </View>
          
          <Card>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Họ và tên" 
                  placeholder="Nhập họ tên của bạn" 
                  value={value}
                  onChangeText={onChange}
                  error={errors.fullName?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input 
                  label="Xác nhận mật khẩu" 
                  placeholder="Nhập lại mật khẩu" 
                  value={value}
                  onChangeText={onChange}
                  isPassword
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="agreedToTerms"
              render={({ field: { onChange, value } }) => (
                <View className="mb-6 mt-2">
                  <View className="flex-row items-center">
                    <TouchableOpacity 
                      className={`w-6 h-6 rounded border ${value ? 'bg-primary border-primary' : 'bg-white border-gray-300'} items-center justify-center mr-3`}
                      onPress={() => onChange(!value)}
                    >
                      {value && <Text className="text-white text-xs font-bold">✓</Text>}
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-600 flex-1">
                      Tôi đồng ý với <Text className="text-primary font-bold">Điều khoản sử dụng</Text> và <Text className="text-primary font-bold">Chính sách bảo mật</Text>
                    </Text>
                  </View>
                  {errors.agreedToTerms && <Text className="text-red-500 text-xs mt-1 ml-9">{errors.agreedToTerms.message}</Text>}
                </View>
              )}
            />

            <View className="mt-2">
              <Button title="Đăng ký" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
            </View>
          </Card>
          
          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
