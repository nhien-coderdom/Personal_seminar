import { useEffect, useCallback } from 'react';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
  SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ScannerState } from '../types/scanner.types';
import { ANIMATION_DURATIONS } from '../constants/scanner.constants';

interface DetectionAnimationResult {
  scanLineY: SharedValue<number>;
  borderOpacity: SharedValue<number>;
  borderGlow: SharedValue<number>;
  cornerScale: SharedValue<number>;
  detectedScale: SharedValue<number>;
  startIdleAnimation: () => void;
  startDetectingAnimation: () => void;
  startDetectedAnimation: () => void;
  stopAllAnimations: () => void;
}

/**
 * Hook quản lý toàn bộ animation của AI detection
 */
export function useDetectionAnimation(state: ScannerState): DetectionAnimationResult {
  const scanLineY = useSharedValue(0);
  const borderOpacity = useSharedValue(0.6);
  const borderGlow = useSharedValue(0);
  const cornerScale = useSharedValue(1);
  const detectedScale = useSharedValue(0);

  const startIdleAnimation = useCallback(() => {
    // Slow border pulse khi idle
    borderOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false
    );
    borderGlow.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1200 }),
        withTiming(0.7, { duration: 1200 }),
      ),
      -1,
      false
    );
  }, []);

  const startDetectingAnimation = useCallback(() => {
    // Scan line chạy từ trên xuống
    scanLineY.value = 0;
    scanLineY.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATIONS.scanLineCycle,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );

    // Border pulse nhanh hơn
    borderOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 600 }),
        withTiming(1.0, { duration: 600 }),
      ),
      -1,
      false
    );

    // Corner scale pulse
    cornerScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1.0, { duration: 500 }),
      ),
      -1,
      false
    );
  }, []);

  const startDetectedAnimation = useCallback(() => {
    // Dừng scan line
    cancelAnimation(scanLineY);
    scanLineY.value = withTiming(0.5, { duration: 300 });

    // Glow mạnh khi detected
    borderOpacity.value = withTiming(1, { duration: 300 });
    borderGlow.value = withTiming(1, { duration: 300 });
    cornerScale.value = withTiming(1, { duration: 200 });

    // Detected badge animation
    detectedScale.value = withSequence(
      withTiming(1.15, { duration: 300, easing: Easing.out(Easing.back(2)) }),
      withTiming(1.0, { duration: 150 })
    );

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const stopAllAnimations = useCallback(() => {
    cancelAnimation(scanLineY);
    cancelAnimation(borderOpacity);
    cancelAnimation(borderGlow);
    cancelAnimation(cornerScale);
    cancelAnimation(detectedScale);
  }, []);

  useEffect(() => {
    switch (state) {
      case 'idle':
        startIdleAnimation();
        break;
      case 'detecting':
        startDetectingAnimation();
        break;
      case 'detected':
        startDetectedAnimation();
        break;
      case 'capturing':
      case 'processing':
        stopAllAnimations();
        borderOpacity.value = withTiming(0.3, { duration: 200 });
        break;
    }

    return () => {
      stopAllAnimations();
    };
  }, [state]);

  return {
    scanLineY,
    borderOpacity,
    borderGlow,
    cornerScale,
    detectedScale,
    startIdleAnimation,
    startDetectingAnimation,
    startDetectedAnimation,
    stopAllAnimations,
  };
}
