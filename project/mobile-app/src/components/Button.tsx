import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', isLoading, disabled }: ButtonProps) {
  const baseClass = "p-4 rounded-xl items-center justify-center flex-row";
  let variantClass = "bg-primary";
  let textClass = "text-white font-bold text-lg";

  if (variant === 'secondary') {
    variantClass = "bg-secondary";
  } else if (variant === 'outline') {
    variantClass = "bg-transparent border-2 border-primary";
    textClass = "text-primary font-bold text-lg";
  }

  if (disabled || isLoading) {
    variantClass += " opacity-50";
  }

  return (
    <TouchableOpacity 
      className={`${baseClass} ${variantClass}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading && <ActivityIndicator color={variant === 'outline' ? '#4F46E5' : '#fff'} className="mr-2" />}
      <Text className={textClass}>{title}</Text>
    </TouchableOpacity>
  );
}