import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliverySchema } from './schema/delivery.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from 'src/product/product.module';
import { AddressModule } from 'src/address/address.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Delivery', schema: DeliverySchema }]),
    ProductModule,
    AddressModule,
    CartModule,
  ],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
