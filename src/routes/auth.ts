import express from "express";
import { login, register } from '../controllers/auth'
import { logout, me } from "../controllers/auth-session";

const router = express.Router();

router.post("/login", login)
router.post("/register", register)
router.get("/me", me)
router.post("/logout", logout)

export default router
