import express from 'express';
import {
  getTokenAnalytics,
  getNewsAnalytics,
  getAdsAnalytics
} from '../controllers/adminAnalyticsController.js';

const router = express.Router();

router.get('/analytics/tokens', getTokenAnalytics);
router.get('/analytics/news', getNewsAnalytics);
router.get('/analytics/ads', getAdsAnalytics);

export default router;
