import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassButtonProps } from '../../types/scanner.types';

/**
 * GlassButton — Nút kính mờ trong suốt dùng trong header scanner
 */
export function GlassButton({
  onPress,
  icon,
  size = 44,
  disabled = false,
  accessibilityLabel,
}: GlassButtonProps) {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    opacity: disabled ? 0.4 : 1,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={containerStyle}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={styles.blur}
      >
        {icon}
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
  },
});
