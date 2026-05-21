import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

/**
 * QuickAddDto – dùng khi AI đã parse text tự nhiên thành structured data.
 * Client gửi text gốc + kết quả parse; Transaction Service sẽ lưu trực tiếp.
 */
export class QuickAddDto {
  /** Text tự nhiên gốc của người dùng, e.g. "80k cafe sáng" */
  @IsString()
  @IsNotEmpty()
  text!: string;

  /** Số tiền đã parse (đơn vị VND) */
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  /** Loại giao dịch */
  @IsEnum(['expense', 'income'])
  @IsOptional()
  type?: 'expense' | 'income';

  /** Tên danh mục (sẽ tìm hoặc tạo mới) */
  @IsString()
  @IsOptional()
  categoryName?: string;

  /** Ghi chú bổ sung */
  @IsString()
  @IsOptional()
  note?: string;
}
