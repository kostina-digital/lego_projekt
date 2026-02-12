import { Router } from 'express';
import { authMiddleware } from './auth.middleware.js';
import { login, register, me, listUsers, logout } from './auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.get('/users', authMiddleware, listUsers);
router.post('/logout', authMiddleware, logout);

export default router;
