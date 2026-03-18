import { AUTH_COOKIE_NAME, verifyToken } from "./jwt";

interface JwtPayload {
  id?: string;
}

export function getCookieValueFromHeader(rawCookies: string | undefined, name: string): string | null {
  if (!rawCookies) {
    return null;
  }

  const cookies = rawCookies.split(";").map((entry) => entry.trim());

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = cookie.slice(0, separatorIndex);
    const value = cookie.slice(separatorIndex + 1);

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export function getAuthenticatedUserId(rawCookies: string | undefined): string | null {
  const token = getCookieValueFromHeader(rawCookies, AUTH_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token) as JwtPayload | null;
  return decoded?.id ?? null;
}
