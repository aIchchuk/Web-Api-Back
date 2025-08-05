import { Router } from "express";
import { register, login } from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { fields } from "../middleware/upload.middleware.js";

const router = Router();


router.post(
  "/register",
  fields([{ name: "userImage", maxCount: 1 }]), // 👈 multer handles optional image
  register
);

// Login flow: first authenticateUser middleware, then login controller issues JWT
router.post('/login', authenticateUser, login);

export default router;
