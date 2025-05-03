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
    setPromoted,
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

// Admin: set featured/trending
router.post('/:id/featured', setFeatured);   // body: { status: true/false }
router.post('/:id/trending', setTrending);   // body: { status: true/false }
router.post('/:id/promoted', setPromoted);
router.get('/admin/list', getAdminTokens);
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.delete('/:id', deleteToken);
router.get('/search', searchTokens);
router.get('/leaderboard', getLeaderboard);
router.post('/:id/boost', boostToken);
router.get('/homepage', getHomepageTokens);
router.post('/:id/analytics', updateTokenAnalytics);


export default router;
