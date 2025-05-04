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

const router = express.Router();

// ✅ Search tokens by query
router.get('/search', searchTokens);

// ✅ Submit new token
router.post('/submit', upload.single('logo'), addToken);

// ✅ Fetch all tokens
router.get('/all', getAllTokens);

// ✅ Fetch tokens by query param status (e.g. ?status=featured)
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
        res.status(500).json({ error: 'Failed to fetch tokens by status.' });
    }
});

// ✅ Explicit routes required by frontend
router.get('/featured', getFeaturedTokens);
router.get('/trending', getTrendingTokens);
router.get('/promoted', getPromotedTokens);

// ✅ Admin panel related
router.get('/admin/list', getAdminTokens);

// ✅ Homepage tokens
router.get('/homepage', getHomepageTokens);

// ✅ Voting
router.post('/:id/vote', voteForToken);

// ✅ Boost
router.post('/:id/boost', boostToken);

// ✅ Analytics
router.post('/:id/analytics', updateTokenAnalytics);

// ✅ Toggle featured/trending/promoted status
router.post('/:id/featured', setFeatured);
router.post('/:id/trending', setTrending);
router.post('/:id/promoted', setPromoted);

// ✅ Get token by ID and delete token
router.get('/:id', getTokenById);
router.delete('/:id', deleteToken);

export default router;
