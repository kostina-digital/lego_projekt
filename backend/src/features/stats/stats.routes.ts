import { Router } from 'express';
import { setsByYear, setsByTheme, overview, partsDist } from './stats.controller.js';

const router = Router();

router.get('/sets-by-year', setsByYear);
router.get('/sets-by-theme', setsByTheme);
router.get('/overview', overview);
router.get('/parts-distribution', partsDist);

export default router;
