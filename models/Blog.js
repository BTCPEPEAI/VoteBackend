// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  avgTimeSpent: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
});

export default mongoose.model('Blog', blogSchema);
