import { Router } from "express";
import { register, login } from "../controller/auth.controller.js";
import { authenticateUser, checkAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', authenticateUser, checkAdmin, login);

export default router;
