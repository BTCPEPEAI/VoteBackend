import VerificationApplication from '../models/VerificationApplication.js';

export const submitVerification = async (req, res) => {
  try {
    const data = req.body;
    data.ip = req.ip;

    const newApp = new VerificationApplication(data);
    await newApp.save();
    res.json({ success: true, message: 'Application submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
};
export const getAllApplications = async (req, res) => {
    try {
      const apps = await VerificationApplication.find().sort({ submittedAt: -1 });
      res.json(apps);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  };
  
  export const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    try {
      const app = await VerificationApplication.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      res.json(app);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update application' });
    }
  };
  