import AdSubmission from '../models/AdSubmission.js';

// User submits ad application
export const submitAd = async (req, res) => {
  try {
    const file = req.file?.path || '';
    const ad = new AdSubmission({
      ...req.body,
      fileUrl: file
    });
    await ad.save();
    res.json({ success: true, message: 'Ad submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit ad' });
  }
};

// Admin views all submissions
export const getAllAdSubmissions = async (req, res) => {
  try {
    const ads = await AdSubmission.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
};

// Admin updates ad status
export const updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await AdSubmission.findByIdAndUpdate(id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};
