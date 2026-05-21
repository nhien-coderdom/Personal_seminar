export interface IUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string | null;
  category?: ICategory;
  note: string | null;
  imageUrl: string | null;
  source: 'manual' | 'ocr' | 'quick_add' | 'share';
  isDeleted: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  createdAt: Date;
}

export interface IOcrResult {
  rawText: string;
  detectedAmount: number | null;
  suggestedCategory: string | null;
  confidence: number;
}

export interface IInsight {
  id: string;
  userId: string;
  type: 'behavior' | 'recommendation';
  content: string;
  period: string;
  createdAt: Date;
}

export interface ISpendingSnapshot {
  id: string;
  userId: string;
  period: string;
  category: string | null;
  total: number;
  count: number;
  createdAt: Date;
}

export interface IJwtPayload {
  sub: string; // userId
  email: string;
  iat?: number;
  exp?: number;
}
