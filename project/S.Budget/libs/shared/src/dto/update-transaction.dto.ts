import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateTransactionDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(['expense', 'income'])
  @IsOptional()
  type?: 'expense' | 'income';

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  date?: string;
}
