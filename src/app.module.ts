import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/DeliveryProject'),
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    AddressModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
