const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key from .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: email === 'admin@example.com', // You can customize this logic
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// Login user and return JWT
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin, // 👈 include admin status in token
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // 👈 return admin status
      },
    });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
