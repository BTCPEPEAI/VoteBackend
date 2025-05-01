import express from 'express';
import {
  sendMessage,
  sendAdminReply,
  getChatByIP,
  getAllChatsGroupedByIP
} from '../controllers/chatController.js';

const router = express.Router();

// User sends message
router.post('/send', sendMessage);

// Admin replies
router.post('/admin/reply', sendAdminReply);

// Admin views chat thread
router.get('/admin/chat/:ip', getChatByIP);

// Admin sees all active IP chats
router.get('/admin/chat-threads', getAllChatsGroupedByIP);

export default router;
