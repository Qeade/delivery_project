import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery } from './interfaces/delivery.interface';
import { CartService } from '../cart/cart.service';
import { Product } from '../product/interfaces/product.interface';
import { Address } from '../address/interfaces/address.interface';
import { ApiNoContentResponse } from '@nestjs/swagger';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel('Delivery') private deliveryModel: Model<Delivery>,
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Address') private addressModel: Model<Address>,
    private cartService: CartService,
  ) {}

  async calculateDeliveryPrice(addressId: string): Promise<number> {
    const address = await this.addressModel.findById(addressId).exec();
    if (!address) {
      throw new NotFoundException(`Адреса не знайдена`);
    }

    if (address.city === 'Хмельницький') {
      return 50;
    } else if (address.country === 'Україна') {
      return 200;
    } else {
      return 500;
    }
  }

  async createDelivery(userId: string, addressId: string): Promise<Delivery> {
    const cart = await this.cartService.getCartByUser(userId);
    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Кошик пустий');
    }

    const deliveryPrice = await this.calculateDeliveryPrice(addressId);
    const address = await this.addressModel.findById(addressId).exec();
    let totalPrice = deliveryPrice;
    const products = await Promise.all(
      cart.products.map(async (item) => {
        const product = await this.productModel.findById(item.product).exec();
        if (!product) {
          throw new NotFoundException(`Продукт не знайдений`);
        }
        if (!product.isLicensed && address?.country !== 'Україна') {
          throw new BadRequestException(
            'Серед товарів є товари без ліцензії за кордон',
          );
        }
        totalPrice += item.quantity * Number(product.price);
        return {
          product: product._id,
          quantity: item.quantity,
        };
      }),
    );

    const newDelivery = new this.deliveryModel({
      user: userId,
      address: addressId,
      products,
      status: 'Прийнято',
      deliveryPrice,
      totalPrice,
    });
    const savedDelivery = await newDelivery.save();

    await this.cartService.clearCart(userId);

    return savedDelivery;
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return this.deliveryModel
      .find()
      .populate('user address products.product')
      .exec();
  }

  async getUserDeliveries(userId: string): Promise<Delivery[]> {
    return this.deliveryModel
      .find({ user: userId })
      .populate('address products.product')
      .exec();
  }

  async getDeliveryById(deliveryId: string): Promise<Delivery> {
    const delivery = await this.deliveryModel
      .findById(deliveryId)
      .populate('user address products.product')
      .exec();
    if (!delivery) {
      throw new NotFoundException('Доставку не знайдено');
    }
    return delivery;
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: string,
  ): Promise<Delivery> {
    const updatedDelivery = await this.deliveryModel
      .findByIdAndUpdate(deliveryId, { status }, { new: true })
      .exec();
    if (!updatedDelivery) {
      throw new NotFoundException('Доставку не знайдено');
    }
    return updatedDelivery;
  }
}
