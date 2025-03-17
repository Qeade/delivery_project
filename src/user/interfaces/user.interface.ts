import { Document } from 'mongoose';

export interface User extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly birthDate: Date;
  readonly password: string;
  readonly role: 'user' | 'admin';
  readonly createdAt: Date;
}
