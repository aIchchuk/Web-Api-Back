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

export const login = (req, res) => {
  if (req.isAdmin) {
    const adminPayload = {
      id: 'admin',
      email: process.env.ADMIN_EMAIL,
      role: 'admin'
    };

    const token = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Admin Logged In',
      token,
      user: adminPayload
    });
  }

  const user = req.user;
  const payload = {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: 'user'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({
    message: 'User Successfully Logged In',
    token,
    user: payload
  });
};