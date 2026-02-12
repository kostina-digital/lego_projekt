import { Request, Response } from 'express';
import { logger } from '../../utils/logger.js';
import { getStatsByYear, getStatsByTheme, getOverview, getPartsDistribution } from './stats.service.js';

export async function setsByYear(_req: Request, res: Response) {
  try {
    const data = await getStatsByYear();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching year statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}

export async function setsByTheme(_req: Request, res: Response) {
  try {
    const data = await getStatsByTheme();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching theme statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}

export async function overview(_req: Request, res: Response) {
  try {
    const data = await getOverview();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching overview statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}

export async function partsDist(_req: Request, res: Response) {
  try {
    const data = await getPartsDistribution();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching parts distribution:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}
