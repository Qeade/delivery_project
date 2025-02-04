import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './interfaces/role.interface';
import { CreateRoleDto } from './dto/create-role.dto';
@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  async getAllRoles(): Promise<Role[]> {
    const roles = await this.roleModel.find().exec();
    return roles;
  }

  async getRole(roleID): Promise<Role | null> {
    const role = await this.roleModel.findById(roleID).exec();
    return role;
  }

  async addRole(createRoleDTO: CreateRoleDto): Promise<Role> {
    const newRole = await new this.roleModel(createRoleDTO);
    return newRole.save();
  }

  async updateRole(roleID, createRoleDTO: CreateRoleDto): Promise<Role | null> {
    const updatedRole = await this.roleModel.findByIdAndUpdate(
      roleID,
      createRoleDTO,
      { new: true },
    );
    return updatedRole;
  }

  async deleteRole(roleID): Promise<Role | null> {
    const deletedRole = await this.roleModel.findByIdAndDelete(roleID);
    return deletedRole;
  }

  async findRolesByRole(role: string): Promise<Role[]> {
    return this.roleModel.find({
      role,
    });
  }
}
