import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './interfaces/address.interface';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(@InjectModel('Address') private addressModel: Model<Address>) {}

  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const newAddress = new this.addressModel({
      ...createAddressDto,
      user: userId,
    });
    return newAddress.save();
  }

  async getAllAddresses(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.addressModel.find({ user: userId }).exec();
  }

  async getAddressById(addressId: string): Promise<Address> {
    const address = await this.addressModel.findById(addressId).exec();
    if (!address) {
      throw new NotFoundException('Адресу не знайдено');
    }
    return address;
  }

  async updateAddress(
    addressId: string,
    updateAddressDto: Partial<CreateAddressDto>,
  ): Promise<Address> {
    const updatedAddress = await this.addressModel
      .findByIdAndUpdate(addressId, updateAddressDto, { new: true })
      .exec();
    if (!updatedAddress) {
      throw new NotFoundException('Адресу не знайдено');
    }
    return updatedAddress;
  }

  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const result = await this.addressModel.findByIdAndDelete(addressId).exec();
    if (!result) {
      throw new NotFoundException('Адресу не знайдено');
    }
    return { message: 'Адреса видалена успішно' };
  }
}
