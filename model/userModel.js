const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false, // users are not admin by default
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
