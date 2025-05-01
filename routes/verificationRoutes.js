import express from 'express';
import {
  submitVerification,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/verificationController.js';

const router = express.Router();

router.post('/submit', submitVerification);
router.get('/admin/applications', getAllApplications);
router.patch('/admin/application/:id', updateApplicationStatus);

export default router;
