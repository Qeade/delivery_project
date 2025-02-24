import * as mongoose from 'mongoose';

export const DeliverySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: ['Прийнято', 'В дорозі', 'Доставлено', 'Відхилено'],
    required: true,
    default: 'Прийнято',
  },
  deliveryPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
