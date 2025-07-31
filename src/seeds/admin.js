import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js"
import dotenv from 

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const adminUser = new User({
    fullName: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    isAdmin: true,
  });

  await adminUser.save();
  console.log("Admin user created");
  process.exit(0);
}

createAdmin();
