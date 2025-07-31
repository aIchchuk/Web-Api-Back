import { User } from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Authenticate login credentials (email/password)
export const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Admin check from env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.user = { email, _id: 'admin' }; // fake id for admin
      req.isAdmin = true;
      return next();
    }

    // User login check in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid email or password' });

    req.user = user;
    req.isAdmin = false;
    next();
  } catch (error) {
    next(error);
  }
};

// Verify JWT token middleware for protected routes
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId, email, isAdmin
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin-only middleware
export const checkAdmin = (req, res, next) => {
  if (req.isAdmin) return next();
  return res.status(403).json({ message: "Access denied. Admins only." });
};

// Owner or Admin middleware for resource modification
export const isOwnerOrAdmin = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      if (!resource) return res.status(404).json({ message: 'Not found' });

      if (req.isAdmin) return next();

      if (resource.uploadedBy.toString() === req.user.userId) return next();

      return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
      next(error);
    }
  };
};
