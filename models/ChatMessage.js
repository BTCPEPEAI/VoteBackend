import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  ip: String,
  message: String,
  sender: { type: String, enum: ['user', 'admin'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatMessage', chatMessageSchema);
