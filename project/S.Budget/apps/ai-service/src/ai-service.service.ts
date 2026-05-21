import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import OpenAI from 'openai';

@Injectable()
export class AiServiceService {
  private readonly logger = new Logger(AiServiceService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey: apiKey || 'dummy-key' }); // dummy-key prevents crash if not configured yet
  }

  async parseTextToTransaction(text: string): Promise<any> {
    try {
      this.logger.log(`Parsing text: ${text}`);

      const prompt = `
Bạn là một trợ lý tài chính cá nhân. Nhiệm vụ của bạn là trích xuất thông tin giao dịch từ câu nói tự nhiên của người dùng và trả về MỘT chuỗi JSON duy nhất, không kèm theo bất kỳ văn bản giải thích hay định dạng markdown nào.

Ví dụ: 
Input: "80k cafe"
Output: {"amount": 80000, "categoryName": "Cafe/Đồ uống", "type": "expense", "note": "cafe"}

Input: "nhận lương 20 củ"
Output: {"amount": 20000000, "categoryName": "Thu nhập", "type": "income", "note": "nhận lương"}

Hãy trích xuất từ câu sau: "${text}"
`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      const resultText = response.choices[0]?.message?.content?.trim();

      if (!resultText) {
        throw new Error('Empty response from OpenAI');
      }

      // Xóa các ký tự markdown dư thừa nếu có (vd: ```json ... ```)
      const cleanedText = resultText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsedData = JSON.parse(cleanedText);

      return parsedData;
    } catch (error) {
      this.logger.error(`Failed to parse text: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: 'Could not parse text to transaction via AI',
      });
    }
  }

  async processImageOcr(imageUrl: string): Promise<any> {
    try {
      this.logger.log(`Processing OCR for image: ${imageUrl}`);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Dùng bản mini để xử lý OCR siêu tốc (nhanh hơn gấp đôi, rẻ hơn)
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Bạn là một AI OCR chuyên đọc:
- hóa đơn mua hàng
- biên lai thanh toán
- hóa đơn cafe/ăn uống
- receipt siêu thị
- ảnh chuyển khoản ngân hàng
- invoice
- pharmacy receipt
- POS receipt

Nhiệm vụ:
1. Đọc toàn bộ nội dung trong ảnh
2. Tự OCR và hiểu layout hóa đơn
3. Trích xuất chính xác thông tin giao dịch
4. KHÔNG đoán bừa
5. Nếu field không chắc chắn thì trả null
6. Chỉ trả về JSON hợp lệ duy nhất
7. KHÔNG markdown
8. KHÔNG giải thích

==================================================

# EXTRACTION RULES

## Ưu tiên tìm:
- tổng tiền cuối cùng
- tên cửa hàng
- ngày giờ
- danh sách sản phẩm
- phương thức thanh toán

==================================================

# AMOUNT DETECTION RULES

Hãy ưu tiên theo thứ tự:

1. Tổng cộng
2. Thành tiền
3. Total
4. Grand Total
5. Tổng thanh toán
6. Amount
7. Tiền cần trả

KHÔNG lấy:
- tiền khách đưa
- tiền thừa
- subtotal nếu có grand total

amount:
- phải là number
- bỏ dấu chấm/phẩy format tiền tệ
- ví dụ:
  "225.000" => 225000

==================================================

# DATE RULES

Tìm:
- ngày giao dịch
- ngày thanh toán
- transaction date

Format output:
YYYY-MM-DD HH:mm:ss

Nếu không đủ giờ:
YYYY-MM-DD

==================================================

# STORE NAME RULES

Tên cửa hàng:
- thường ở đầu hóa đơn
- in HOA
- font lớn hơn

Ví dụ:
- Highlands Coffee
- Circle K
- GS25
- Nhà Thuốc Long Châu

==================================================

# ITEM EXTRACTION RULES

items:
- phải là array
- đọc từng dòng sản phẩm
- cố gắng detect:
  - name
  - quantity
  - unitPrice
  - totalPrice

Ví dụ:
[
  {
    "name": "Coca Cola",
    "quantity": 2,
    "unitPrice": 25000,
    "totalPrice": 50000
  }
]

==================================================

# TRANSACTION TYPE RULES

Nếu là:
- hóa đơn mua hàng
- cafe
- ăn uống
- shopping

=> type = "expense"

Nếu là:
- nhận tiền
- banking transfer received
- cộng tiền

=> type = "income"

==================================================

# CATEGORY RULES

Tự classify:
- Ăn uống
- Cafe/Đồ uống
- Mua sắm
- Di chuyển
- Y tế
- Siêu thị
- Hóa đơn
- Thu nhập
- Chuyển khoản
- Khác

==================================================

# OCR ROBUSTNESS RULES

Ảnh có thể nghiêng, mờ, hoặc thiếu sáng. Bạn phải cố gắng trích xuất.
ĐẶC BIỆT QUAN TRỌNG: Nếu ảnh KHÔNG chứa hóa đơn, hoặc bạn KHÔNG THỂ đọc được ảnh, bạn BẮT BUỘC phải trả về cấu trúc JSON sau đây chứ TUYỆT ĐỐI không được giải thích hay từ chối bằng lời thoại thông thường:
{
  "merchantName": null,
  "amount": null,
  "currency": "VND",
  "categoryName": "Khác",
  "type": "expense",
  "paymentMethod": "unknown",
  "items": [],
  "note": "Không thể đọc dữ liệu hóa đơn",
  "rawText": "",
  "extractionFailed": true
}

==================================================

# OUTPUT FORMAT

Chỉ trả JSON hợp lệ:

{
  "merchantName": "string | null",
  "date": "string | null",
  "amount": number | null,
  "currency": "VND",
  "categoryName": "string",
  "type": "expense | income",
  "paymentMethod": "cash | card | transfer | unknown",
  "items": [
    {
      "name": "string",
      "quantity": number | null,
      "unitPrice": number | null,
      "totalPrice": number | null
    }
  ],
  "note": "string | null",
  "rawText": "string"
}

==================================================

# IMPORTANT

- Chỉ trả JSON
- Không markdown
- Không giải thích
- Không dùng \`\`\`
- Không thêm text ngoài JSON
`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high',
                }
              },
            ],
          },
        ],
        max_tokens: 3000,
        temperature: 0,
        response_format: {
          type: 'json_object',
        },
      });

      const resultText = response.choices[0]?.message?.content?.trim();

      this.logger.log(`[OpenAI Raw Response]: ${resultText}`);

      if (!resultText) {
        throw new Error('Empty response from OpenAI Vision');
      }

      const cleanedText = resultText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanedText);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        this.logger.warn(
          `OpenAI vision returned non-JSON content. Using smart fallback object. Details: ${error.message}`
        );
      } else {
        this.logger.error(
          `Failed to process image OCR: ${error.message}`,
          error.stack
        );
      }

      // Smart fallback so the user experience NEVER breaks
      return {
        merchantName: null,
        amount: null,
        categoryName: 'Khác',
        type: 'expense',
        note: null,
        items: [],
        rawText: '',
        extractionFailed: true,
      };
    }
  }

  async chatWithAssistant(messages: any[]): Promise<any> {
    try {
      this.logger.log(`Chatting with assistant. Context length: ${messages.length}`);

      const systemPrompt = `Bạn là S.BUDGET AI, một trợ lý tài chính cá nhân thông minh, chuyên nghiệp và tận tâm.
NGUYÊN TẮC QUAN TRỌNG:
1. BẠN CHỈ ĐƯỢC PHÉP TRẢ LỜI CÁC CÂU HỎI LIÊN QUAN ĐẾN: quản lý tài chính cá nhân, tiết kiệm, chi tiêu, đầu tư cơ bản, và các tính năng của ứng dụng S.Budget.
2. NẾU NGƯỜI DÙNG HỎI CÁC VẤN ĐỀ NGOÀI LUỒNG (lập trình, y tế, chính trị, giải trí, v.v.), BẠN PHẢI TỪ CHỐI LỊCH SỰ và nhắc nhở họ rằng bạn chỉ là trợ lý tài chính.
3. Luôn giữ thái độ thân thiện, xưng "mình" hoặc "tôi" và gọi người dùng là "bạn".
4. Câu trả lời cần ngắn gọn, súc tích, dễ đọc trên màn hình điện thoại. Khuyến khích dùng emoji phù hợp.
5. Nếu người dùng cung cấp thông tin thu chi, hãy phân tích nhanh và đưa ra lời khuyên thiết thực.`;

      // Đảm bảo tin nhắn đầu tiên là system prompt
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role, // 'user' or 'assistant'
          content: m.content,
        })),
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: formattedMessages as any[],
        temperature: 0.5, // Hơi linh hoạt một chút cho hội thoại
        max_tokens: 500,
      });

      const reply = response.choices[0]?.message?.content?.trim();

      if (!reply) {
        throw new Error('Empty response from OpenAI Chat');
      }

      return {
        text: reply,
      };
    } catch (error: any) {
      this.logger.error(`Failed to chat with assistant: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: 'Could not communicate with AI Assistant',
      });
    }
  }
}
