const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
};

// --- MOCK DATA ---
write('src/data/mock.ts', `
export const mockTransactions = [
  { id: '1', title: 'Groceries', amount: -45.50, category: 'Food', date: '2026-05-14T10:00:00Z', type: 'expense' },
  { id: '2', title: 'Salary', amount: 3000, category: 'Income', date: '2026-05-01T08:00:00Z', type: 'income' },
  { id: '3', title: 'Netflix', amount: -15.99, category: 'Entertainment', date: '2026-05-10T12:00:00Z', type: 'expense' },
  { id: '4', title: 'Coffee', amount: -4.50, category: 'Food', date: '2026-05-13T09:00:00Z', type: 'expense' },
];

export const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  balance: 2934.01,
  monthlyIncome: 3000,
  monthlyExpense: 65.99
};
`);

// --- COMPONENTS ---
write('src/components/Button.tsx', `
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', isLoading, disabled }: ButtonProps) {
  const baseClass = "p-4 rounded-xl items-center justify-center flex-row";
  let variantClass = "bg-primary";
  let textClass = "text-white font-bold text-lg";

  if (variant === 'secondary') {
    variantClass = "bg-secondary";
  } else if (variant === 'outline') {
    variantClass = "bg-transparent border-2 border-primary";
    textClass = "text-primary font-bold text-lg";
  }

  if (disabled || isLoading) {
    variantClass += " opacity-50";
  }

  return (
    <TouchableOpacity 
      className={\`\${baseClass} \${variantClass}\`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading && <ActivityIndicator color={variant === 'outline' ? '#4F46E5' : '#fff'} className="mr-2" />}
      <Text className={textClass}>{title}</Text>
    </TouchableOpacity>
  );
}
`);

write('src/components/Input.tsx', `
import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      <Text className="text-sm font-medium text-text mb-1">{label}</Text>
      <TextInput 
        className={\`w-full bg-white border \${error ? 'border-red-500' : 'border-gray-200'} rounded-xl p-4 text-text\`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
`);

write('src/components/Card.tsx', `
import React from 'react';
import { View, ViewProps } from 'react-native';

export default function Card({ children, className, ...props }: ViewProps) {
  return (
    <View className={\`bg-card p-6 rounded-2xl shadow-sm border border-gray-100 \${className || ''}\`} {...props}>
      {children}
    </View>
  );
}
`);

write('src/components/TransactionCard.tsx', `
import React from 'react';
import { View, Text } from 'react-native';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  date: string;
}

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense';
  return (
    <View className="flex-row justify-between items-center bg-white p-4 mb-2 rounded-xl border border-gray-100 shadow-sm">
      <View className="flex-row items-center">
        <View className={\`w-10 h-10 rounded-full items-center justify-center \${isExpense ? 'bg-red-100' : 'bg-secondary'}\`}>
          <Text className={\`font-bold \${isExpense ? 'text-red-500' : 'text-white'}\`}>
            {transaction.title.charAt(0)}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="font-semibold text-text">{transaction.title}</Text>
          <Text className="text-gray-400 text-xs">{transaction.category}</Text>
        </View>
      </View>
      <Text className={\`font-bold \${isExpense ? 'text-red-500' : 'text-secondary'}\`}>
        {isExpense ? '-' : '+'}\${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </View>
  );
}
`);

// --- SCREENS ---
write('src/screens/LoginScreen.tsx', `
import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Main');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-4"
      >
        <View className="items-center mb-10">
          <Text className="text-4xl font-extrabold text-primary mb-2">S.Budget</Text>
          <Text className="text-gray-500">Smart Financial Management</Text>
        </View>
        
        <Card>
          <Text className="text-2xl font-bold text-text mb-6">Welcome Back</Text>
          <Input 
            label="Email" 
            placeholder="Enter your email" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            label="Password" 
            placeholder="Enter your password" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View className="mt-4">
            <Button title="Login" onPress={handleLogin} isLoading={isLoading} />
          </View>
          <View className="mt-4 items-center">
            <Text className="text-primary font-medium">Forgot Password?</Text>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
`);

