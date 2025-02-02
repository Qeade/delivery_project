import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const students = await this.productModel.find().exec();
    return students;
  }

  async getProduct(productID): Promise<Product | null> {
    const product = await this.productModel.findById(productID).exec();
    return product;
  }

  async addProduct(createProductDTO: CreateProductDto): Promise<Product> {
    const newProduct = await new this.productModel(createProductDTO);
    return newProduct.save();
  }

  async updateProduct(
    productID,
    createProductDTO: CreateProductDto,
  ): Promise<Product | null> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productID,
      createProductDTO,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(productID): Promise<Product | null> {
    const deletedProduct = await this.productModel.findByIdAndDelete(productID);
    return deletedProduct;
  }

  async findProductsByName(name: string): Promise<Product[]> {
    return this.productModel.find({
      name: new RegExp(`^${name}( \\d+)?$`, 'i'),
    });
  }
}
