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
} from '../controllers/tokenController.js';

const router = express.Router();

// Search tokens (must be before /:id to prevent route collision)
router.get('/search', searchTokens);

// Token submission (with image upload)
router.post('/submit', upload.single('logo'), addToken);

// General token list
router.get('/all', getAllTokens);

// Admin: filtered list of tokens
router.get('/admin/list', getAdminTokens);

// Homepage prioritized tokens
router.get('/homepage', getHomepageTokens);

// Leaderboard based on votes
router.get('/leaderboard', getLeaderboard);

// Filtered status-based list via query (?status=featured|trending|promoted)
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const query = {};
    if (status === 'featured') query['featured.status'] = true;
    else if (status === 'trending') query['trending.status'] = true;
    else if (status === 'promoted') query['promoted.status'] = true;

    const tokens = await Token.find(query).sort({ [`${status}.position`]: 1 });
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Status filter error:", error);
    res.status(500).json({ message: "Server error while filtering tokens" });
  }
});

// Token ID-specific routes
router.get('/:id', getTokenById);
router.post('/:id/vote', voteForToken);
router.post('/:id/boost', boostToken);
router.post('/:id/analytics', updateTokenAnalytics);
router.delete('/:id', deleteToken);

// Admin status toggling (position/startDate/endDate)
router.post('/:id/featured', setFeatured);
router.post('/:id/trending', setTrending);
router.post('/:id/promoted', setPromoted);

// Legacy list endpoints (optional)
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.get('/promoted/list', getPromotedTokens);

export default router;
