import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
