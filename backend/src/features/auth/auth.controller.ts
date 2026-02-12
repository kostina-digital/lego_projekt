import { Request, Response } from 'express';
import { COOKIE_NAME, SESSION_DAYS, FRONTEND_URL, NODE_ENV } from '../../utils/env.js';
import { logger } from '../../utils/logger.js';
import { AuthRequest } from './auth.middleware.js';
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  getAllUsers,
} from './auth.service.js';

const isProduction = NODE_ENV === 'production';
const isHttps = FRONTEND_URL.startsWith('https://');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isHttps,
  maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  path: '/',
};

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Username, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const { user, token } = await registerService({ username, email, password });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    logger.info(`User registered: ${username}`);
    return res.status(201).json({ success: true, data: { user } });
  } catch (error: any) {
    const message = error?.message || 'Failed to register user';
    const status = message.includes('exists') ? 400 : 500;
    logger.error('Error registering user:', error);
    return res.status(status).json({ success: false, error: message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const { user, token } = await loginService({ username, password });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    logger.info(`User logged in: ${username}`);
    return res.json({ success: true, data: { user } });
  } catch (error: any) {
    const message = error?.message || 'Failed to log in';
    const status = message.includes('Invalid') ? 401 : 500;
    logger.error('Error logging in:', error);
    return res.status(status).json({ success: false, error: message });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const user = await getCurrentUser(req.userId!);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error getting user:', error);
    return res.status(500).json({ success: false, error: 'Failed to get user' });
  }
}

export async function listUsers(req: AuthRequest, res: Response) {
  if (isProduction) {
    return res.status(403).json({ success: false, error: 'Endpoint disabled in production' });
  }
  try {
    const users = await getAllUsers();
    return res.json({ success: true, data: users });
  } catch (error) {
    logger.error('Error listing users:', error);
    return res.status(500).json({ success: false, error: 'Failed to list users' });
  }
}

export async function logout(req: AuthRequest, res: Response) {
  const rawCookie = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    rawCookie.split(';').map((pair) => {
      const [key, ...rest] = pair.split('=');
      return [key.trim(), decodeURIComponent(rest.join('='))];
    })
  );
  const token = cookies[COOKIE_NAME];

  await logoutService(token);

  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.setHeader('Clear-Site-Data', '"cache","cookies"');

  return res.json({ success: true, message: 'Logged out successfully' });
}

export const authCookieOptions = cookieOptions;
