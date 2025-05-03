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
    setPromoted,               // ✅ ADD THIS
    getAdminTokens,
    deleteToken,
    getFeaturedTokens,
    getTrendingTokens,
    getPromotedTokens,         // ✅ ADD THIS
    searchTokens,
    tokenController,
    getLeaderboard,
    boostToken,
    getHomepageTokens,
    updateTokenAnalytics
} from '../controllers/tokenController.js';

const router = express.Router();

router.post('/submit', upload.single('logo'), addToken);
router.get('/all', getAllTokens);
router.post('/:id/vote', voteForToken);
router.get('/:id', getTokenById);

router.post('/:id/featured', setFeatured);
router.post('/:id/trending', setTrending);
router.post('/:id/promoted', setPromoted);          // ✅ ADDED

router.get('/admin/list', getAdminTokens);
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.get('/promoted/list', getPromotedTokens);    // ✅ ADDED

router.get('/search', tokenController.searchTokens); // 👈 must be before any `/:id` routes
router.get('/leaderboard', getLeaderboard);
router.get('/homepage', getHomepageTokens);
router.post('/:id/boost', boostToken);
router.post('/:id/analytics', updateTokenAnalytics);

router.delete('/:id', deleteToken);

export default router;
