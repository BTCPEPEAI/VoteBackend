import mongoose from 'mongoose';

const adSubmissionSchema = new mongoose.Schema({
  adName: String,
  adType: { type: String, enum: ['image', 'gif', 'video'] },
  position: {
    type: String,
    enum: [
      'homepage_banner', 'sidebar_top', 'sidebar_bottom',
      'token_page_header', 'leaderboard_top', 'mobile_banner',
      'featured_section', 'footer_banner'
    ]
  },
  fileUrl: String, // uploaded file path
  targetUrl: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AdSubmission', adSubmissionSchema);
