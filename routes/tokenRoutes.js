import express from 'express';
import upload from '../config/multer.js';
import {
  addToken,
  getAllTokens,
  voteForToken,
  getTokenById,
  setFeatured,
  setTrending,
  setPromoted,
  getAdminTokens,
  deleteToken,
  getFeaturedTokens,
  getTrendingTokens,
  getPromotedTokens,
  searchTokens,
  getLeaderboard,
  boostToken,
  getHomepageTokens,
  updateTokenAnalytics,
  updateTokenStatus,
} from '../controllers/tokenController.js';

import Token from '../models/Token.js';

const router = express.Router();

// 🔍 Search Tokens
router.get('/search', searchTokens);

// 📥 Submit a Token (with logo upload)
router.post('/submit', upload.single('logo'), addToken);

// 📄 Fetch all tokens (or filtered by status)
router.get('/', async (req, res) => {
  const status = req.query.status;
  try {
    const filter = {};
    if (status === 'featured') filter.isFeatured = true;
    else if (status === 'trending') filter.isTrending = true;
    else if (status === 'promoted') filter.isPromoted = true;

    const tokens = await Token.find(filter).sort({ position: 1 });
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).json({ error: "Failed to fetch tokens" });
  }
});

// 🧠 Token Detail & Voting
router.get('/:id', getTokenById);
router.post('/:id/vote', voteForToken);

// 📈 Token Status Update for Admin (used in TokenManagementDialog)
router.post('/:id/featured', setFeatured);     // Legacy support
router.post('/:id/trending', setTrending);     // Legacy support
router.post('/:id/promoted', setPromoted);     // Legacy support

// ✅ RECOMMENDED: Unified update route
router.post('/:id/status', updateTokenStatus); // <- Call this from frontend to update any status (featured/trending/promoted) with full metadata

// 🧰 Admin + Analytics
router.get('/admin/list', getAdminTokens);
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.get('/promoted/list', getPromotedTokens);

// 💹 Voting + Leaderboard + Homepage
router.get('/leaderboard', getLeaderboard);
router.get('/homepage', getHomepageTokens);
router.post('/:id/boost', boostToken);
router.post('/:id/analytics', updateTokenAnalytics);

// ❌ Delete
router.delete('/:id', deleteToken);

export default router;
