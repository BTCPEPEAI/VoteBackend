// models/Token.js
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String },
  chain: { type: String },
  launchStatus: { type: String },
  logo: { type: String },
  website: { type: String },
  dextoolsLink: { type: String },
  livePrice: {String},
  chartEmbed: {String}, 
  boostCount: { type: Number, default: 0 },
  lastBoostedIPs: [{ ip: String, date: Date }],
  featuredUntil: { type: Date, default: null },
  boostedUntil: { type: Date, default: null },
  boostedUntil: { type: Date, default: null },
  exchangeUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  avgTimeSpent: { type: Number, default: 0 }, // in seconds
  shares: { type: Number, default: 0 },
  kyc: { type: Boolean, default: false },
  audit: { type: Boolean, default: false }
});



export default mongoose.model('Token', tokenSchema);
