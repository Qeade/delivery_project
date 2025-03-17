import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (ret.birthDate) {
      const birthDate = new Date(ret.birthDate);
      const day = String(birthDate.getDate()).padStart(2, '0');
      const month = String(birthDate.getMonth() + 1).padStart(2, '0');
      const year = birthDate.getFullYear();
      ret.birthDate = `${day}-${month}-${year}`;
    }

    if (ret.createdAt) {
      const createdAt = new Date(ret.createdAt);
      const day = String(createdAt.getDate()).padStart(2, '0');
      const month = String(createdAt.getMonth() + 1).padStart(2, '0');
      const year = createdAt.getFullYear();
      ret.createdAt = `${day}-${month}-${year}`;
    }

    return ret;
  },
});
