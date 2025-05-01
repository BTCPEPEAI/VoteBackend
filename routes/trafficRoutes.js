import express from 'express';
import { getTrafficByDate, getTrafficByCountry } from '../controllers/trafficController.js';

const router = express.Router();

router.get('/admin/stats/daily', getTrafficByDate);
router.get('/admin/stats/country', getTrafficByCountry);

export default router;
