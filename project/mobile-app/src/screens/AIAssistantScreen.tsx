import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList,
  Keyboard,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  withRepeat, 
  withTiming, 
  useSharedValue, 
  useAnimatedStyle,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { 
  ChatMessage, 
  SuggestionChip, 
  defaultSuggestions, 
  getAIRealResponse 
} from '../services/aiChatService';

const TypingIndicator = () => {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, true);
    dot2.value = withDelay(200, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, true));
    dot3.value = withDelay(400, withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, true));
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View className="flex-row space-x-1 items-center px-1">
      <Animated.View style={style1} className="w-2 h-2 rounded-full bg-blue-500" />
      <Animated.View style={style2} className="w-2 h-2 rounded-full bg-blue-500" />
      <Animated.View style={style3} className="w-2 h-2 rounded-full bg-blue-500" />
    </View>
  );
};

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: 'Xin chào! Mình là S.BUDGET AI 🤖\nMình có thể giúp bạn phân tích chi tiêu, đưa ra lời khuyên tiết kiệm, hoặc trả lời các câu hỏi về tài chính cá nhân. Bạn muốn mình giúp gì hôm nay?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  }, []);

  const handleSend = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages((prev) => [newUserMessage, ...prev]);
    setInputText('');
    setIsTyping(true);

    // Get Real AI Response with Context
    const currentMessages = [newUserMessage, ...messages]; // pass the full history
    const aiResponse = await getAIRealResponse(currentMessages);
    
    setIsTyping(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setMessages((prev) => [aiResponse, ...prev]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    
    return (
      <Animated.View 
        entering={isUser ? FadeInDown.duration(300) : FadeInUp.duration(300)}
        layout={Layout.springify()}
        className={`mb-4 max-w-[78%] ${isUser ? 'self-end' : 'self-start'}`}
      >
        {!isUser && (
          <View className="flex-row items-center mb-1 ml-1">
            <View className="w-5 h-5 bg-blue-100 rounded-full items-center justify-center mr-2">
              <Text style={{fontSize: 10}}>🤖</Text>
            </View>
            <Text className="text-xs text-gray-500 font-semibold">S.BUDGET AI</Text>
          </View>
        )}
        <View 
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-[#1565C0] rounded-tr-sm' 
              : 'bg-white rounded-tl-sm border border-[#DCE3EA]'
          }`}
        >
          <Text className={`${isUser ? 'text-white' : 'text-[#1F2937]'} text-[15px] leading-6`}>
            {item.text}
          </Text>
        </View>
        <Text className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F6F8]" edges={['top', 'left', 'right']}>
      {/* HEADER */}
      <View className="px-5 py-4 bg-white border-b border-[#DCE3EA] flex-row justify-between items-center z-10 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-[#1F2937]">Trợ lý AI</Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            <Text className="text-xs text-[#6B7280]">Trực tuyến</Text>
          </View>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* CHAT AREA */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 20 }}
          ListHeaderComponent={
            isTyping ? (
              <Animated.View 
                entering={FadeInUp}
                className="mb-4 self-start max-w-[78%]"
              >
                <View className="flex-row items-center mb-1 ml-1">
                  <View className="w-5 h-5 bg-blue-100 rounded-full items-center justify-center mr-2">
                    <Text style={{fontSize: 10}}>🤖</Text>
                  </View>
                  <Text className="text-xs text-gray-500 font-semibold">S.BUDGET AI</Text>
                </View>
                <View className="px-4 py-3 bg-white/70 rounded-2xl rounded-tl-sm border border-[#DCE3EA] shadow-sm flex-row items-center space-x-2">
                  <Text className="text-[#6B7280] text-sm italic mr-1">Đang phân tích</Text>
                  <TypingIndicator />
                </View>
              </Animated.View>
            ) : null
          }
        />

        {/* INPUT COMPOSER AREA */}
        <View className="bg-white border-t border-[#DCE3EA] px-4 py-3 pb-safe">
          {/* Suggestion Chips */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-3"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {defaultSuggestions.map((chip) => (
              <TouchableOpacity 
                key={chip.id}
                onPress={() => handleSend(chip.prompt)}
                className="bg-white border border-[#DCE3EA] px-4 py-2 rounded-full mr-2 shadow-sm flex-row items-center"
              >
                <Text className="text-[#1565C0] text-sm font-medium">{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Row */}
          <View className="flex-row items-end space-x-2">
            <TouchableOpacity className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1">
              <Ionicons name="mic" size={22} color="#1565C0" />
            </TouchableOpacity>

            <View className="flex-1 bg-[#F4F6F8] rounded-2xl border border-[#DCE3EA] min-h-[44px] max-h-[120px] px-4 py-2.5 flex-row items-center">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#9CA3AF"
                multiline
                className="flex-1 text-[#1F2937] text-[15px] max-h-[100px]"
                style={{ paddingTop: 0, paddingBottom: 0, textAlignVertical: 'center' }}
              />
            </View>

            <TouchableOpacity 
              onPress={() => handleSend(inputText)}
              disabled={!inputText.trim() || isTyping}
              className={`w-11 h-11 rounded-full items-center justify-center mb-1 ${
                inputText.trim() && !isTyping ? 'bg-[#1565C0]' : 'bg-gray-200'
              }`}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={inputText.trim() && !isTyping ? "white" : "#9CA3AF"} 
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}