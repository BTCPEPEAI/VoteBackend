import express from 'express';
import multer from 'multer';
import {
  addToken,
  getAllTokens,
  getTokenById,
  voteForToken,
  boostToken,
  getLeaderboard,
  searchTokens,
  deleteToken,
  addFeaturedToken,
  addTrendingToken,
  addPromotedToken,
  getHomepageTokens,
  updateTokenAnalytics
} from '../controllers/tokenController.js';

const router = express.Router();

// File upload config (temp storage, passed to Cloudinary later)
const storage = multer.diskStorage({});
const upload = multer({ storage });

/** --------------------
 *  TOKEN CRUD ROUTES
 --------------------- */
router.post('/add', upload.single('logo'), addToken);
router.get('/all', getAllTokens);
router.get('/:id', getTokenById);
router.delete('/:id', deleteToken);

/** --------------------
 *  VOTING & BOOSTING
 --------------------- */
router.post('/vote/:id', voteForToken);
router.post('/boost/:id', boostToken);

/** --------------------
 *  SPECIAL STATUSES
 --------------------- */
router.post('/feature/:id', addFeaturedToken);
router.post('/trending/:id', addTrendingToken);
router.post('/promote/:id', addPromotedToken);

/** --------------------
 *  SEARCH & LEADERBOARD
 --------------------- */
router.get('/search', searchTokens);
router.get('/leaderboard', getLeaderboard);

/** --------------------
 *  HOMEPAGE + ANALYTICS
 --------------------- */
router.get('/homepage', getHomepageTokens);
router.post('/analytics/:id', updateTokenAnalytics);

export default router;
