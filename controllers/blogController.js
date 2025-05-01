// controllers/blogController.js
import Blog from '../models/Blog.js';

// Create a blog post (admin only)
export const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.filename : null;

    const blog = new Blog({
      title,
      content,
      image,
      author
    });

    await blog.save();
    res.status(201).json({ message: 'Blog post created.', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
};

// Get all blog posts
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
};

// Get a single blog post
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog.' });
  }
};

export const updateNewsAnalytics = async (req, res) => {
  const { type, timeSpent = 0 } = req.body;
  const token = await Token.findById(req.params.id);
  if (!token) return res.status(404).json({ error: 'Token not found' });

  switch (type) {
    case 'view':
      token.analytics.views += 1;
      break;
    case 'impression':
      token.analytics.impressions += 1;
      break;
    case 'share':
      token.analytics.shares += 1;
      break;
    case 'time':
      token.analytics.avgTimeSpent = (
        (token.analytics.avgTimeSpent * token.analytics.views + timeSpent) /
        (token.analytics.views + 1)
      );
      break;
    default:
      return res.status(400).json({ error: 'Invalid analytics type' });
  }

  await token.save();
  res.json({ success: true });
};
