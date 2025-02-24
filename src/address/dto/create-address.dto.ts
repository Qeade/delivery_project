import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Україна', description: 'Країна' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: 'Хмельницький', description: 'Місто' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Вул. Соборна', description: 'Вулиця' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: '15', description: 'Номер будинку' })
  @IsNotEmpty()
  @IsString()
  house: string;

  @ApiProperty({ example: '29000', description: 'Поштовий індекс' })
  @IsNotEmpty()
  @IsString()
  postalCode: string;
}
