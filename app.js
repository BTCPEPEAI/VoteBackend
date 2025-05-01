// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tokenRoutes from './routes/tokenRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import { trackTraffic } from './middlewares/trackTraffic.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(trackTraffic); // Apply globally
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
