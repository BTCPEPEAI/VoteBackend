import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  projectName: String,
  tokenSymbol: String,
  contactEmail: String,
  telegram: String,
  website: String,
  description: String,
  applicationType: { type: String, enum: ['kyc', 'audit'] },
  teamInfo: String,
  documentUrl: String, // (URL after uploading to cloud or local path)
  transactionId: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  ip: String
});

export default mongoose.model('VerificationApplication', verificationSchema);
