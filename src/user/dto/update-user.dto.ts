import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Ім’я користувача' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Прізвище користувача' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Номер телефону користувача' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Дата народження', example: '04-03-2025' })
  birthDate: Date;

  @ApiProperty({ description: 'Пароль користувача (мінімум 6 символів)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Роль користувача', enum: ['user', 'admin'] })
  @IsEnum(['user', 'admin'])
  role: 'user' | 'admin';
}
