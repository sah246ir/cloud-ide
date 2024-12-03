import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // Import uuid library
const { Schema } = mongoose;

const SandboxSchema = new Schema({
  sandboxid: { type: String, default: uuidv4, unique: true },  // Set UUID as the default value and make it unique
  ip: { type: String},  // Set UUID as the default value and make it unique
  language: String,
  sandbox_ip: String,
  created_on: { type: Date, default: Date.now },
  last_access: { type: Date, default: Date.now }
});

export const SandboxModel = mongoose.model('Sandbox', SandboxSchema);
