import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    isLicensed: { type: Boolean, required: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        // Форматування для created_at
        if (ret.created_at) {
          const createdAt = new Date(ret.created_at);
          const day = String(createdAt.getDate()).padStart(2, '0');
          const month = String(createdAt.getMonth() + 1).padStart(2, '0');
          const year = createdAt.getFullYear();
          ret.created_at = `${day}-${month}-${year}`; // Форматування як DD-MM-YYYY
        }

        return ret;
      },
    },
  },
);
