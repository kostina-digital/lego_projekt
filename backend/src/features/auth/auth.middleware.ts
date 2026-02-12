import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.js';
import { COOKIE_NAME } from '../../utils/env.js';
import { validateSession } from './auth.service.js';

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

const getTokenFromRequest = (req: Request): string | null => {
  const rawCookie = req.headers.cookie;
  if (rawCookie) {
    const cookies = Object.fromEntries(
      rawCookie.split(';').map((pair) => {
        const [key, ...rest] = pair.split('=');
        return [key.trim(), decodeURIComponent(rest.join('='))];
      })
    );
    if (cookies[COOKIE_NAME]) {
      return cookies[COOKIE_NAME];
    }
  }

  return null;
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ success: false, error: 'No session' });
    }

    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid' });
    }
    req.userId = session.user_id;
    req.username = session.username;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

// Optional auth middleware - doesn't fail if no token, but populates user if valid
export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return next();
    }

    const session = await validateSession(token);
    if (session) {
      req.userId = session.user_id;
      req.username = session.username;
    }
    next();
  } catch (error) {
    // Continue even if there's an error
    next();
  }
};
