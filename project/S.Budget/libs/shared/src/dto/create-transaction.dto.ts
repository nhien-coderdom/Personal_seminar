import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsEnum(['expense', 'income'])
  type: 'expense' | 'income' = 'expense';

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(['manual', 'ocr', 'quick_add', 'share'])
  @IsOptional()
  source?: 'manual' | 'ocr' | 'quick_add' | 'share';

  @IsString()
  @IsOptional()
  date?: string;
}
