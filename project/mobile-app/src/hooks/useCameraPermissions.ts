import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface PermissionState {
  cameraGranted: boolean | null;  // null = loading
  galleryGranted: boolean | null;
  isLoading: boolean;
  requestCameraPermission: () => Promise<boolean>;
  requestGalleryPermission: () => Promise<boolean>;
}

/**
 * Hook quản lý quyền camera và thư viện ảnh
 */
export function useCameraPermissions(): PermissionState {
  const [cameraGranted, setCameraGranted] = useState<boolean | null>(null);
  const [galleryGranted, setGalleryGranted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    try {
      const [cameraStatus, galleryStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
      ]);
      setCameraGranted(cameraStatus.granted);
      setGalleryGranted(galleryStatus.granted);
    } catch (err) {
      console.error('[useCameraPermissions] Failed to check permissions:', err);
      setCameraGranted(false);
      setGalleryGranted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { granted } = await Camera.requestCameraPermissionsAsync();
      setCameraGranted(granted);
      return granted;
    } catch (err) {
      console.error('[useCameraPermissions] Camera request failed:', err);
      return false;
    }
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryGranted(granted);
      return granted;
    } catch (err) {
      console.error('[useCameraPermissions] Gallery request failed:', err);
      return false;
    }
  };

  return {
    cameraGranted,
    galleryGranted,
    isLoading,
    requestCameraPermission,
    requestGalleryPermission,
  };
}
