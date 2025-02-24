import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './interfaces/cart.interface';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async getCartByUser(userId: string): Promise<Cart | null> {
    return this.cartModel
      .findOne({ user: userId })
      .populate('products.product');
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Корзину не знайдено');
    }

    const cartObj = cart.toObject();

    const existingProduct = cartObj.products.find(
      (p) => p.product === productId,
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
      if (existingProduct.quantity <= 0) {
        cartObj.products = cartObj.products.filter(
          (p) => p.product !== productId,
        );
      }
    } else {
      if (quantity < 0) {
        throw new BadRequestException(
          'Помилка. Даного продукту немає в корзині',
        );
      }
      cartObj.products.push({ product: productId, quantity });
    }

    await this.cartModel.updateOne(
      { user: userId },
      { products: cartObj.products },
    );

    return this.cartModel
      .findOne({ user: userId })
      .populate('products.product');
  }

  async clearCart(userId: string): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Корзину не знайдено');
    }

    cart.products = [];
    await cart.save();

    return cart;
  }
}
