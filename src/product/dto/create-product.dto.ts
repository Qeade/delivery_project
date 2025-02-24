import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsUrl,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Назва товару' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Ціна товару' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Опис товару' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'URL зображення товару' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Ліцензія за кордон' })
  @IsBoolean()
  @IsNotEmpty()
  isLicensed: boolean;

  @ApiProperty({ description: 'Дата створення', required: false })
  @IsOptional()
  @IsDate()
  created_at?: Date;
}
