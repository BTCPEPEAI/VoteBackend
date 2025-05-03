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

// Get all tokens
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


// Vote for a token
export const voteForToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const alreadyVoted = await VoteLog.findOne({ tokenId, ip, date: today });

    if (alreadyVoted) {
      return res.status(403).json({ error: 'You can only vote once per day.' });
    }

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

// Get single token by ID
export const getTokenById = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({ error: 'Token not found.' });
    }

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token.' });
  }
};

// Set featured status and date range
// controllers/tokenController.js

exports.setFeatured = async (req, res) => {
  try {
    const { tokenId, status, startDate, endDate, position } = req.body;

    if (!tokenId) {
      return res.status(400).json({ error: 'tokenId is required' });
    }

    await Token.findByIdAndUpdate(tokenId, {
      isFeatured: status,
      featuredStartDate: startDate,
      featuredEndDate: endDate,
      featuredPosition: position,
    });

    res.status(200).json({ message: 'Featured status updated' });
  } catch (err) {
    console.error("setFeatured error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Set trending status and date range
exports.setTrending = async (req, res) => {
  try {
    const { tokenId, status, startDate, endDate, position } = req.body;

    if (!tokenId) {
      return res.status(400).json({ error: 'tokenId is required' });
    }

    await Token.findByIdAndUpdate(tokenId, {
      isTrending: status,
      trendingStartDate: startDate,
      trendingEndDate: endDate,
      trendingPosition: position
    });

    res.status(200).json({ message: 'Trending status updated' });
  } catch (err) {
    console.error("setTrending error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Set promoted status and date range
// controllers/tokenController.js

exports.setPromoted = async (req, res) => {
  try {
    const { tokenId, status, startDate, endDate, position } = req.body;

    if (!tokenId) {
      return res.status(400).json({ error: 'tokenId is required' });
    }

    await Token.findByIdAndUpdate(tokenId, {
      isPromoted: status,
      promotedStartDate: startDate,
      promotedEndDate: endDate,
      promotedPosition: position,
    });

    res.status(200).json({ message: 'Promoted status updated' });
  } catch (err) {
    console.error("setPromoted error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Get featured tokens
export const getFeaturedTokens = async (req, res) => {
  const tokens = await Token.find({ isFeatured: true });
  res.status(200).json(tokens);
};

// Get trending tokens
export const getTrendingTokens = async (req, res) => {
  const tokens = await Token.find({ isTrending: true });
  res.status(200).json(tokens);
};

export const getPromotedTokens = async (req, res) => {
  const tokens = await Token.find({ isTrending: true });
  res.status(200).json(tokens);
};

// Admin: Get all tokens (optional filters)
export const getAdminTokens = async (req, res) => {
  try {
    const { status, featured, trending } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (featured === 'true') filter.isFeatured = true;
    if (trending === 'true') filter.isTrending = true;

    const tokens = await Token.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin tokens.' });
  }
};


export const deleteToken = async (req, res) => {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    if (!token) return res.status(404).json({ error: 'Token not found.' });
    res.status(200).json({ message: 'Token deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete token.' });
  }
};

export const searchTokens = async (req, res) => {
  try {
    const query = req.query.q;
    const tokens = await Token.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive
    });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Search failed.' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topTokens = await Token.find().sort({ votes: -1 }).limit(20);
    res.status(200).json(topTokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard.' });
  }
};

export const boostToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const ip = requestIp.getClientIp(req);

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: 'Token not found.' });

    // Check if IP already boosted in last 24 hrs
    const now = new Date();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasBoosted = token.lastBoostedIPs.some(
      (entry) => entry.ip === ip && new Date(entry.date) > oneDayAgo
    );

    if (hasBoosted) {
      return res.status(403).json({ error: 'You can only boost this token once per 24 hours.' });
    }

    // Clean old IPs (optional to keep doc small)
    token.lastBoostedIPs = token.lastBoostedIPs.filter(
      (entry) => new Date(entry.date) > oneDayAgo
    );

    // Add this boost
    token.boostCount += 1;
    token.lastBoostedIPs.push({ ip, date: now });

    // If boostCount reaches 10,000 → make it featured for 24h
    if (token.boostCount >= 10000 && !token.featuredUntil) {
      token.featuredUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h from now
    }

    await token.save();

    res.status(200).json({ message: 'Boost successful.', boostCount: token.boostCount });
  } catch (error) {
    res.status(500).json({ error: 'Boost failed.' });
  }
};

export const getHomepageTokens = async (req, res) => {
  try {
    const now = new Date();

    const tokens = await Token.find().sort([
      ['featuredUntil', -1], // Featured first
      ['boostCount', -1],    // Then by boost count
      ['createdAt', -1]      // Then by recent
    ]);

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Could not load tokens.' });
  }
};

export const updateTokenAnalytics = async (req, res) => {
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
      token.analytics.avgTimeSpent = (
        (token.analytics.avgTimeSpent * token.analytics.views + timeSpent) /
        (token.analytics.views + 1)
      );
      break;
    default:
      return res.status(400).json({ error: 'Invalid analytics type' });
  }

  await token.save();
  res.json({ success: true });
};
