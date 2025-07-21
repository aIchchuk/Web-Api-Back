import { Router } from "express";
import { getStat } from "../controller/stat.controller.js";
import { authenticateUser, checkAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// GET /stats - Admin only
router.get("/", authenticateUser, checkAdmin, (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}, getStat);

export default router;
