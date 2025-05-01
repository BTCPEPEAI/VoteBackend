import ChatMessage from '../models/ChatMessage.js';

// User sends a message
export const sendMessage = async (req, res) => {
  try {
    const newMsg = new ChatMessage({
      ip: req.ip,
      message: req.body.message,
      sender: 'user'
    });
    await newMsg.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Admin sends a reply
export const sendAdminReply = async (req, res) => {
  try {
    const newMsg = new ChatMessage({
      ip: req.body.ip,
      message: req.body.message,
      sender: 'admin'
    });
    await newMsg.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

// Admin gets chat by IP
export const getChatByIP = async (req, res) => {
  try {
    const chat = await ChatMessage.find({ ip: req.params.ip }).sort({ createdAt: 1 });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

// Admin gets list of all user IPs who messaged
export const getAllChatsGroupedByIP = async (req, res) => {
  try {
    const chats = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$ip',
          lastMessage: { $last: '$message' },
          lastTime: { $last: '$createdAt' }
        }
      },
      { $sort: { lastTime: -1 } }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat list' });
  }
};