write('src/screens/DashboardScreen.tsx', `
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Card from '../components/Card';
import TransactionCard from '../components/TransactionCard';
import { mockTransactions, mockUser } from '../data/mock';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6 mt-4">
          <View>
            <Text className="text-gray-500 text-sm">Good Morning,</Text>
            <Text className="text-2xl font-bold text-text">{mockUser.name}</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <Text className="text-white font-bold">JD</Text>
          </View>
        </View>

        <Card className="mb-6 bg-primary">
          <Text className="text-white/80 text-sm font-medium mb-1">Total Balance</Text>
          <Text className="text-white text-4xl font-extrabold mb-4">$\${mockUser.balance.toFixed(2)}</Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white/80 text-xs">Monthly Income</Text>
              <Text className="text-white font-bold">+\${mockUser.monthlyIncome.toFixed(2)}</Text>
            </View>
            <View>
              <Text className="text-white/80 text-xs">Monthly Expense</Text>
              <Text className="text-white font-bold">-\${mockUser.monthlyExpense.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-text">Recent Transactions</Text>
          <Text className="text-primary font-medium">See All</Text>
        </View>

        {mockTransactions.slice(0, 3).map(tx => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
`);

write('src/screens/TransactionScreen.tsx', `
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import TransactionCard from '../components/TransactionCard';
import { mockTransactions } from '../data/mock';

export default function TransactionScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-text mb-4 mt-2">All Transactions</Text>
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-500 mt-2">Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={mockTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
`);

write('src/screens/AIAssistantScreen.tsx', `
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';

export default function AIAssistantScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-text mb-6 mt-2">AI Assistant</Text>
        
        <Card className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
              <Text className="text-xl">🤖</Text>
            </View>
            <Text className="text-lg font-bold text-text">Smart Insights</Text>
          </View>
          <Text className="text-gray-600 mb-4 leading-6">
            Based on your recent spending, you've spent 40% more on food this week. Consider reducing dining out to stay within your monthly budget goals.
          </Text>
          <Button title="View Detailed Report" onPress={() => {}} variant="outline" />
        </Card>
        
        <Card className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center mr-3">
              <Text className="text-xl">📷</Text>
            </View>
            <Text className="text-lg font-bold text-text">Scan Receipt</Text>
          </View>
          <Text className="text-gray-600 mb-4 leading-6">
            Upload or take a photo of your receipt to automatically extract transaction details.
          </Text>
          <Button title="Scan Now" onPress={() => {}} variant="primary" />
        </Card>
        
      </ScrollView>
    </SafeAreaView>
  );
}
`);

write('src/screens/ProfileScreen.tsx', `
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import { mockUser } from '../data/mock';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-text mb-6 mt-2">Profile</Text>
        
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary rounded-full items-center justify-center shadow-sm mb-4">
            <Text className="text-3xl text-white font-bold">JD</Text>
          </View>
          <Text className="text-xl font-bold text-text">{mockUser.name}</Text>
          <Text className="text-gray-500">{mockUser.email}</Text>
        </View>

        <Card className="mb-4 p-0 overflow-hidden">
          <View className="p-4 border-b border-gray-100 flex-row justify-between">
            <Text className="text-text font-medium">Account Settings</Text>
            <Text className="text-gray-400">></Text>
          </View>
          <View className="p-4 border-b border-gray-100 flex-row justify-between">
            <Text className="text-text font-medium">Notifications</Text>
            <Text className="text-gray-400">></Text>
          </View>
          <View className="p-4 flex-row justify-between">
            <Text className="text-text font-medium">Security</Text>
            <Text className="text-gray-400">></Text>
          </View>
        </Card>

        <View className="mt-4">
          <Button 
            title="Log Out" 
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })} 
            variant="outline" 
          />
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
`);
