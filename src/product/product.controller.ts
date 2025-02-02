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
} from '@nestjs/swagger';
import mongoose from 'mongoose';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  //створення
  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data that needs to be created',
  })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  async addProduct(@Res() res, @Body() createProductDTO: CreateProductDto) {
    try {
      const { name, price } = createProductDTO;

      if (price <= 0) {
        throw new BadRequestException('Price must be greater than zero');
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
        message: 'Product has been created successfully',
        product,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //всі
  @Get('products')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Fetches all available products in the database',
  })
  @ApiResponse({ status: 200, description: 'All the products received' })
  async getAllProducts(@Res() res) {
    const products = await this.productService.getAllProducts();
    return res.status(HttpStatus.OK).json(products);
  }

  //за ID
  @Get(':productID')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({
    name: 'productID',
    required: true,
    description: 'ID of the product',
  })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 400, description: 'Invalid product ID format' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Res() res, @Param('productID') productID: string) {
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productService.getProduct(productID);
    if (!product) throw new NotFoundException('Product does not exist!');
    return res.status(HttpStatus.OK).json(product);
  }

  // оновлення
  @Put('/update')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiQuery({
    name: 'productID',
    required: true,
    description: 'ID of the product to update',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Updated product data',
  })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({
    status: 400,
    description: 'Invalid product ID format or invalid price',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Res() res,
    @Query('productID') productID: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      throw new BadRequestException('Invalid product ID format');
    }

    if (createProductDto.price !== undefined && createProductDto.price < 0) {
      throw new BadRequestException('Price cannot be less than 0');
    }

    const product = await this.productService.updateProduct(
      productID,
      createProductDto,
    );
    if (!product) throw new NotFoundException('Product does not exist!');

    return res.status(HttpStatus.OK).json({
      message: 'Product has been successfully updated',
      product,
    });
  }

  //видалення
  @Delete('/delete')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiQuery({
    name: 'productID',
    required: true,
    description: 'ID of the product to delete',
  })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid product ID format' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Res() res, @Query('productID') productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productService.deleteProduct(productId);
    if (!product) throw new NotFoundException('Product does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'Product has been deleted',
      product,
    });
  }
}
