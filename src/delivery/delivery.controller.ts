import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Доставка')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('create/:userId/:addressId')
  @ApiOperation({ summary: 'Створити доставку для користувача' })
  @ApiParam({ name: 'userId', required: true, description: 'ID користувача' })
  @ApiParam({ name: 'addressId', required: true, description: 'ID адреси' })
  @ApiResponse({ status: 201, description: 'Доставка створена' })
  @ApiResponse({
    status: 400,
    description: 'Невірний формат ID або пуста корзина',
  })
  @ApiResponse({ status: 404, description: 'Адреса або товар не знайдені' })
  async createDelivery(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(addressId)
    ) {
      throw new BadRequestException(
        'Неправильний формат ID користувача або адреси',
      );
    }

    return await this.deliveryService.createDelivery(userId, addressId);
  }

  @Roles('admin')
  @Get('all')
  @ApiOperation({ summary: 'Отримати всі доставки' })
  @ApiResponse({ status: 200, description: 'Список всіх доставок' })
  async getAllDeliveries() {
    return await this.deliveryService.getAllDeliveries();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Отримати всі доставки користувача' })
  @ApiParam({ name: 'userId', required: true, description: 'ID користувача' })
  @ApiResponse({ status: 200, description: 'Список доставок користувача' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID' })
  async getUserDeliveries(@Param('userId') userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Неправильний формат ID користувача');
    }

    return await this.deliveryService.getUserDeliveries(userId);
  }

  @Get(':deliveryId')
  @ApiOperation({ summary: 'Отримати інформацію про конкретну доставку' })
  @ApiParam({ name: 'deliveryId', required: true, description: 'ID доставки' })
  @ApiResponse({ status: 200, description: 'Доставка знайдена' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID' })
  @ApiResponse({ status: 404, description: 'Доставка не знайдена' })
  async getDeliveryById(@Param('deliveryId') deliveryId: string) {
    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      throw new BadRequestException('Неправильний формат ID доставк');
    }

    const delivery = await this.deliveryService.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new NotFoundException('Доставку не знайдено');
    }

    return delivery;
  }

  @Roles('admin')
  @Put('update-status/:deliveryId')
  @ApiOperation({ summary: 'Оновити статус доставки' })
  @ApiParam({ name: 'deliveryId', required: true, description: 'ID доставки' })
  @ApiResponse({ status: 200, description: 'Статус оновлено' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID' })
  @ApiResponse({ status: 404, description: 'Доставка не знайдена' })
  async updateDeliveryStatus(
    @Param('deliveryId') deliveryId: string,
    @Body() updateStatusDto: UpdateDeliveryStatusDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
      throw new BadRequestException('Неправильний формат ID доставки');
    }

    return await this.deliveryService.updateDeliveryStatus(
      deliveryId,
      updateStatusDto.status,
    );
  }
}
