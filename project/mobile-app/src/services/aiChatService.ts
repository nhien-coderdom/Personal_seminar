import apiClient from './api';

export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
}

export type MessageType = 'text' | 'insight' | 'chart' | 'summary';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: MessageType;
  payload?: any;
}

export const defaultSuggestions: SuggestionChip[] = [
  { id: '1', label: 'Gợi ý tiết kiệm', prompt: 'Cho tôi vài gợi ý để tiết kiệm chi tiêu tháng này.' },
  { id: '2', label: 'So sánh tháng trước', prompt: 'So sánh chi tiêu tháng này với tháng trước giúp tôi.' },
  { id: '3', label: 'Chi tiêu hôm nay', prompt: 'Hôm nay tôi đã tiêu bao nhiêu tiền?' },
  { id: '4', label: 'Danh mục nhiều nhất', prompt: 'Danh mục nào tôi tiêu nhiều tiền nhất?' },
];

export const getAIRealResponse = async (messages: ChatMessage[]): Promise<ChatMessage> => {
  try {
    // Chuyển đổi định dạng message sang dạng OpenAI yêu cầu
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })).reverse(); // Đảo ngược mảng vì FlatList inverted lưu message mới nhất ở đầu

    const response = await apiClient.post('/ai/chat', {
      messages: formattedMessages
    });

    return {
      id: Date.now().toString(),
      text: response.data.text,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
  } catch (error: any) {
    console.error('Error fetching AI response:', error);
    return {
      id: Date.now().toString(),
      text: 'Xin lỗi, hệ thống AI đang gặp chút sự cố. Vui lòng thử lại sau nhé! 😥',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
  }
};
