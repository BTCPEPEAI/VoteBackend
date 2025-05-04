import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  chain: { type: String },
  contract: { type: String },
  description: { type: String },
  launchDate: { type: String },
  totalSupply: { type: String },
  launchStatus: { type: String },
  tags: [{ type: String }],
  website: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  discord: { type: String },
  whitepaper: { type: String },
  github: { type: String },
  dextoolsLink: { type: String },
  exchangeUrl: { type: String },
  logo: { type: String },
  livePrice: { type: String },
  chartEmbed: { type: String },

  isApproved: { type: Boolean, default: true },
  status: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  boostCount: { type: Number, default: 0 },
  boosts: { type: Number, default: 0 },

  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPromoted: { type: Boolean, default: false },

  featured: {
    status: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    position: { type: Number },
  },
  trending: {
    status: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    position: { type: Number },
  },
  promoted: {
    status: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    position: { type: Number },
  },

  featuredUntil: { type: Date, default: null },
  boostedUntil: { type: Date, default: null },

  submittedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  avgTimeSpent: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },

  kyc: { type: Boolean, default: false },
  audit: { type: Boolean, default: false },

  lastBoostedIPs: [
    {
      ip: { type: String },
      date: { type: Date },
    },
  ],
});

const Token = mongoose.model('Token', tokenSchema, 'tokens');
export default Token;
