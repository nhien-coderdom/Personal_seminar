import React, { useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';

interface OCRReceiptPreviewProps {
  imageUrl?: string;
  source: 'ocr' | 'manual';
}

/**
 * Component hiển thị ảnh hóa đơn OCR
 * - Chỉ render nếu source === 'ocr' AND imageUrl exists
 * - Nếu manual → return null (không render empty placeholder)
 * - Error handling: show fallback UI if image fails
 */
export const OCRReceiptPreview: React.FC<OCRReceiptPreviewProps> = ({
  imageUrl,
  source,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Nếu không phải OCR source hoặc không có imageUrl → không render gì cả
  if (source !== 'ocr' || !imageUrl) {
    console.log('[OCR] Receipt image not applicable (source:', source, ', imageUrl:', !!imageUrl, ')');
    return null;
  }

  console.log('[OCR] Receipt image found, URL:', imageUrl);

  return (
    <View className="px-4 py-4">
      {/* Title */}
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        Hóa đơn đính kèm
      </Text>

      {/* Receipt Image Card */}
      <View className="bg-white rounded-xl overflow-hidden shadow-md">
        {imageError ? (
          // Error State: Fallback UI
          <View
            className="w-full items-center justify-center bg-gray-100"
            style={{ aspectRatio: 4 / 3 }}
          >
            <Text className="text-gray-500 text-sm font-medium text-center">
              Không thể tải ảnh hóa đơn
            </Text>
          </View>
        ) : (
          // Normal State: Image or Loading
          <>
            {imageLoading && (
              <View
                className="absolute inset-0 items-center justify-center bg-gray-50 z-10"
                style={{ aspectRatio: 4 / 3 }}
              >
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            )}
            <Image
              source={{ uri: imageUrl }}
              className="w-full"
              style={{
                aspectRatio: 4 / 3,
                resizeMode: 'cover',
              }}
              onLoadStart={() => {
                console.log('[OCR] Image loading...');
                setImageLoading(true);
              }}
              onLoad={() => {
                console.log('[OCR] Image loaded successfully');
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(error: any) => {
                console.error('[OCR] Image load error:', error?.error || error);
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};
