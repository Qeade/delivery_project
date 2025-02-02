import { Document } from 'mongoose';

export interface Product extends Document {
  readonly name: String;
  readonly price: Number;
  readonly imageUrl: String;
  readonly description: String;
  readonly created_at: Date;
}
