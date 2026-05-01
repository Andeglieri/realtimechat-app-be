import { NextFunction, Request, Response } from "express";
import { clearAuthCookie } from "../utils/cookies";
import { getAuthenticatedUserId } from "../utils/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = getAuthenticatedUserId(req.headers.cookie);

  if (!userId) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Not authenticated." });
  }

  res.locals.authUserId = userId;
  next();
}
