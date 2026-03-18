import express from "express";
import {getUser, getUsers, deleteUser } from '../controllers/user'
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.use(requireAuth);
router.get("/:email", getUser);

router.get("/", getUsers);

router.delete("/:id", deleteUser);

export default router;
