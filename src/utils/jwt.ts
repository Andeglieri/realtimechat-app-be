import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "";
export const AUTH_COOKIE_NAME = "auth_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function generateToken(payload: object, _expireTime: string = JWT_EXPIRES_IN): string {
  const expireObj = { expiresIn: _expireTime as StringValue }
  return jwt.sign(payload, JWT_SECRET, expireObj );
}

export function verifyToken(token: string){
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenDurationMs(): number {
  const value = process.env.JWT_COOKIE_MAX_AGE_MS;

  if (value) {
    const parsed = Number(value);

    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 7 * 24 * 60 * 60 * 1000;
}
