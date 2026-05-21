import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionScreen from '../screens/TransactionScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4F46E5' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Giao dịch' }} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} options={{ title: 'Trợ lý AI' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá nhân' }} />
    </Tab.Navigator>
  );
}