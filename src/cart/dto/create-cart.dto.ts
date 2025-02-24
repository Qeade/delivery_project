import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsMongoId,
  ValidateNested,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductQuantity {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID товару' })
  product: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'Кількість товару', minimum: 1 })
  quantity: number;
}

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID користувача' })
  user: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductQuantity)
  @ApiProperty({
    description: 'Список товарів у кошику',
    type: () => [ProductQuantity],
  })
  products: ProductQuantity[];
}
