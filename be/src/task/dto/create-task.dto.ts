import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
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
