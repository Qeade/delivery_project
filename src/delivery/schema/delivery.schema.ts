import * as mongoose from 'mongoose';

export const DeliverySchema = new mongoose.Schema(
  {
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
      enum: ['Прийнято', 'В дорозі', 'Доставлено', 'Відхилено', 'В обробці'],
      required: true,
      default: 'В обробці',
    },
    deliveryPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        // Форматування для createdAt
        if (ret.createdAt) {
          const createdAt = new Date(ret.createdAt);
          const day = String(createdAt.getDate()).padStart(2, '0');
          const month = String(createdAt.getMonth() + 1).padStart(2, '0');
          const year = createdAt.getFullYear();
          ret.createdAt = `${day}-${month}-${year}`; // Форматування як DD-MM-YYYY
        }

        return ret;
      },
    },
  },
);
