import { User } from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User Successfully Registered',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const user = req.user || {}; // if not from DB, it's admin
    const isAdmin = req.isAdmin;

    const payload = {
      email: user.email || process.env.ADMIN_EMAIL,
      isAdmin: isAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: payload.email,
        isAdmin: payload.isAdmin,
        ...(user._id && { id: user._id, fullName: user.fullName }) // Only for DB users
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login error', error });
  }
};