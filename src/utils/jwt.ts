import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "";

export function generateToken(payload: object, _expireTime: string = "7d"): string {
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
