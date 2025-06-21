const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const verifyAdmin = require('../middleware/verifyAdmin');  // import middleware

// Protect this route so only admin can get users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
