import { logger } from '../../utils/logger.js';
import {
  listUserCollection,
  setExists,
  upsertCollectionItem,
  deleteCollectionItem,
  findCollectionItem,
} from './collections.repo.js';

export async function getUserCollection(userId: number) {
  return listUserCollection(userId);
}

export async function addToCollection(userId: number, username: string | undefined, setNum: string, notes?: string) {
  const exists = await setExists(setNum);
  if (!exists) {
    throw new Error('Set not found');
  }
  const item = await upsertCollectionItem(userId, setNum, notes);
  logger.info(`User ${username} added set ${setNum} to collection`);
  return item;
}

export async function removeFromCollection(userId: number, username: string | undefined, setNum: string) {
  const removed = await deleteCollectionItem(userId, setNum);
  if (!removed) {
    throw new Error('Set not in collection');
  }
  logger.info(`User ${username} removed set ${setNum} from collection`);
  return removed;
}

export async function checkCollection(userId: number, setNum: string) {
  const item = await findCollectionItem(userId, setNum);
  return {
    inCollection: !!item,
    item: item || null,
  };
}
