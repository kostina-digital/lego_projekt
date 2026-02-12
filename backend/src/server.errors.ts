import { type ErrorRequestHandler } from 'express';
import { logger } from './utils/logger.js';

// Centralized error handler to return consistent JSON responses
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
};
