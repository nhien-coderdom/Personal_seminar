// Microservice names
export const AUTH_SERVICE = 'AUTH_SERVICE';
export const TRANSACTION_SERVICE = 'TRANSACTION_SERVICE';
export const AI_SERVICE = 'AI_SERVICE';
export const INSIGHT_SERVICE = 'INSIGHT_SERVICE';

// RabbitMQ Queues
export const AUTH_QUEUE = 'auth_queue';
export const TRANSACTION_QUEUE = 'transaction_queue';
export const AI_QUEUE = 'ai_queue';
export const INSIGHT_QUEUE = 'insight_queue';

// RabbitMQ Exchange
export const EVENTS_EXCHANGE = 'sbudget_events';

// Event Patterns
export const EVENT_PATTERNS = {
  // Transaction events
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',

  // AI events
  IMAGE_PROCESS: 'image.process',
  IMAGE_RESULT: 'image.result',

  // Insight events
  INSIGHT_GENERATE: 'insight.generate',
  INSIGHT_READY: 'insight.ready',
} as const;

// Message Patterns (RPC)
export const MESSAGE_PATTERNS = {
  // Auth
  AUTH_REGISTER: { cmd: 'auth_register' },
  AUTH_LOGIN: { cmd: 'auth_login' },
  AUTH_VALIDATE: { cmd: 'auth_validate' },
  AUTH_REFRESH: { cmd: 'auth_refresh' },

  // Transaction
  TRANSACTION_CREATE: { cmd: 'transaction_create' },
  TRANSACTION_QUICK_ADD: { cmd: 'transaction_quick_add' },
  TRANSACTION_FIND_ALL: { cmd: 'transaction_find_all' },
  TRANSACTION_FIND_ONE: { cmd: 'transaction_find_one' },
  TRANSACTION_UPDATE: { cmd: 'transaction_update' },
  TRANSACTION_DELETE: { cmd: 'transaction_delete' },
  TRANSACTION_FROM_IMAGE: { cmd: 'transaction_from_image' },

  // Category
  CATEGORY_FIND_ALL: { cmd: 'category_find_all' },

  // AI
  AI_OCR_PROCESS: { cmd: 'ai_ocr_process' },
  AI_DETECT_AMOUNT: { cmd: 'ai_detect_amount' },
  AI_CLASSIFY: { cmd: 'ai_classify' },
  AI_PARSE_TEXT: { cmd: 'ai_parse_text' },
  AI_CHAT: { cmd: 'ai_chat' },

  // Insight
  INSIGHT_STATS: { cmd: 'insight_stats' },
  INSIGHT_BEHAVIOR: { cmd: 'insight_behavior' },
  INSIGHT_RECOMMEND: { cmd: 'insight_recommend' },
} as const;

// Default categories
export const DEFAULT_CATEGORIES = [
  { name: 'Ăn uống', icon: '🍜', color: '#FF6B6B' },
  { name: 'Di chuyển', icon: '🚗', color: '#4ECDC4' },
  { name: 'Mua sắm', icon: '🛍️', color: '#45B7D1' },
  { name: 'Giải trí', icon: '🎬', color: '#96CEB4' },
  { name: 'Sức khỏe', icon: '💊', color: '#FFEAA7' },
  { name: 'Giáo dục', icon: '📚', color: '#DDA0DD' },
  { name: 'Tiện ích', icon: '💡', color: '#98D8C8' },
  { name: 'Nhà ở', icon: '🏠', color: '#F7DC6F' },
  { name: 'Cafe/Đồ uống', icon: '☕', color: '#D4A574' },
  { name: 'Thu nhập', icon: '💰', color: '#2ECC71' },
  { name: 'Khác', icon: '📋', color: '#BDC3C7' },
] as const;
