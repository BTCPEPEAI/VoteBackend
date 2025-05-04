// controllers/tokenController.js
import Token from '../models/Token.js';
import { fetchLivePriceAndChart } from '../utils/fetchPrice.js';
import VoteLog from '../models/VoteLog.js';
import cloudinary from '../utils/cloudinary.js';
import requestIp from 'request-ip';
import fs from 'fs';

export const addToken = async (req, res) => {
  try {
    const {
      name,
      symbol,
      chain,
      contract,
      description,
      launchDate,
      totalSupply,
      launchStatus,
      tags,
      website,
      telegram,
      twitter,
      discord,
      whitepaper,
      github,
      dextoolsLink,
      exchangeUrl
    } = req.body;

    const tagArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
        ? [tags]
        : [];

    let logoUrl = '';

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tokens'
      });

      logoUrl = result.secure_url;

      fs.unlinkSync(req.file.path); // Remove temp file
    }

    const newToken = new Token({
      name,
      symbol,
      chain,
      contract,
      description,
      launchDate,
      totalSupply,
      launchStatus,
      tags: tagArray,
      website,
      telegram,
      twitter,
      discord,
      whitepaper,
      github,
      dextoolsLink,
      exchangeUrl,
      logo: logoUrl,
      submittedAt: new Date()
    });

    await newToken.save();

    res.status(201).json({
      message: "Token submitted successfully!",
      token: newToken
    });

  } catch (error) {
    console.error("🔴 Submit Error:", error.message, error);
    res.status(500).json({ error: error.message || "Failed to submit token." });
  }
};

// ✅ Get all tokens with optional sorting/status filter
export const getAllTokens = async (req, res) => {
  try {
    const { sort = 'votes', status = 'all' } = req.query;

    const sortOptions = {
      votes: { votes: -1 },
      recent: { submittedAt: -1 },
      boosts: { boostCount: -1 }
    };

    const filter = status === 'all' ? {} : { launchStatus: status };
    const tokens = await Token.find(filter).sort(sortOptions[sort] || sortOptions.votes);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tokens.' });
  }
};

// ✅ Vote
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

// ✅ Get single token
export const getTokenById = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found.' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token.' });
  }
};

// ✅ Generic status update handler
const updateTokenStatus = async (req, res, type) => {
  try {
    const id = req.params.id || req.body.token;
    const { status, startDate, endDate, position } = req.body;

    if (!id || typeof status === 'undefined' || typeof position === 'undefined') {
      return res.status(400).json({ message: "Missing id, status, or position." });
    }

    const updateData = {
      [`${type.toLowerCase()}.status`]: status,
      [`${type.toLowerCase()}.startDate`]: startDate,
      [`${type.toLowerCase()}.endDate`]: endDate,
      [`${type.toLowerCase()}.position`]: position
    };

    const updated = await Token.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Token not found." });

    res.status(200).json({ message: `${type} status updated.`, token: updated });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    res.status(500).json({ message: `Failed to update ${type} status.` });
  }
};

// ✅ Status toggles
export const setFeatured = (req, res) => updateTokenStatus(req, res, 'Featured');
export const setTrending = (req, res) => updateTokenStatus(req, res, 'Trending');
export const setPromoted = (req, res) => updateTokenStatus(req, res, 'Promoted');

// ✅ Proper featured/trending/promoted fetchers
export const getFeaturedTokens = async (req, res) => {
  const tokens = await Token.find({ 'featured.status': true }).sort({ 'featured.position': 1 });
  res.status(200).json(tokens);
};
const trendingTokens = await Token.find({ 'trending.status': true }).sort({ 'trending.position': 1 });
 try {
    const trendings = await Trending.find().populate({
      path: "tokenId",
      model: "Token",
    });

    const filtered = trendings.filter(item => item.tokenId); // remove broken refs
    res.json(filtered);
  } catch (err) {
    console.error("Trending Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch trending tokens." });
  }
};


export const getPromotedTokens = async (req, res) => {
  const tokens = await Token.find({ 'promoted.status': true }).sort({ 'promoted.position': 1 });
  res.status(200).json(tokens);
};

// ✅ Admin view
export const getAdminTokens = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status === 'featured') filter['featured.status'] = true;
    else if (status === 'trending') filter['trending.status'] = true;
    else if (status === 'promoted') filter['promoted.status'] = true;
    // ✅ Optional: handle 'all' or unknown status
    else if (status && status !== 'all') {
      return res.status(400).json({ error: 'Invalid status filter.' });
    }

    const tokens = await Token.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tokens);
  } catch (error) {
    console.error("🔴 Admin token fetch error:", error);
    res.status(500).json({ error: 'Failed to fetch tokens.' });
  }
};


// ✅ Delete token
export const deleteToken = async (req, res) => {
  try {
    const deleted = await Token.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Token not found.' });
    res.status(200).json({ message: 'Token deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete token.' });
  }
};

// ✅ Search
export const searchTokens = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query?.trim()) return res.status(400).json({ error: 'Query required.' });

    const tokens = await Token.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { symbol: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('name symbol chain logo');

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Search failed.' });
  }
};

// ✅ Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ votes: -1 }).limit(20);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard.' });
  }
};

// ✅ Boost
export const boostToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const ip = requestIp.getClientIp(req);
    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: 'Token not found.' });

    const now = new Date();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasBoosted = token.lastBoostedIPs.some(
      (entry) => entry.ip === ip && new Date(entry.date) > oneDayAgo
    );

    if (hasBoosted) {
      return res.status(403).json({ error: 'You can only boost once every 24h.' });
    }

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

// ✅ Homepage
export const getHomepageTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort([
      ['featuredUntil', -1],
      ['boostCount', -1],
      ['createdAt', -1]
    ]);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Could not load homepage tokens.' });
  }
};

// ✅ Analytics
export const updateTokenAnalytics = async (req, res) => {
  try {
    const { type, timeSpent = 0 } = req.body;
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    switch (type) {
      case 'view':
        token.analytics.views += 1;
        break;
      case 'impression':
        token.analytics.impressions += 1;
        break;
      case 'share':
        token.analytics.shares += 1;
        break;
      case 'time':
        token.analytics.avgTimeSpent =
          (token.analytics.avgTimeSpent * token.analytics.views + timeSpent) /
          (token.analytics.views + 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid analytics type' });
    }

    await token.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Analytics update failed.' });
  }
};
