import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware.js';
import { addCollectionItem, collectionStatus, listCollection, removeCollectionItem } from './collections.controller.js';

const router = Router();

// All collection routes require authentication
router.use(authMiddleware);

router.get('/', listCollection);
router.post('/', addCollectionItem);
router.delete('/:setNum', removeCollectionItem);
router.get('/:setNum', collectionStatus);

export default router;
