import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['image', 'gif', 'video'], required: true },
  position: { 
    type: String,
    enum: ['homepage_banner', 'sidebar_top', 'sidebar_bottom', 'token_page_header', 'leaderboard_top', 'mobile_banner', 'featured_section', 'footer_banner']
  },
  file: String,
  description: String,
  link: String,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ad', adSchema);
