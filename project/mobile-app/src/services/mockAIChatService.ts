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
  // payload cho các loại message đặc biệt
  payload?: any;
}

export const defaultSuggestions: SuggestionChip[] = [
  { id: '1', label: 'Gợi ý tiết kiệm', prompt: 'Cho tôi vài gợi ý để tiết kiệm chi tiêu tháng này.' },
  { id: '2', label: 'So sánh tháng trước', prompt: 'So sánh chi tiêu tháng này với tháng trước giúp tôi.' },
  { id: '3', label: 'Chi tiêu hôm nay', prompt: 'Hôm nay tôi đã tiêu bao nhiêu tiền?' },
  { id: '4', label: 'Danh mục nhiều nhất', prompt: 'Danh mục nào tôi tiêu nhiều tiền nhất?' },
];

const mockResponses: Record<string, string> = {
  'tiết kiệm': 'Dựa vào dữ liệu tháng này, bạn đang chi tiêu khá nhiều vào "Ăn uống ngoài" (chiếm 40% tổng chi). Hãy thử tự nấu ăn 2-3 ngày/tuần để tiết kiệm thêm khoảng 500.000đ nhé! 💡',
  'tháng trước': 'Tháng này bạn đã chi tiêu ít hơn 15% so với cùng kỳ tháng trước. Rất tốt! Đặc biệt là khoản mua sắm đã giảm đáng kể. Tiếp tục duy trì nhé! 📈',
  'hôm nay': 'Hôm nay bạn đã chi tiêu 155.000đ, chủ yếu vào Highlands Coffee. So với hạn mức trung bình ngày, bạn đang ở mức an toàn. ☕',
  'nhiều nhất': 'Danh mục bạn chi tiêu nhiều nhất trong tháng này là "Ăn uống" (2.500.000đ), tiếp theo là "Đi lại" (800.000đ). Cần lưu ý khoản "Ăn uống" đang tiệm cận hạn mức nhé! 🍔',
};

const defaultResponse = 'Xin lỗi, hiện tại tôi chưa hiểu rõ ý của bạn. Bạn có thể hỏi cụ thể hơn về chi tiêu, tiết kiệm hoặc thống kê được không? Mình có thể phân tích số liệu tài chính của bạn.';

export const getAIMockResponse = async (userText: string): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    // Artificial delay: 1.5s to 2.5s
    const delay = Math.floor(Math.random() * 1000) + 1500;
    
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let responseText = defaultResponse;
      
      for (const key of Object.keys(mockResponses)) {
        if (lowerText.includes(key)) {
          responseText = mockResponses[key];
          break;
        }
      }
      
      resolve({
        id: Date.now().toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      });
    }, delay);
  });
};
