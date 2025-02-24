import { Document } from 'mongoose';

export interface DeliveryProduct {
  product: string;
  quantity: number;
}

export interface Delivery extends Document {
  readonly user: string;
  readonly address: string;
  products: DeliveryProduct[];
  status: 'Прийнято' | 'В дорозі' | 'Доставлено' | 'Відхилено';
  deliveryPrice: number;
  totalPrice: number;
  readonly createdAt: Date;
}
