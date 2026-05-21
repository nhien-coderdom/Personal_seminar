import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ label, error, isPassword, ...props }: InputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View className="mb-4 w-full">
      <Text className="text-sm font-medium text-text mb-1">{label}</Text>
      <View className={`w-full bg-white border ${error ? 'border-red-500' : 'border-gray-200'} rounded-xl flex-row items-center`}>
        <TextInput 
          className="flex-1 p-4 text-text"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsSecure(!isSecure)}
            className="pr-4 py-4"
          >
            <Text className="text-primary font-medium text-sm">{isSecure ? 'Hiện' : 'Ẩn'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}