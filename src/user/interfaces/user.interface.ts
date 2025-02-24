import { Document } from 'mongoose';

export interface User extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly role: 'user' | 'admin';
  readonly createdAt: Date;
}
