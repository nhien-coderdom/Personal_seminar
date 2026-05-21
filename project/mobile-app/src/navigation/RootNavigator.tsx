import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import TransactionDetailViewScreen from '../screens/TransactionDetailViewScreen';
import OCRScanScreen from '../screens/OCRScanScreen';
import OCRResultScreen from '../screens/OCRResultScreen';
import ManualTransactionScreen from '../screens/ManualTransactionScreen';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TransactionDetail: {
    date: string;
  };
  TransactionDetailView: {
    transactionId: string;
  };
  OCRScan: undefined;
  OCRResult: {
    transactionId?: string;
    image?: { uri: string; name: string; type: string };
    selectedDate?: string;
  };
  ManualTransaction: {
    transactionId?: string;
  };
  [key: string]: any;
};

export default function RootNavigator() {
  const { isLoading, token, restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token == null ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <Stack.Screen name="TransactionDetailView" component={TransactionDetailViewScreen as any} />
          <Stack.Screen 
            name="OCRScan" 
            component={OCRScanScreen}
          />
          <Stack.Screen 
            name="OCRResult" 
            component={OCRResultScreen}
          />
          <Stack.Screen 
            name="ManualTransaction" 
            component={ManualTransactionScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}