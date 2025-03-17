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
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { VerifyPasswordDto } from './dto/verify-password.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Користувачі')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles('admin')
  @Get('users')
  @ApiOperation({
    summary: 'Отримати всіх користувачів',
    description: 'Отримує всіх доступних користувачів з бази даних',
  })
  @ApiResponse({ status: 200, description: 'Всі користувачі отримані' })
  async getAllUsers(@Res() res) {
    const users = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':userID')
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiParam({
    name: 'userID',
    required: true,
    description: 'ID користувача',
  })
  @ApiResponse({ status: 200, description: 'Користувач знайдений' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID користувача' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async getUser(@Res() res, @Param('userID') userID: string) {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Невірний формат ID користувача');
    }

    const user = await this.userService.getUserById(userID);
    if (!user) throw new NotFoundException('Користувач не існує!');
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/verify-password')
  @ApiOperation({ summary: 'Перевірити пароль користувача' })
  @ApiBody({ type: VerifyPasswordDto, description: 'Пароль для перевірки' })
  @ApiResponse({ status: 200, description: 'Пароль правильний' })
  @ApiResponse({
    status: 400,
    description: 'Невірний пароль або користувач не знайдений',
  })
  async verifyPassword(
    @Res() res,
    @Body() verifyPasswordDto: VerifyPasswordDto,
  ) {
    const { userID, password } = verifyPasswordDto;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Невірний формат ID користувача');
    }

    const isValid = await this.userService.verifyPassword(userID, password);
    if (!isValid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'Невірний пароль' });
    }

    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: 'Пароль правильний' });
  }

  @Put('/update')
  @ApiOperation({ summary: 'Оновити існуючого користувача' })
  @ApiQuery({
    name: 'userID',
    required: true,
    description: 'ID користувача для оновлення',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Оновлені дані користувача',
  })
  @ApiResponse({ status: 200, description: 'Користувач успішно оновлений' })
  @ApiResponse({
    status: 400,
    description:
      'Невірний формат ID користувача або телефонний номер вже існує',
  })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async updateUser(
    @Res() res,
    @Query('userID') userID: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Невірний формат ID користувача');
    }

    const existingUser = await this.userService.findUserByPhoneNumber(
      updateUserDto.phoneNumber,
    );
    if (existingUser && existingUser.id !== userID) {
      throw new BadRequestException('Телефонний номер вже існує');
    }

    const user = await this.userService.updateUser(userID, updateUserDto);
    if (!user) throw new NotFoundException('Користувач не існує!');

    return res.status(HttpStatus.OK).json({
      message: 'Користувач був успішно оновлений',
      user,
    });
  }

  @Roles('admin')
  @Delete('/delete')
  @ApiOperation({ summary: 'Видалити користувача' })
  @ApiQuery({
    name: 'userID',
    required: true,
    description: 'ID користувача для видалення',
  })
  @ApiResponse({ status: 200, description: 'Користувач успішно видалений' })
  @ApiResponse({ status: 400, description: 'Невірний формат ID користувача' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async deleteUser(@Res() res, @Query('userID') userID: string) {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      throw new BadRequestException('Невірний формат ID користувача');
    }

    const user = await this.userService.deleteUser(userID);
    if (!user) throw new NotFoundException('Користувач не існує');
    return res.status(HttpStatus.OK).json({
      message: 'Користувач був видалений',
      user,
    });
  }
}
