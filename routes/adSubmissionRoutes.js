import express from 'express';
import multer from 'multer';
import { submitAd, getAllAdSubmissions, updateAdStatus } from '../controllers/adSubmissionController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/ads/' });

// User ad submission
router.post('/submit', upload.single('file'), submitAd);

// Admin views submissions
router.get('/admin/all', getAllAdSubmissions);

// Admin approves/rejects ad
router.put('/admin/update-status/:id', updateAdStatus);

export default router;
