import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../config';

console.log("[APP] Initialize API Client with URL:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  (config as any).metadata = { startTime: new Date().getTime() };
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  console.time(`[API TIME] ${config.method?.toUpperCase()} ${config.url}`);
  
  return config;
}, (error) => {
  console.error("[API ERROR] Request error:", error);
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  const duration = new Date().getTime() - (response.config as any).metadata.startTime;
  console.timeEnd(`[API TIME] ${response.config.method?.toUpperCase()} ${response.config.url}`);
  console.log(`[API] Response ${response.status} from ${response.config.url} (took ${duration}ms)`);
  
  if (duration > 10000) {
    console.warn(`[WARNING] Loading quá lâu (${duration}ms), có thể backend bị treo`);
  }
  
  return response;
}, (error) => {
  if (error.config && error.config.metadata) {
    console.timeEnd(`[API TIME] ${error.config.method?.toUpperCase()} ${error.config.url}`);
  }
  
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    console.error("[API ERROR] Timeout, server took too long to respond.");
    error.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra Server Backend hoặc mạng của bạn.';
  } else if (!error.response) {
    console.error("[API ERROR] Network error:", error.message);
    error.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra Server Backend hoặc mạng của bạn.';
  } else {
    console.error(`[API ERROR] Status ${error.response.status}:`, error.response.data);
  }
  
  return Promise.reject(error);
});

export const fetchWithAuth = async (endpoint: string, options: any = {}) => {
  try {
    const { method = 'GET', body, ...rest } = options;
    const response = await apiClient({
      url: endpoint,
      method,
      data: body ? JSON.parse(body) : undefined,
      ...rest,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
  }
};

export default apiClient;
