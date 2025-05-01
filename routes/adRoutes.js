import express from 'express';
import { createAd, getAdsByPosition } from '../controllers/adController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/create', upload.single('file'), createAd);
router.get('/position/:position', getAdsByPosition);

export default router;
