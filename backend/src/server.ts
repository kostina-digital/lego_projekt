import app from './app.js';
import { PORT, NODE_ENV } from './utils/env.js';
import { logger } from './utils/logger.js';
import { pool } from './database/pool.js';

const server = app.listen(PORT, () => {
  logger.info(`🚀 LEGO Set Explorer API running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, closing server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
