import React from 'react';
import { View, ViewProps } from 'react-native';

export default function Card({ children, className, ...props }: ViewProps) {
  return (
    <View className={`bg-card p-6 rounded-2xl shadow-sm border border-gray-100 ${className || ''}`} {...props}>
      {children}
    </View>
  );
}