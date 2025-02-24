import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsMongoId,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductQuantity {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID товару' })
  product: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Кількість товару', minimum: 1 })
  quantity: number;
}

export class CreateDeliveryDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID користувача' })
  user: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID адреси доставки' })
  address: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => ProductQuantity)
  @ApiProperty({
    description: 'Список товарів для доставки',
    type: () => [ProductQuantity],
  })
  products: ProductQuantity[];

  @IsEnum(['Прийнято', 'В дорозі', 'Доставлено', 'Відхилено'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Статус доставки',
    enum: ['Прийнято', 'В дорозі', 'Доставлено', 'Відхилено'],
    default: 'Прийнято',
  })
  status: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Ціна доставки' })
  deliveryPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Загальна ціна (ціна доставки + ціна товарів)' })
  totalPrice: number;
}
