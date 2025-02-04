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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import mongoose from 'mongoose';

@ApiTags('roles')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role data that needs to be created',
  })
  @ApiResponse({ status: 201, description: 'Role successfully created' })
  @ApiResponse({ status: 400, description: 'Role already exists' })
  async addRole(@Res() res, @Body() createRoleDto: CreateRoleDto) {
    try {
      const existingRole = await this.roleService.findRolesByRole(
        createRoleDto.role,
      );

      if (existingRole) {
        throw new BadRequestException('Role with this name already exists');
      }

      const role = await this.roleService.addRole(createRoleDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Role has been created successfully',
        role,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'All roles received' })
  async getAllRoles(@Res() res) {
    const roles = await this.roleService.getAllRoles();
    return res.status(HttpStatus.OK).json(roles);
  }

  @Get(':roleID')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({
    name: 'roleID',
    required: true,
    description: 'ID of the role',
  })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 400, description: 'Invalid role ID format' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRole(@Res() res, @Param('roleID') roleID: string) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      throw new BadRequestException('Invalid role ID format');
    }

    const role = await this.roleService.getRole(roleID);
    if (!role) throw new NotFoundException('Role does not exist!');
    return res.status(HttpStatus.OK).json(role);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiQuery({
    name: 'roleID',
    required: true,
    description: 'ID of the role to update',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Updated role data',
  })
  @ApiResponse({ status: 200, description: 'Role successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid role ID format' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(
    @Res() res,
    @Query('roleID') roleID: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      throw new BadRequestException('Invalid role ID format');
    }

    const role = await this.roleService.updateRole(roleID, createRoleDto);
    if (!role) throw new NotFoundException('Role does not exist!');

    return res.status(HttpStatus.OK).json({
      message: 'Role has been successfully updated',
      role,
    });
  }

  @Delete('/delete')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiQuery({
    name: 'roleID',
    required: true,
    description: 'ID of the role to delete',
  })
  @ApiResponse({ status: 200, description: 'Role successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid role ID format' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Res() res, @Query('roleID') roleID: string) {
    if (!mongoose.Types.ObjectId.isValid(roleID)) {
      throw new BadRequestException('Invalid role ID format');
    }

    const role = await this.roleService.deleteRole(roleID);
    if (!role) throw new NotFoundException('Role does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'Role has been deleted',
      role,
    });
  }
}
