/**
 * OCRScanScreen — AI Receipt Scanner
 * Premium fintech UI with camera, glassmorphism, animations
 * Architecture: Clean components + custom hooks
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CameraView, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInDown,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { GlassButton } from '../components/ui/GlassButton';
import { AIHintCard } from '../components/ui/AIHintCard';
import { CaptureButton } from '../components/ui/CaptureButton';
import { ScannerFrame } from '../components/scanner/ScannerFrame';
import { useCameraPermissions } from '../hooks/useCameraPermissions';
import { useDetectionAnimation } from '../hooks/useDetectionAnimation';
import { useCaptureAnimation } from '../hooks/useCaptureAnimation';
import type { ScannerState } from '../types/scanner.types';
import { SCANNER_COLORS, ANIMATION_DURATIONS, SCANNER_DIMENSIONS } from '../constants/scanner.constants';

const { width: SW, height: SH } = Dimensions.get('window');
const FRAME_W = SW * SCANNER_DIMENSIONS.frameWidthPercent;
const FRAME_H = SH * SCANNER_DIMENSIONS.frameHeightPercent;
const MASK_TOP_HEIGHT = (SH - FRAME_H) / 2 - 45;


// ─────────────────────────────────────────────────────────────────────────────
// Permission View
// ─────────────────────────────────────────────────────────────────────────────
function PermissionView({ onRequest }: { onRequest: () => void }) {
  return (
    <View style={styles.permissionContainer}>
      <LinearGradient
        colors={['#0F4C81', '#081B2A']}
        style={StyleSheet.absoluteFillObject}
      />
      <Ionicons name="camera-outline" size={72} color="rgba(255,255,255,0.4)" />
      <Text style={styles.permissionTitle}>Cần quyền truy cập camera</Text>
      <Text style={styles.permissionDesc}>
        Cho phép ứng dụng sử dụng camera để quét và phân tích hóa đơn bằng AI
      </Text>
      <TouchableOpacity
        style={styles.permissionBtn}
        onPress={onRequest}
        activeOpacity={0.8}
        accessibilityLabel="Cấp quyền camera"
      >
        <Text style={styles.permissionBtnText}>Cấp quyền camera</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Processing Overlay
// ─────────────────────────────────────────────────────────────────────────────
function ProcessingOverlay() {
  const dotScale1 = useSharedValue(1);
  const dotScale2 = useSharedValue(1);
  const dotScale3 = useSharedValue(1);

  useEffect(() => {
    dotScale1.value = withRepeat(withSequence(
      withTiming(1.5, { duration: 400 }), withTiming(1, { duration: 400 })
    ), -1);
    dotScale2.value = withDelay(150, withRepeat(withSequence(
      withTiming(1.5, { duration: 400 }), withTiming(1, { duration: 400 })
    ), -1));
    dotScale3.value = withDelay(300, withRepeat(withSequence(
      withTiming(1.5, { duration: 400 }), withTiming(1, { duration: 400 })
    ), -1));
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ transform: [{ scale: dotScale1.value }] }));
  const dot2Style = useAnimatedStyle(() => ({ transform: [{ scale: dotScale2.value }] }));
  const dot3Style = useAnimatedStyle(() => ({ transform: [{ scale: dotScale3.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.processingOverlay}>
      <View style={styles.processingCard}>
        <Ionicons name="sparkles" size={32} color={SCANNER_COLORS.accent} />
        <Text style={styles.processingTitle}>AI đang phân tích...</Text>
        <View style={styles.dotsRow}>
          {[dot1Style, dot2Style, dot3Style].map((s, i) => (
            <Animated.View key={i} style={[styles.dot, s]} />
          ))}
        </View>
        <Text style={styles.processingDesc}>Đang nhận dạng nội dung hóa đơn</Text>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function OCRScanScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashEnabled, setFlashEnabled] = useState(false);

  const { cameraGranted, isLoading, requestCameraPermission } = useCameraPermissions();

  const detectionAnim = useDetectionAnimation(scannerState);
  const captureAnim = useCaptureAnimation();

  // Detected badge opacity
  const detectedBadgeOpacity = useSharedValue(0);

  // ── Reset state when screen is re-focused ────────────────────────────────
  useEffect(() => {
    if (isFocused) {
      console.log('[OCRScan] Screen focused, resetting state to idle');
      setScannerState('idle');
      detectedBadgeOpacity.value = 0;
    }
  }, [isFocused]);

  // ── Auto-detect simulation after 2.5s ───────────────────────────────────
  useEffect(() => {
    if (!cameraGranted || !isFocused) return;

    // Start detecting after camera is ready
    const detectTimer = setTimeout(() => {
      if (scannerState === 'idle') {
        setScannerState('detecting');
      }
    }, 800);

    return () => clearTimeout(detectTimer);
  }, [cameraGranted]);

  useEffect(() => {
    if (scannerState === 'detecting') {
      const detectedTimer = setTimeout(() => {
        setScannerState('detected');
        detectedBadgeOpacity.value = withSpring(1);
      }, ANIMATION_DURATIONS.detectionDelay);
      return () => clearTimeout(detectedTimer);
    }
  }, [scannerState]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (scannerState === 'capturing' || scannerState === 'processing') return;

    captureAnim.triggerCapture();
    setScannerState('capturing');
    detectedBadgeOpacity.value = withTiming(0, { duration: 200 });

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5, // Nén ảnh xuống 50% để upload cực nhanh
          skipProcessing: false,
        });

        if (photo) {
          setScannerState('processing');
          // Simulate OCR processing
          await new Promise(r => setTimeout(r, ANIMATION_DURATIONS.processingDelay));

          navigation.navigate('OCRResult', {
            image: {
              uri: photo.uri,
              name: `receipt_${Date.now()}.jpg`,
              type: 'image/jpeg',
            },
          });
        }
      }
    } catch (err) {
      console.error('[OCRScan] Capture failed:', err);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
      setScannerState('detecting');
    }
  }, [scannerState, navigation, captureAnim]);

  const handleGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép truy cập thư viện ảnh.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5, // Nén ảnh thư viện xuống 50% để upload cực nhanh
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setScannerState('processing');

        await new Promise(r => setTimeout(r, ANIMATION_DURATIONS.processingDelay));

        navigation.navigate('OCRResult', {
          image: {
            uri: asset.uri,
            name: asset.fileName || 'receipt.jpg',
            type: asset.mimeType || 'image/jpeg',
          },
        });
      }
    } catch (err) {
      console.error('[OCRScan] Gallery pick failed:', err);
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện.');
      setScannerState('idle');
    }
  }, [navigation]);

  const handleManualInput = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate('ManualTransaction', {});
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFlashToggle = useCallback(() => {
    Haptics.selectionAsync();
    setFlashEnabled(v => !v);
  }, []);

  const handleRequestPermission = useCallback(async () => {
    await requestCameraPermission();
  }, [requestCameraPermission]);

  // ── Animated styles ───────────────────────────────────────────────────────
  const detectedBadgeStyle = useAnimatedStyle(() => ({
    opacity: detectedBadgeOpacity.value,
    transform: [{ scale: detectedBadgeOpacity.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: captureAnim.flashOpacity.value,
    pointerEvents: 'none' as const,
  }));

  // ── Render guard ──────────────────────────────────────────────────────────
  if (isLoading) return null;

  if (!cameraGranted) {
    return <PermissionView onRequest={handleRequestPermission} />;
  }

  const isProcessing = scannerState === 'processing';
  const isDetected = scannerState === 'detected';
  const isCapturing = scannerState === 'capturing';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Camera fullscreen ── */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flashEnabled ? 'on' : 'off'}
        autofocus="on"
      />

      {/* ── Dark Punch-Hole Mask Overlay ── */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* Top dark block */}
        <View style={{ height: MASK_TOP_HEIGHT, backgroundColor: 'rgba(8, 27, 42, 0.65)' }} />

        {/* Middle row */}
        <View style={{ flexDirection: 'row', height: FRAME_H }}>
          {/* Left dark block */}
          <View style={{ flex: 1, backgroundColor: 'rgba(8, 27, 42, 0.65)' }} />
          
          {/* Transparent cutout hole matching SCANNER_DIMENSIONS */}
          <View style={{ width: FRAME_W, backgroundColor: 'transparent' }} />
          
          {/* Right dark block */}
          <View style={{ flex: 1, backgroundColor: 'rgba(8, 27, 42, 0.65)' }} />
        </View>

        {/* Bottom dark block */}
        <View style={{ flex: 1, backgroundColor: 'rgba(8, 27, 42, 0.65)' }} />
      </View>

      {/* ── Header ── */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <GlassButton
          onPress={handleClose}
          accessibilityLabel="Đóng màn hình quét"
          icon={<Ionicons name="close" size={20} color="#ffffff" />}
        />

        <View style={styles.headerCenter}>
          <Text style={styles.headerSmall}>CHẾ ĐỘ OCR AI</Text>
          <Text style={styles.headerLarge}>Căn chỉnh hình ảnh vào khung hình</Text>
        </View>

        <GlassButton
          onPress={handleFlashToggle}
          accessibilityLabel={flashEnabled ? 'Tắt đèn flash' : 'Bật đèn flash'}
          icon={
            <Ionicons
              name={flashEnabled ? 'flash' : 'flash-outline'}
              size={20}
              color={flashEnabled ? '#FFD60A' : '#ffffff'}
            />
          }
        />
      </Animated.View>

      {/* ── Scanner frame centered ── */}
      <View style={styles.scannerArea} pointerEvents="none">
        <ScannerFrame
          state={scannerState}
          scanLineY={detectionAnim.scanLineY}
          borderOpacity={detectionAnim.borderOpacity}
          borderGlow={detectionAnim.borderGlow}
          cornerScale={detectionAnim.cornerScale}
        />

        {/* Detected badge */}
        {isDetected && (
          <Animated.View style={[styles.detectedBadge, detectedBadgeStyle]}>
            <Ionicons name="checkmark-circle" size={16} color="#00E676" />
            <Text style={styles.detectedText}>Đã phát hiện hóa đơn</Text>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom section ── */}
      <Animated.View
        entering={SlideInDown.duration(500).delay(200)}
        style={[styles.bottomSection, { paddingBottom: insets.bottom + 12 }]}
      >
        {/* AI hint card */}
        <AIHintCard />

        {/* Controls row */}
        <View style={styles.controlsRow}>
          {/* Gallery */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleGallery}
            disabled={isCapturing || isProcessing}
            activeOpacity={0.7}
            accessibilityLabel="Chọn ảnh từ thư viện"
          >
            <View style={styles.sideIconWrap}>
              <Ionicons name="images-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.sideLabel}>Thư viện</Text>
          </TouchableOpacity>

          {/* Capture */}
          <CaptureButton
            onPress={handleCapture}
            state={scannerState}
            captureScale={captureAnim.captureScale}
            captureRingScale={captureAnim.captureRingScale}
            captureRingOpacity={captureAnim.captureRingOpacity}
          />

          {/* Manual input */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleManualInput}
            activeOpacity={0.7}
            accessibilityLabel="Nhập hóa đơn thủ công"
          >
            <View style={styles.sideIconWrap}>
              <Ionicons name="receipt-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.sideLabel}>Nhập</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Camera flash overlay ── */}
      <Animated.View style={[styles.flashOverlay, flashStyle]} pointerEvents="none" />

      {/* ── Processing overlay ── */}
      {isProcessing && <ProcessingOverlay />}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SCANNER_COLORS.backgroundDark,
  },

  // ── Header ──
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 2,
  },
  headerSmall: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  headerLarge: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // ── Scanner area ──
  scannerArea: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -45 }],
  },
  detectedBadge: {
    position: 'absolute',
    bottom: -36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,230,118,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detectedText: {
    color: '#00E676',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Bottom ──
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    gap: 20,
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  sideButton: {
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  sideIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Flash overlay ──
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 20,
  },

  // ── Processing overlay ──
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,27,42,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  processingCard: {
    backgroundColor: 'rgba(28,110,164,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(94,223,255,0.25)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    minWidth: 240,
  },
  processingTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  processingDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SCANNER_COLORS.accent,
  },

  // ── Permission ──
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permissionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  permissionDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: SCANNER_COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 8,
  },
  permissionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
