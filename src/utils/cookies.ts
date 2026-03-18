import { Request, Response } from "express";
import { AUTH_COOKIE_NAME, getTokenDurationMs } from "./jwt";
import { getCookieValueFromHeader } from "./auth";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getCookieSameSite(): "lax" | "none" {
  return isProduction() ? "none" : "lax";
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: getCookieSameSite(),
    maxAge: getTokenDurationMs(),
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: getCookieSameSite(),
    path: "/",
  });
}

export function getCookieValue(req: Request, name: string): string | null {
  return getCookieValueFromHeader(req.headers.cookie, name);
}
