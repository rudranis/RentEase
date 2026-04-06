import express from 'express';
import auth from '../middleware/auth.js';
import {
    sendMessage,
    getConversations,
    getConversationMessages,
    markAsRead,
    deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/send', auth, sendMessage);
router.get('/conversations', auth, getConversations);
router.get('/conversation/:conversationId', auth, getConversationMessages);
router.put('/read/:conversationId', auth, markAsRead);
router.delete('/:id', auth, deleteMessage);

export default router;
