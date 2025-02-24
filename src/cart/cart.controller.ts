import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Кошик')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Отримати корзину за ID користувача' })
  @ApiParam({ name: 'userId', required: true, description: 'ID користувача' })
  @ApiResponse({ status: 200, description: 'Корзину знайдено' })
  @ApiResponse({
    status: 400,
    description: 'Неправильний формат ID користувача',
  })
  @ApiResponse({ status: 404, description: 'Корзину не знайдено' })
  async getCart(@Param('userId') userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Неправильний формат ID користувача');
    }

    const cart = await this.cartService.getCartByUser(userId);
    if (!cart) throw new NotFoundException('Корзину не знайдено');
    return cart;
  }

  @Put('update-item/:userId/:productId')
  @ApiOperation({ summary: 'Оновити кількість товару в корзині' })
  @ApiParam({ name: 'userId', required: true, description: 'ID користувача' })
  @ApiParam({
    name: 'productId',
    required: true,
    description: 'ID товару, що оновлюється',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', description: 'Кількість товару' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Кількість товару успішно оновлено',
  })
  @ApiResponse({
    status: 400,
    description: 'Неправильний ID користувача або дані',
  })
  @ApiResponse({ status: 404, description: 'Корзину або товар не знайдено' })
  async updateCartItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new BadRequestException(
        'Неправильний формат ID користувача або товару',
      );
    }

    const updatedCart = await this.cartService.updateCartItem(
      userId,
      productId,
      quantity,
    );
    return updatedCart;
  }

  @Delete('clear/:userId')
  @ApiOperation({ summary: 'Очистити корзину' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID користувача, для якого очищається корзина',
  })
  @ApiResponse({ status: 200, description: 'Корзину успішно очищено' })
  @ApiResponse({
    status: 400,
    description: 'Неправильний формат ID користувача',
  })
  @ApiResponse({ status: 404, description: 'Корзину не знайдено' })
  async clearCart(@Param('userId') userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Неправильний формат ID користувача');
    }

    const clearedCart = await this.cartService.clearCart(userId);
    return clearedCart;
  }
}
