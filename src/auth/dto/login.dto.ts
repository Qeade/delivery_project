import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Номер телефону' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Пароль' })
  password: string;
}
