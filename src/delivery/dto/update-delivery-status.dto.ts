import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: 'Новий статус доставки',
    enum: ['Прийнято', 'В дорозі', 'Доставлено', 'Відхилено'],
    example: 'В дорозі',
  })
  status: string;
}
