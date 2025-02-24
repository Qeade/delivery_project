import { Schema } from 'mongoose';

export const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  postalCode: { type: String, required: true },
});
