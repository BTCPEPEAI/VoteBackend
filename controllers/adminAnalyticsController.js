import Token from '../models/Token.js';
import News from '../models/News.js';
import Ad from '../models/Ad.js';

export const getTokenAnalytics = async (req, res) => {
  try {
    const tokens = await Token.find({}, 'name analytics').sort({ 'analytics.views': -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token analytics' });
  }
};

export const getNewsAnalytics = async (req, res) => {
    try {
      const news = await News.find({}, 'title analytics').sort({ 'analytics.views': -1 });
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch news analytics' });
    }
  };
  export const getAdsAnalytics = async (req, res) => {
    try {
      const ads = await Ad.find({}, 'name position analytics').sort({ 'analytics.views': -1 });
      res.json(ads);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch ad analytics' });
    }
  };
  