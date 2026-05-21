// ============================================================
// Scanner Constants — Design System
// ============================================================

export const SCANNER_COLORS = {
  primary: '#0F4C81',
  secondary: '#1C6EA4',
  accent: '#5EDFFF',
  success: '#00E676',
  backgroundDark: '#081B2A',
  overlayStart: '#0F4C81',
  overlayEnd: '#0B3A63',
  glassWhite: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.20)',
  scanLine: '#5EDFFF',
  cornerGlow: '#5EDFFF',
  detectedGlow: '#00E676',
} as const;

export const SCANNER_DIMENSIONS = {
  frameWidthPercent: 0.82,  // 82% màn hình
  frameHeightPercent: 0.50, // 50% màn hình
  cornerSize: 24,           // Kích thước góc bracket
  cornerThickness: 3,
  headerButtonSize: 44,
} as const;

export const ANIMATION_DURATIONS = {
  scanLineCycle: 2000,    // ms cho một vòng scan
  borderPulse: 1500,
  detectionDelay: 2500,   // Giả lập AI detect sau 2.5s
  captureFlash: 150,
  processingDelay: 1800,  // Giả lập OCR processing
} as const;
