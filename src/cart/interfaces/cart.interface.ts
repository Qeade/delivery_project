import { Document } from 'mongoose';

export interface CartItem {
  product: string;
  quantity: number;
}

export interface Cart extends Document {
  readonly user: string;
  products: CartItem[];
  readonly createdAt: Date;
}
