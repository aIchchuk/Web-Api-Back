import { Router } from "express";
import { getAllUsers, getUserById, updateUserById, deleteUserById } from "../controller/user.controller.js";

const router = Router();

router.get('/getAllUsers', getAllUsers);

router.get('/getUserById/:id', getUserById);

router.get('/updateUserById/:id', updateUserById);

router.get('/deleteUserById/:id', deleteUserById);

export default router