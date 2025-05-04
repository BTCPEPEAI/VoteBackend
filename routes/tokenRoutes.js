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
    updateTokenAnalytics
} from '../controllers/tokenController.js';

import Token from '../models/Token.js';

const router = express.Router();

// 🔍 Search route (must come first)
router.get('/search', searchTokens);

// 🆕 Route to support `?status=featured|trending|promoted` (used in frontend)
router.get('/', async (req, res) => {
    const status = req.query.status;

    try {
        let filter = {};
        if (status === 'featured') filter['featured.status'] = true;
        else if (status === 'trending') filter['trending.status'] = true;
        else if (status === 'promoted') filter['promoted.status'] = true;

        const tokens = await Token.find(filter).sort({ [`${status}.position`]: 1 });
        res.status(200).json(tokens);
    } catch (error) {
        console.error("Error fetching tokens by status:", error);
        res.status(500).json({ error: "Failed to fetch tokens" });
    }
});

// ✅ Token submission (with logo)
router.post('/submit', upload.single('logo'), addToken);

// 🔁 All tokens
router.get('/all', getAllTokens);

// 🔁 Admin, homepage, leaderboard views
router.get('/admin/list', getAdminTokens);
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.get('/promoted/list', getPromotedTokens);
router.get('/leaderboard', getLeaderboard);
router.get('/homepage', getHomepageTokens);

// 🚀 Token actions
router.post('/:id/vote', voteForToken);
router.post('/:id/boost', boostToken);
router.post('/:id/analytics', updateTokenAnalytics);

// ✨ Manage status from admin panel
router.post('/:id/featured', setFeatured);
router.post('/:id/trending', setTrending);
router.post('/:id/promoted', setPromoted);

// 📄 Get by ID or delete
router.get('/:id', getTokenById);
router.delete('/:id', deleteToken);

export default router;
