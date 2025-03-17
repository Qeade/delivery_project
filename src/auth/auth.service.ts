import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Cart } from 'src/cart/interfaces/cart.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Cart') private cartModel: Model<Cart>,
    private configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; token: string }> {
    const { phoneNumber, password } = registerDto;

    const existingUser = await this.userModel.findOne({ phoneNumber });

    if (existingUser) {
      throw new ConflictException(
        'Користувач з таким номером телефону вже існує',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();

    const newCart = new this.cartModel({
      user: newUser._id,
      products: [],
    });

    await newCart.save();

    const token = this.createJwtToken(newUser);

    return { user: newUser, token };
  }

  private createJwtToken(user: User): string {
    const payload = { id: user._id, role: user.role };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET не визначений');
    }

    return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { phoneNumber, password } = loginDto;

    const user = await this.userModel.findOne({ phoneNumber });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createJwtToken(user);

    return { user, token };
  }
}
