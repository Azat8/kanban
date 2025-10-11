import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserFiltersDto {
  @IsOptional()
  @IsString()
  keyword?: string;
  @IsOptional()
  @IsNumber()
  limit?: number;
}
