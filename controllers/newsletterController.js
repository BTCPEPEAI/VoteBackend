import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// User subscribes to newsletter
export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed' });
    }

    const subscriber = new NewsletterSubscriber({ email });
    await subscriber.save();

    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};

// Admin gets all subscribed emails
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
};

// Optional: delete subscriber
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await NewsletterSubscriber.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
};
