import { Document } from 'mongoose';

export interface Role extends Document {
  readonly role: String;
  readonly created_at: Date;
}
