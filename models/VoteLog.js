// models/VoteLog.js
import mongoose from 'mongoose';

const voteLogSchema = new mongoose.Schema({
  tokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
  ip: String,
  date: String // e.g. "2025-05-01"
});

export default mongoose.model('VoteLog', voteLogSchema);
