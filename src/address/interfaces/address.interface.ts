import { Document } from 'mongoose';

export interface Address extends Document {
  user: string;
  country: string;
  city: string;
  street: string;
  house: string;
  postalCode: string;
}
