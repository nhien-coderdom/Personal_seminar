import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isSignout: false,
  signIn: async (token: string, user: User) => {
    console.log("[AUTH] Starting login store update...");
    console.log("[TOKEN] Access token received:", token ? token.substring(0, 15) + "..." : "none");
    try {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      console.log("[TOKEN] Token & User saved successfully to SecureStore");
      set({ token, user, isSignout: false });
    } catch (e) {
      console.error("[AUTH] Error saving token to SecureStore", e);
    }
  },
  signOut: async () => {
    console.log("[AUTH] Starting sign out...");
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userInfo');
      console.log("[TOKEN] Token & User removed successfully from SecureStore");
      set({ token: null, user: null, isSignout: true });
    } catch (e) {
      console.error("[AUTH] Error removing token from SecureStore", e);
    }
  },
  restoreToken: async () => {
    console.log("[AUTH] Restoring token on app start...");
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userInfoStr = await SecureStore.getItemAsync('userInfo');
      if (token && userInfoStr) {
        const user = JSON.parse(userInfoStr);
        console.log("[TOKEN] Found saved token in SecureStore");
        set({ token, user, isLoading: false });
      } else {
        console.log("[TOKEN] No saved token found");
        set({ token: null, user: null, isLoading: false });
      }
    } catch (e) {
      console.error("[AUTH] Error restoring token", e);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
