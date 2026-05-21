// ============================================================
// Scanner Types — OCR AI Scan Screen
// ============================================================

/** Trạng thái của máy quét AI */
export type ScannerState =
  | 'idle'         // Chờ người dùng
  | 'detecting'    // AI đang phát hiện hóa đơn
  | 'detected'     // Đã phát hiện hóa đơn thành công
  | 'capturing'    // Đang chụp ảnh
  | 'processing';  // Đang xử lý OCR

/** Kết quả OCR */
export interface OCRResult {
  uri: string;
  name: string;
  type: string;
  width?: number;
  height?: number;
}

/** Vị trí các góc hóa đơn được phát hiện */
export interface DetectionBounds {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

/** Điều khiển camera */
export interface CameraControls {
  flashEnabled: boolean;
  facing: 'front' | 'back';
  zoom: number;
}

/** Props của ScannerFrame */
export interface ScannerFrameProps {
  state: ScannerState;
  frameWidth: number;
  frameHeight: number;
}

/** Props của GlassButton */
export interface GlassButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: number;
  disabled?: boolean;
  accessibilityLabel: string;
}
