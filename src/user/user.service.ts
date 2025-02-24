import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(userID: string): Promise<User | null> {
    return this.userModel.findById(userID).exec();
  }

  async updateUser(
    userID: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userID, updateUserDto, { new: true })
      .exec();
  }

  async deleteUser(userID: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userID).exec();
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }
}
