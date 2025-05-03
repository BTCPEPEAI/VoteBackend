// routes/tokenRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import {
    addToken,
    getAllTokens,
    voteForToken,
    getTokenById,
    setFeatured,
    setTrending,
    getAdminTokens,
    deleteToken,
    getFeaturedTokens,
    getTrendingTokens,
    searchTokens,
    getLeaderboard,
    boostToken,
    getHomepageTokens,
    updateTokenAnalytics
  } from '../controllers/tokenController.js';
  

const router = express.Router();

// POST /api/tokens/submit
router.post('/submit', upload.single('logo'), addToken);

// Get all tokens
router.get('/all', getAllTokens);


router.post('/:id/vote', voteForToken);

router.get('/:id', getTokenById);


// === Admin Status Controls ===
// Set token as featured
router.post('/:id/featured', setFeatured); // body: { status, startDate, endDate, position }
// Set token as trending
router.post('/:id/trending', setTrending); // body: { status, startDate, endDate, position }
// Set token as promoted
router.post('/:id/promoted', setPromoted); // body: { status, startDate, endDate, position }

// === Admin Panel Token Fetching ===
router.get('/admin/list', getAdminTokens);        // All tokens (for management panel)
router.get('/featured/list', getFeaturedTokens);  // Featured tokens
router.get('/trending/list', getTrendingTokens);  // Trending tokens
// Optional if needed
// router.get('/promoted/list', getPromotedTokens);  // Promoted tokens

// === Token Utilities ===
router.get('/search', searchTokens);             // Token search
router.get('/leaderboard', getLeaderboard);      // Top-voted tokens
router.get('/homepage', getHomepageTokens);      // Combined homepage tokens
router.post('/:id/boost', boostToken);           // Boost token (paid promotion)
router.post('/:id/analytics', updateTokenAnalytics); // Track token analytics

// === Token Management ===
router.delete('/:id', deleteToken);              // Delete token by ID


export default router;
