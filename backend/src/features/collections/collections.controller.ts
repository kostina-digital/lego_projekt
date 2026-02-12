import { Response } from 'express';
import { AuthRequest } from '../auth/auth.middleware.js';
import { getUserCollection, addToCollection, removeFromCollection, checkCollection } from './collections.service.js';

export async function listCollection(req: AuthRequest, res: Response) {
  try {
    const data = await getUserCollection(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch collection' });
  }
}

export async function addCollectionItem(req: AuthRequest, res: Response) {
  try {
    const { setNum, notes } = req.body;
    if (!setNum) {
      return res.status(400).json({ success: false, error: 'Set number is required' });
    }
    const item = await addToCollection(req.userId!, req.username, setNum, notes);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    const message = error?.message || 'Failed to add to collection';
    const status = message === 'Set not found' ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
}

export async function removeCollectionItem(req: AuthRequest, res: Response) {
  try {
    const { setNum } = req.params;
    const removed = await removeFromCollection(req.userId!, req.username, setNum);
    res.json({ success: true, message: 'Set removed from collection', data: removed });
  } catch (error: any) {
    const message = error?.message || 'Failed to remove from collection';
    const status = message === 'Set not in collection' ? 404 : 500;
    res.status(status).json({ success: false, error: message });
  }
}

export async function collectionStatus(req: AuthRequest, res: Response) {
  try {
    const { setNum } = req.params;
    const data = await checkCollection(req.userId!, setNum);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check collection' });
  }
}
