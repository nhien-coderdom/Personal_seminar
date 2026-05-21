import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { ScannerState } from '../../types/scanner.types';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CaptureButtonProps {
  onPress: () => void;
  state: ScannerState;
  captureScale: SharedValue<number>;
  captureRingScale: SharedValue<number>;
  captureRingOpacity: SharedValue<number>;
}

/**
 * CaptureButton — Nút chụp lớn ở giữa bottom controls
 * States: idle, detected (xanh neon), capturing/processing (disabled)
 */
export function CaptureButton({
  onPress,
  state,
  captureScale,
  captureRingScale,
  captureRingOpacity,
}: CaptureButtonProps) {
  const isDisabled = state === 'capturing' || state === 'processing';
  const isDetected = state === 'detected';

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
    opacity: isDisabled ? 0.5 : 1,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureRingScale.value }],
    opacity: captureRingOpacity.value,
  }));

  return (
    <View
      style={styles.wrapper}
      accessibilityLabel="Chụp hóa đơn"
      accessibilityRole="button"
    >
      {/* Ripple ring */}
      <Animated.View
        style={[
          styles.ring,
          { borderColor: isDetected ? '#00E676' : 'rgba(255,255,255,0.5)' },
          ringStyle,
        ]}
      />

      {/* Static outer ring */}
      <View
        style={[
          styles.outerRing,
          { borderColor: isDetected ? '#00E676' : 'rgba(255,255,255,0.3)' },
        ]}
      />

      {/* Main button */}
      <AnimatedTouchable
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.button, isDetected && styles.buttonDetected, buttonStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
  },
  outerRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDetected: {
    backgroundColor: '#f0fff8',
    shadowColor: '#00E676',
    shadowOpacity: 0.6,
  },
});
