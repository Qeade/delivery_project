import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Адреси')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/create/:userId')
  @ApiOperation({ summary: 'Створити адресу для користувача' })
  @ApiBody({
    type: CreateAddressDto,
    description: 'Дані для створення адреси',
  })
  @ApiResponse({ status: 201, description: 'Адресу успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка в даних для створення' })
  async createAddress(
    @Res() res,
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    try {
      const address = await this.addressService.createAddress(
        userId,
        createAddressDto,
      );
      return res.status(HttpStatus.CREATED).json({
        message: 'Адресу успішно створено',
        address,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles('admin')
  @Get('/all')
  @ApiOperation({ summary: 'Отримати всі адреси' })
  @ApiResponse({ status: 200, description: 'Адреси успішно отримано' })
  async getAllAddresses(@Res() res) {
    const addresses = await this.addressService.getAllAddresses();
    return res.status(HttpStatus.OK).json(addresses);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Отримати всі адреси конкретного користувача' })
  @ApiResponse({
    status: 200,
    description: 'Адреси користувача успішно отримано',
  })
  async getUserAddresses(@Res() res, @Param('userId') userId: string) {
    const addresses = await this.addressService.getUserAddresses(userId);
    return res.status(HttpStatus.OK).json(addresses);
  }

  @Get('/:addressId')
  @ApiOperation({ summary: 'Отримати адресу за ID' })
  @ApiResponse({ status: 200, description: 'Адресу знайдено' })
  @ApiResponse({ status: 404, description: 'Адресу не знайдено' })
  async getAddressById(@Res() res, @Param('addressId') addressId: string) {
    try {
      const address = await this.addressService.getAddressById(addressId);
      return res.status(HttpStatus.OK).json(address);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put('/update/:addressId')
  @ApiOperation({ summary: 'Оновити адресу' })
  @ApiResponse({ status: 200, description: 'Адресу успішно оновлено' })
  @ApiResponse({ status: 404, description: 'Адресу не знайдено' })
  async updateAddress(
    @Res() res,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: Partial<CreateAddressDto>,
  ) {
    try {
      const updatedAddress = await this.addressService.updateAddress(
        addressId,
        updateAddressDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Адресу успішно оновлено',
        updatedAddress,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('/delete/:addressId')
  @ApiOperation({ summary: 'Видалити адресу' })
  @ApiResponse({ status: 200, description: 'Адресу успішно видалено' })
  @ApiResponse({ status: 404, description: 'Адресу не знайдено' })
  async deleteAddress(@Res() res, @Param('addressId') addressId: string) {
    try {
      const result = await this.addressService.deleteAddress(addressId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
