import * as mongoose from 'mongoose';

export const RoleSchema = new mongoose.Schema({
  role: { type: String, require: true, unique: true },
  created_at: { type: Date, default: Date.now },
});
