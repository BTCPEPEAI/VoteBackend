import mongoose from 'mongoose';

const trafficLogSchema = new mongoose.Schema({
  ip: String,
  country: String,
  page: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TrafficLog', trafficLogSchema);
