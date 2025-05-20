import { parse } from 'cookie';
import { verifyToken } from './auth';

interface TokenPayload {
  userId: number;
  // Add other fields if your token includes more (e.g., email, iat, exp)
}

export function getUserIdOrThrow(req: Request): number {
  const rawCookie = req.headers.get('cookie') || '';
  console.log('[DEBUG] Raw Cookie:', rawCookie);

  if (!rawCookie) throw new Error('Unauthorized - no cookies sent');

  const parsedCookies = parse(rawCookie);
  const token = parsedCookies.token;
  console.log('[DEBUG] Parsed Token:', token);

  if (!token) throw new Error('Unauthorized - token missing');

  try {
    const payload = verifyToken(token) as TokenPayload;
    console.log('[DEBUG] Verified Token Payload:', payload);

    if (!payload.userId) {
      throw new Error('Unauthorized - userId missing in token payload');
    }

    return payload.userId;
  } catch (error) {
    console.error('[DEBUG] Token verification failed:', error);
    throw new Error('Unauthorized - invalid token');
  }
}
