import { Request, Response } from 'express';
import { logger } from '../../utils/logger.js';
import { getSetWithParts, listSetsWithMeta } from './sets.service.js';

export async function listSets(req: Request, res: Response) {
  try {
    const result = await listSetsWithMeta(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Error fetching sets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sets' });
  }
}

export async function getSet(req: Request, res: Response) {
  try {
    const { setNum } = req.params;
    const set = await getSetWithParts(setNum);
    if (!set) {
      return res.status(404).json({ success: false, error: 'Set not found' });
    }
    res.json({ success: true, data: set });
  } catch (error) {
    logger.error('Error fetching set details:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch set details' });
  }
}
