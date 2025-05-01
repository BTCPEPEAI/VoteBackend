import express from 'express';
import { subscribe, getSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/subscribe', subscribe);               // Public
router.get('/admin/all', getSubscribers);           // Admin
router.delete('/admin/delete/:id', deleteSubscriber); // Admin optional

export default router;
