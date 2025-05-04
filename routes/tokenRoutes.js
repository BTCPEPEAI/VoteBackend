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

import Token from '../models/Token.js'; // ✅ Make sure this is imported

const router = express.Router();

router.get('/search', searchTokens); // 👈 must be before any `/:id` routes

router.post('/submit', upload.single('logo'), addToken);
router.get('/all', getAllTokens);

// ✅ ADDED: Support for ?status=featured|trending|promoted
router.get('/', async (req, res) => {
    const status = req.query.status;

    try {
        let filter = {};
        if (status === 'featured') filter.isFeatured = true;
        else if (status === 'trending') filter.isTrending = true;
        else if (status === 'promoted') filter.isPromoted = true;

        const tokens = await Token.find(filter).sort({ position: 1 });
        res.status(200).json(tokens);
    } catch (error) {
        console.error("Error fetching tokens by status:", error);
        res.status(500).json({ error: "Failed to fetch tokens" });
    }
});

router.post('/:id/vote', voteForToken);
router.get('/:id', getTokenById);

router.post('/:id/featured', setFeatured);
router.post('/:id/trending', setTrending);
router.post('/:id/promoted', setPromoted);

router.get('/admin/list', getAdminTokens);
router.get('/featured/list', getFeaturedTokens);
router.get('/trending/list', getTrendingTokens);
router.get('/promoted/list', getPromotedTokens);

router.get('/leaderboard', getLeaderboard);
router.get('/homepage', getHomepageTokens);
router.post('/:id/boost', boostToken);
router.post('/:id/analytics', updateTokenAnalytics);

router.delete('/:id', deleteToken);

export default router;
