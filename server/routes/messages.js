import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getOrCreateConversation, listConversations, sendMessage, listMessages } from '../controllers/chatController.js';

const router = express.Router();

// Conversations
router.post('/conversations', userAuth, getOrCreateConversation);
router.get('/conversations', userAuth, listConversations);

// Messages
router.post('/', userAuth, sendMessage);
router.get('/:conversationId', userAuth, listMessages);

export default router;
