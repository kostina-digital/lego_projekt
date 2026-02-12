import { Router } from 'express';
import { listThemes, getTheme } from './themes.controller.js';

const router = Router();

router.get('/', listThemes);
router.get('/:id', getTheme);

export default router;
