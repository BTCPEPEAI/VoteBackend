import Token from '../models/Token.js';
import VoteLog from '../models/VoteLog.js';
import cloudinary from '../utils/cloudinary.js';
import requestIp from 'request-ip';
import fs from 'fs';
import { fetchLivePriceAndChart } from '../utils/fetchPrice.js';

// Helper: Parse tags to array
const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') return [tags];
  return [];
};

// ✅ Add new token
export const addToken = async (req, res) => {
  try {
    const {
      name, symbol, chain, contract, description,
      launchDate, totalSupply, launchStatus, tags,
      website, telegram, twitter, discord,
      whitepaper, github, dextoolsLink, exchangeUrl
    } = req.body;

    const tagArray = parseTags(tags);
    let logoUrl = '';

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'tokens' });
      logoUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Clean temp file
    }

    const newToken = new Token({
      name, symbol, chain, contract, description,
      launchDate, totalSupply, launchStatus, tags: tagArray,
      website, telegram, twitter, discord,
      whitepaper, github, dextoolsLink, exchangeUrl,
      logo: logoUrl,
      submittedAt: new Date()
    });

    await newToken.save();
    res.status(201).json({ message: "Token submitted successfully!", token: newToken });
  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ error: error.message || "Failed to submit token." });
  }
};

// ✅ Get all tokens with sort and filter
export const getAllTokens = async (req, res) => {
  try {
    const { sort = 'votes', status = 'all' } = req.query;

    const sortOptions = {
      votes: { votes: -1 },
      recent: { submittedAt: -1 },
      boosts: { boosts: -1 }
    };

    const filter = status === 'all' ? {} : { launchStatus: status };
    const tokens = await Token.find(filter).sort(sortOptions[sort] || sortOptions.votes);

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tokens.' });
  }
};

// ✅ Vote for a token (once per day per IP)
export const voteForToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const today = new Date().toISOString().slice(0, 10);

    const alreadyVoted = await VoteLog.findOne({ tokenId, ip, date: today });
    if (alreadyVoted) return res.status(403).json({ error: 'You can only vote once per day.' });

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: 'Token not found.' });

    token.votes += 1;
    await token.save();
    await VoteLog.create({ tokenId, ip, date: today });

    res.status(200).json({ message: 'Vote counted.', votes: token.votes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote.' });
  }
};

// ✅ Get token by ID
export const getTokenById = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found.' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token.' });
  }
};

// ✅ Generic update helper
const updateStatus = async (req, res, type) => {
  try {
    const { id } = req.params;
    const { status, startDate, endDate, position } = req.body;

    const token = await Token.findById(id);
    if (!token) return res.status(404).json({ error: "Token not found." });

    token[`is${type}`] = status;
    token[`${type.toLowerCase()}StartDate`] = startDate;
    token[`${type.toLowerCase()}EndDate`] = endDate;
    token[`${type.toLowerCase()}Position`] = position;

    await token.save();
    res.status(200).json({ message: `${type} status updated`, token });
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${type.toLowerCase()} status.` });
  }
};

export const addTrendingToken = (req, res) => updateStatus(req, res, 'Trending');
export const addFeaturedToken = (req, res) => updateStatus(req, res, 'Featured');
export const addPromotedToken = (req, res) => updateStatus(req, res, 'Promoted');

// ✅ Delete token
export const deleteToken = async (req, res) => {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found.' });
    res.status(200).json({ message: 'Token deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete token.' });
  }
};

// ✅ Search tokens by name
export const searchTokens = async (req, res) => {
  try {
    const query = req.query.q;
    const tokens = await Token.find({
      name: { $regex: query, $options: 'i' }
    });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Search failed.' });
  }
};

// ✅ Leaderboard (Top 20 by votes)
export const getLeaderboard = async (req, res) => {
  try {
    const topTokens = await Token.find().sort({ votes: -1 }).limit(20);
    res.status(200).json(topTokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard.' });
  }
};

// ✅ Boost token (1 per IP per 24h)
export const boostToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const ip = requestIp.getClientIp(req);
    const now = new Date();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: 'Token not found.' });

    const hasBoosted = token.lastBoostedIPs.some(
      (entry) => entry.ip === ip && new Date(entry.date) > oneDayAgo
    );
    if (hasBoosted) return res.status(403).json({ error: 'You can only boost once per 24 hours.' });

    token.lastBoostedIPs = token.lastBoostedIPs.filter(
      (entry) => new Date(entry.date) > oneDayAgo
    );

    token.boostCount += 1;
    token.lastBoostedIPs.push({ ip, date: now });

    if (token.boostCount >= 10000 && !token.featuredUntil) {
      token.featuredUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    await token.save();
    res.status(200).json({ message: 'Boost successful.', boostCount: token.boostCount });
  } catch (error) {
    res.status(500).json({ error: 'Boost failed.' });
  }
};

// ✅ Homepage tokens (by featured, boost, and recency)
export const getHomepageTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort([
      ['featuredUntil', -1],
      ['boostCount', -1],
      ['createdAt', -1]
    ]);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Could not load tokens.' });
  }
};

// ✅ Update analytics
export const updateTokenAnalytics = async (req, res) => {
  try {
    const { type, timeSpent = 0 } = req.body;
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found.' });

    switch (type) {
      case 'view':
        token.views += 1;
        break;
      case 'impression':
        token.impressions += 1;
        break;
      case 'share':
        token.shares += 1;
        break;
      case 'time':
        token.avgTimeSpent = (
          (token.avgTimeSpent * token.views + timeSpent) /
          (token.views + 1)
        );
        break;
      default:
        return res.status(400).json({ error: 'Invalid analytics type.' });
    }

    await token.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update analytics.' });
  }
};
