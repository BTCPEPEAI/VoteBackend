// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import tokenRoutes from './routes/tokenRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { trackTraffic } from './middlewares/trackTraffic.js';

dotenv.config();
const app = express();

// ✅ Ensure 'uploads/' folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("✅ Created 'uploads' folder");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(trackTraffic); // traffic analytics middleware

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
