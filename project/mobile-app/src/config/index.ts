import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (__DEV__) {
    // 192.168.87.124 is the host machine IP for Expo Go physical device testing
    return 'http://172.20.10.14:3000/api/v1';
  }
  return 'https://api.sbudget.com/api/v1'; // Production URL
};

export const API_URL = getApiUrl();
