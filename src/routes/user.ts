import express from "express";
import { registerUser,getUser, getUsers, deleteUser } from '../controllers/user'

const router = express.Router();

router.post("/", registerUser);

router.get("/:email", getUser);

router.get("/", getUsers);

router.delete("/:id", deleteUser);

export default router;
