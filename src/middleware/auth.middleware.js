import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt';

// ✅ Middleware: Check if request has valid user credentials
export const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.user = user;
      req.isAdmin = false;
      return next();
    }

    next(); // Proceed to checkAdmin
  } catch (error) {
    next(error);
  }
};

// ✅ Middleware: Check if credentials match admin from .env
export const checkAdmin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isAdmin =
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD;

    if (isAdmin) {
        req.isAdmin = true;
        return next();
    }

    // If not admin and no user set by authenticateUser, return unauthorized
    if (!req.user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    next();
  } catch (error) {
    next(error);
  }
};


