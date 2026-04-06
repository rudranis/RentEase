import jwt from 'jsonwebtoken';

const userSocketMap = {};

export const socketHandler = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);
        userSocketMap[socket.userId] = socket.id;

        // Emit online users list
        io.emit('online_users', Object.keys(userSocketMap));

        // Join room for messaging
        socket.on('join_room', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.userId} joined room ${conversationId}`);
        });

        // Send message event
        socket.on('send_message', (data) => {
            const { conversationId, receiverId, content } = data;
            io.to(conversationId).emit('receive_message', {
                sender: socket.userId,
                receiver: receiverId,
                content,
                timestamp: new Date(),
            });
        });

        // Typing indicator
        socket.on('typing', (data) => {
            const { conversationId, senderName } = data;
            io.to(conversationId).emit('user_typing', {
                userId: socket.userId,
                senderName,
            });
        });

        // Stop typing
        socket.on('stop_typing', (conversationId) => {
            io.to(conversationId).emit('user_stop_typing', {
                userId: socket.userId,
            });
        });

        // Mark message as read
        socket.on('message_read', (data) => {
            const { conversationId, receiverId } = data;
            io.to(conversationId).emit('message_read_notification', {
                userId: socket.userId,
                timestamp: new Date(),
            });
        });

        // Send notification event
        socket.on('send_notification', (data) => {
            const { userId, type, message } = data;
            if (userSocketMap[userId]) {
                io.to(userSocketMap[userId]).emit('receive_notification', {
                    type,
                    message,
                    timestamp: new Date(),
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
            delete userSocketMap[socket.userId];
            io.emit('online_users', Object.keys(userSocketMap));
        });
    });
};

export default socketHandler;
