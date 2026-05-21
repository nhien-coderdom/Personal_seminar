const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
};

write('src/screens/DashboardScreen.tsx', `
import { View, Text } from 'react-native';
export default function DashboardScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-text">Dashboard</Text>
    </View>
  );
}
`);

write('src/screens/TransactionScreen.tsx', `
import { View, Text } from 'react-native';
export default function TransactionScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-text">Transactions</Text>
    </View>
  );
}
`);

write('src/screens/AIAssistantScreen.tsx', `
import { View, Text } from 'react-native';
export default function AIAssistantScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-text">AI Assistant</Text>
    </View>
  );
}
`);

write('src/screens/ProfileScreen.tsx', `
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-text mb-4">Profile</Text>
      <TouchableOpacity 
        className="bg-red-500 p-4 rounded-xl items-center"
        onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
`);

write('src/navigation/MainTabNavigator.tsx', `
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionScreen from '../screens/TransactionScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4F46E5' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionScreen} />
      <Tab.Screen name="AI Assistant" component={AIAssistantScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
`);

write('src/navigation/AuthNavigator.tsx', `
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
`);

write('src/navigation/RootNavigator.tsx', `
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
`);
