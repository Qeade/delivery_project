import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPasswordDto {
  @ApiProperty({
    description: 'ID користувача',
  })
  @IsString()
  @IsNotEmpty()
  userID: string;

  @ApiProperty({
    description: 'Пароль для перевірки',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
