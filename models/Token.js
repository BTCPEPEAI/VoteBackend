import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  chain: {String},
  contract: {String},
  description: {String},
  launchDate: {String},
  totalSupply: {String},
  launchStatus: {String},
  tags: {String},
  website: {String},
  telegram: {String},
  twitter: {String},
  discord: {String},
  whitepaper: {String},
  github: {String},
  dextoolsLink: {String},
  livePrice: { type: String },
  chartEmbed: { type: String },
  boostCount: { type: Number, default: 0 },
  lastBoostedIPs: [{ ip: String, date: Date }],
  featuredUntil: { type: Date, default: null },
  boostedUntil: { type: Date, default: null },
  exchangeUrl: {String},
  logo: {String},
  isApproved: { type: Boolean, default: true },
  submittedAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  boosts: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  avgTimeSpent: { type: Number, default: 0 }, // in seconds
  shares: { type: Number, default: 0 },
  kyc: { type: Boolean, default: false },
  audit: { type: Boolean, default: false }
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;


