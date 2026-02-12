import { Router } from 'express';
import { listSets, getSet } from './sets.controller.js';

const router = Router();

router.get('/', listSets);
router.get('/:setNum', getSet);

export default router;
