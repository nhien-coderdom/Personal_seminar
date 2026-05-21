import { useSharedValue, withSpring, withTiming, withSequence, SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

interface CaptureAnimationResult {
  captureScale: SharedValue<number>;
  captureRingScale: SharedValue<number>;
  captureRingOpacity: SharedValue<number>;
  flashOpacity: SharedValue<number>;
  triggerCapture: () => void;
}

/**
 * Hook animation cho nút chụp ảnh (capture button)
 */
export function useCaptureAnimation(): CaptureAnimationResult {
  const captureScale = useSharedValue(1);
  const captureRingScale = useSharedValue(1);
  const captureRingOpacity = useSharedValue(0.5);
  const flashOpacity = useSharedValue(0);

  const triggerCapture = useCallback(() => {
    // Haptic impact
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Button scale press
    captureScale.value = withSequence(
      withTiming(0.88, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );

    // Ring ripple expand
    captureRingScale.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(1.6, { duration: 400 })
    );
    captureRingOpacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 400 })
    );

    // Screen flash
    flashOpacity.value = withSequence(
      withTiming(0.8, { duration: 80 }),
      withTiming(0, { duration: 300 })
    );
  }, []);

  return {
    captureScale,
    captureRingScale,
    captureRingOpacity,
    flashOpacity,
    triggerCapture,
  };
}
