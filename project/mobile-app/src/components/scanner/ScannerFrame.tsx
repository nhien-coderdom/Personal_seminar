import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { SCANNER_COLORS, SCANNER_DIMENSIONS } from '../../constants/scanner.constants';
import { ScannerState } from '../../types/scanner.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRAME_W = SCREEN_WIDTH * SCANNER_DIMENSIONS.frameWidthPercent;
const FRAME_H = SCREEN_HEIGHT * SCANNER_DIMENSIONS.frameHeightPercent;
const CORNER = SCANNER_DIMENSIONS.cornerSize;
const THICKNESS = SCANNER_DIMENSIONS.cornerThickness;

interface ScannerFrameProps {
  state: ScannerState;
  scanLineY: SharedValue<number>;
  borderOpacity: SharedValue<number>;
  borderGlow: SharedValue<number>;
  cornerScale: SharedValue<number>;
}

/**
 * ScannerFrame — Khung quét với corner brackets glow, scan line laser và detection animation
 */
export function ScannerFrame({
  state,
  scanLineY,
  borderOpacity,
  borderGlow,
  cornerScale,
}: ScannerFrameProps) {
  const isDetected = state === 'detected';
  const isDetecting = state === 'detecting';
  const borderColor = isDetected ? SCANNER_COLORS.detectedGlow : SCANNER_COLORS.cornerGlow;

  const scanLineStyle = useAnimatedStyle(() => ({
    top: interpolate(scanLineY.value, [0, 1], [0, FRAME_H - 2], Extrapolation.CLAMP),
    opacity: isDetecting
      ? interpolate(scanLineY.value, [0, 0.05, 0.95, 1], [0, 1, 1, 0], Extrapolation.CLAMP)
      : 0,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  const cornerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cornerScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: borderGlow.value * 0.6,
    shadowOpacity: borderGlow.value * 0.8,
  }));

  return (
    <View style={[styles.frame, { width: FRAME_W, height: FRAME_H }]}>
      {/* Outer glow border */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBorder,
          { borderColor, shadowColor: borderColor },
          glowStyle,
        ]}
      />

      {/* Main border */}
      <Animated.View
        pointerEvents="none"
        style={[styles.mainBorder, { borderColor }, borderStyle]}
      />



      {/* Laser scan line */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.scanLine,
          {
            backgroundColor: SCANNER_COLORS.scanLine,
            shadowColor: SCANNER_COLORS.scanLine,
          },
          scanLineStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
  },
  mainBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: THICKNESS,
    borderRadius: 12,
  },
  glowBorder: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderWidth: THICKNESS + 1,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 0,
  },
  cornerWrapper: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
  },
  cornerH: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: THICKNESS,
    width: CORNER,
  },
  cornerV: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: THICKNESS,
    height: CORNER,
  },
  topLeft: {
    top: -1,
    left: -1,
  },
  topRight: {
    top: -1,
    right: -1,
    transform: [{ scaleX: -1 }],
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    transform: [{ scaleY: -1 }],
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.9,
    elevation: 4,
  },
});
