import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Query,
  NotFoundException,
  Delete,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Товари')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles('admin')
  @Post('/create')
  @ApiOperation({ summary: 'Створення нового товару' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Дані для створення товару',
  })
  @ApiResponse({ status: 201, description: 'Товар створено успішно' })
  @ApiResponse({ status: 400, description: 'Неправильні дані товару' })
  async addProduct(@Res() res, @Body() createProductDTO: CreateProductDto) {
    try {
      const { name, price } = createProductDTO;

      if (price <= 0) {
        throw new BadRequestException('Ціна має бути більша 0');
      }
      const existingProducts =
        await this.productService.findProductsByName(name);

      let newName = name;
      if (existingProducts.length > 0) {
        newName = `${name} ${existingProducts.length}`;
      }

      const product = await this.productService.addProduct({
        ...createProductDTO,
        name: newName,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Товар був успішно створений',
        product,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('products')
  @ApiOperation({
    summary: 'Отримати всі товари',
    description: 'Витягує всі товари',
  })
  @ApiResponse({ status: 200, description: 'Всі товари отримані' })
  async getAllProducts(@Res() res) {
    const products = await this.productService.getAllProducts();
    return res.status(HttpStatus.OK).json(products);
  }

  @Get(':productID')
  @ApiOperation({ summary: 'Отримати товар за ID' })
  @ApiParam({
    name: 'productID',
    required: true,
    description: 'ID товару',
  })
  @ApiResponse({ status: 200, description: 'Товар знайдено' })
  @ApiResponse({ status: 400, description: 'Неправильний формат ID товару' })
  @ApiResponse({ status: 404, description: 'Товар не знайдений' })
  async getProduct(@Res() res, @Param('productID') productID: string) {
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      throw new BadRequestException('Неправильний формат ID товару');
    }

    const product = await this.productService.getProduct(productID);
    if (!product) throw new NotFoundException('Продукт не існує');
    return res.status(HttpStatus.OK).json(product);
  }

  @Roles('admin')
  @Put('/update')
  @ApiOperation({ summary: 'Оновити існуючий товар' })
  @ApiQuery({
    name: 'productID',
    required: true,
    description: 'ID товару для оновлення',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Оновлені дані товару',
  })
  @ApiResponse({ status: 200, description: 'Товар успішно оновлено' })
  @ApiResponse({
    status: 400,
    description: 'Невірний формат ID товару або неправильна ціна',
  })
  @ApiResponse({ status: 404, description: 'Товар не знайдений' })
  async updateProduct(
    @Res() res,
    @Query('productID') productID: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      throw new BadRequestException('Невірний формат ID товару');
    }

    if (createProductDto.price !== undefined && createProductDto.price < 0) {
      throw new BadRequestException('Ціна не може бути меншою за 0');
    }

    const product = await this.productService.updateProduct(
      productID,
      createProductDto,
    );
    if (!product) throw new NotFoundException('Товар не існує!');

    return res.status(HttpStatus.OK).json({
      message: 'Товар був успішно оновлений',
      product,
    });
  }

  @Roles('admin')
  @Delete('/delete')
  @ApiOperation({ summary: 'Видалити товар' })
  @ApiQuery({
    name: 'productID',
    required: true,
    description: 'ID товару для видалення',
  })
  @ApiResponse({ status: 200, description: 'Товар успішно видалено' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID товару' })
  @ApiResponse({ status: 404, description: 'Товар не знайдений' })
  async deleteProduct(@Res() res, @Query('productID') productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Невірний формат ID товару');
    }

    const product = await this.productService.deleteProduct(productId);
    if (!product) throw new NotFoundException('Товар не існує');
    return res.status(HttpStatus.OK).json({
      message: 'Товар був видалений',
      product,
    });
  }
}
