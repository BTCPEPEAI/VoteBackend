// routes/blogRoutes.js
import express from 'express';
import { createBlog, getAllBlogs, getBlogById, updateNewsAnalytics } from '../controllers/blogController.js';
import upload from '../config/multer.js';

const router = express.Router();

// Create blog (admin)
router.post('/create', upload.single('image'), createBlog);

// Get all blogs
router.get('/all', getAllBlogs);

// Get single blog
router.get('/:id', getBlogById);
router.post('/:id/analytics', updateNewsAnalytics);


export default router;
