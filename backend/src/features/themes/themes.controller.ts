import { Request, Response } from 'express';
import { logger } from '../../utils/logger.js';
import { getThemes, getThemeWithSets } from './themes.service.js';

export async function listThemes(_req: Request, res: Response) {
  try {
    const data = await getThemes();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching themes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch themes' });
  }
}

export async function getTheme(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await getThemeWithSets(id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error fetching theme details:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch theme details' });
  }
}
