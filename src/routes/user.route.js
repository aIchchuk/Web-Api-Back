import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controller/user.controller.js";

const router = Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", getUserById);

// ❗ Use PUT or PATCH for update
router.put("/updateUserById/:id", updateUserById);

// ❗ Use DELETE for delete
router.delete("/deleteUserById/:id", deleteUserById);

export default router;
