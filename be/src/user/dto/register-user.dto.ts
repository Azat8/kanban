import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsEnum(Object.values(UserRole))
  role: UserRole;
}
