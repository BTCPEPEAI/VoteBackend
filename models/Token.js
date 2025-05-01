import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  chain: String,
  contract: String,
  description: String,
  launchDate: String,
  totalSupply: String,
  launchStatus: String,
  tags: [String],
  website: String,
  telegram: String,
  twitter: String,
  discord: String,
  whitepaper: String,
  github: String,
  dextoolsLink: String,
  exchangeUrl: String,
  logo: String,
  livePrice: String,
  submittedAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  boosts: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
