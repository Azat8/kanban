import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  assignedUserId: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
