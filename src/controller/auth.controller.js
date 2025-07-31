import { User } from "../model/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const user = req.user;
    const isAdmin = req.isAdmin;

    const payload = {
      userId: user._id || null,
      email: user.email,
      isAdmin: isAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: payload.email,
        isAdmin: payload.isAdmin,
        ...(user._id && { id: user._id, fullName: user.fullName }) // Only DB users have _id and fullName
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login error', error });
  }
};
