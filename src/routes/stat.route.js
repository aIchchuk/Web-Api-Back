import { Router } from "express";
import { getStat } from "../controller/stat.controller.js";
import { verifyToken, checkAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Admin-only stats route protected by JWT and admin check
router.get("/", verifyToken, checkAdmin, getStat);

export default router;
