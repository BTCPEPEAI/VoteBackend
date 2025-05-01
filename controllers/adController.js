import Ad from '../models/Ad.js';

export const createAd = async (req, res) => {
  try {
    const { name, type, position, description, link, startDate, endDate } = req.body;
    const file = req.file ? req.file.filename : null;

    const ad = new Ad({ name, type, position, description, link, startDate, endDate, file });
    await ad.save();

    res.status(201).json({ message: 'Ad created', ad });
  } catch (error) {
    res.status(500).json({ error: 'Ad creation failed.' });
  }
};

export const getAdsByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const today = new Date();

    const ads = await Ad.find({
      position,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads.' });
  }
};
