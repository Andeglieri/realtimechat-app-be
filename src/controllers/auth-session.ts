import { Request, Response } from "express";
import prisma from "../config/db";
import { clearAuthCookie } from "../utils/cookies";
import { getAuthenticatedUserId } from "../utils/auth";

export const me = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req.headers.cookie);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "User not found for current session." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load authenticated user.", message: error });
  }
};

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully." });
};
