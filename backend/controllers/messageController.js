import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, receiverId, listingId, content } = req.body;

        if (!conversationId || !receiverId || !content) {
            return res.status(400).json({ message: 'conversationId, receiverId, and content are required' });
        }

        if (!content.trim()) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(req.userId);

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        if (receiver._id.toString() === req.userId) {
            return res.status(400).json({ message: 'Cannot send message to yourself' });
        }

        const message = new Message({
            conversationId,
            sender: req.userId,
            receiver: receiverId,
            listing: listingId || null,
            content: content.trim(),
        });

        await message.save();
        await message.populate('sender', 'name avatar');

        // ✅ Emit socket event for real-time chat
        if (req.io) {
            req.io.to(conversationId).emit('receive_message', message);
        }

        // Send email notification (non-blocking)
        setImmediate(async () => {
            try {
                await sendEmail(receiver.email, 'newMessage', {
                    name: receiver.name,
                    senderName: sender.name,
                    listingTitle: 'a rental item',
                    messagePreview: content,
                });
            } catch (emailError) {
                console.error('Email notification failed:', emailError.message);
            }
        });

        res.status(201).json({
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // ✅ FIX: Cast req.userId string to ObjectId for MongoDB aggregation pipeline
        // Without this cast, $match won't find any documents because ObjectId !== string
        const userObjectId = new mongoose.Types.ObjectId(req.userId);

        const grouped = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userObjectId }, { receiver: userObjectId }],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessageDoc: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', userObjectId] },
                                        { $eq: ['$isRead', false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { 'lastMessageDoc.createdAt': -1 } },
            { $skip: skip },
            { $limit: Number(limit) },
        ]);

        const conversations = await Promise.all(
            grouped.map(async (item) => {
                const msg = item.lastMessageDoc;

                // Determine the other user ID
                const otherUserId =
                    msg.sender.toString() === req.userId
                        ? msg.receiver
                        : msg.sender;

                const otherUser = await User.findById(otherUserId).select('name avatar email _id');

                return {
                    // ✅ FIX: Return conversationId (not _id) - Chat.jsx uses conv.conversationId
                    conversationId: item._id,
                    otherUser,
                    lastMessage: msg.content,
                    lastMessageTime: msg.createdAt,
                    unreadCount: item.unreadCount,
                };
            })
        );

        res.status(200).json({
            // ✅ FIX: Return as 'conversations' key - Chat.jsx uses response.data.conversations
            conversations,
            pagination: {
                page: Number(page),
                limit: Number(limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ FIX: Accepts :conversationId param (route changed from /:userId/:listingId)
export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        if (!conversationId) {
            return res.status(400).json({ message: 'conversationId is required' });
        }

        const messages = await Message.find({ conversationId })
            .populate('sender', 'name avatar _id')
            .populate('receiver', 'name avatar _id')
            .skip(skip)
            .limit(Number(limit))
            .sort('createdAt');

        const total = await Message.countDocuments({ conversationId });

        // Mark messages sent to current user as read
        await Message.updateMany(
            { conversationId, receiver: req.userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            // ✅ FIX: Return as 'messages' key - Chat.jsx uses response.data.messages
            messages,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Message.updateMany(
            { conversationId, receiver: req.userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        await Message.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};