import express from "express";
import {getUser, getUsers, deleteUser } from '../controllers/user'

const router = express.Router();

router.get("/:email", getUser);

router.get("/", getUsers);

router.delete("/:id", deleteUser);

export default router;
