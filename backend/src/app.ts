import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { FRONTEND_URL, NODE_ENV } from './utils/env.js';
import { logger } from './utils/logger.js';
import { pool } from './database/pool.js';
import setsRouter from './features/sets/sets.routes.js';
import themesRouter from './features/themes/themes.routes.js';
import statsRouter from './features/stats/stats.routes.js';
import authRouter from './features/auth/auth.routes.js';
import collectionsRouter from './features/collections/collections.routes.js';
import { errorHandler } from './server.errors.js';

const app = express();

// Allow both Vite dev (5173) and Docker frontend (8080) in development so sign-in works from either
const corsOrigins = NODE_ENV === 'development'
  ? ['http://localhost:5173', 'http://localhost:8080']
  : FRONTEND_URL;

// Core middleware
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());
// Prevent cached authenticated pages from being restored via back/forward navigation
app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Simple request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health checks
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/db', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// API Routes
app.use('/api/sets', setsRouter);
app.use('/api/themes', themesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/auth', authRouter);
app.use('/api/collections', collectionsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
