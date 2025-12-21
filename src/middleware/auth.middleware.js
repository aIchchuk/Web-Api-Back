import { User } from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Middleware for login endpoint - verify credentials from req.body (email, password)
export const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Admin login check
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.user = { email: process.env.ADMIN_EMAIL, isAdmin: true };
      req.isAdmin = true;
      return next();
    }

    // User login check in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.user = user;
    req.isAdmin = false;
    next();

  } catch (error) {
    next(error);
  }
};

// Middleware for protecting routes after login - check JWT token from Authorization header
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to restrict access to admin only
export const checkAdmin = (req, res, next) => {
  if (req.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};
