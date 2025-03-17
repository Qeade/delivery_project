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

    // Знаходимо товар у кошику
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId,
    );

    if (existingProduct) {
      existingProduct.quantity = quantity; // Оновлюємо кількість

      if (quantity <= 0) {
        // Видаляємо товар з кошика
        cart.products = cart.products.filter(
          (p) => p.product.toString() !== productId,
        );
      }
    } else {
      if (quantity > 0) {
        cart.products.push({ product: productId, quantity });
      } else {
        throw new BadRequestException(
          'Помилка. Даного продукту немає в корзині',
        );
      }
    }

    await cart.save(); // Зберігаємо зміни

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
