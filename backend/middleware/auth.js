import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log(`🔐 AUTH MIDDLEWARE: ❌ No token provided`);
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log(`🔐 AUTH MIDDLEWARE: Token found, verifying...`);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        console.log(`✅ Auth verified - User: ${req.userId}, Role: ${req.userRole}`);
        next();
    } catch (error) {
        console.log(`🔐 AUTH MIDDLEWARE: ❌ Invalid token - ${error.message}`);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const isOwner = (req, res, next) => {
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Only owners can access this' });
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Only admins can access this' });
    }
    next();
};

export default auth;
