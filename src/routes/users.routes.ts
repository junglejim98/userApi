import { Router } from 'express';
import { authJwt } from '../middlewares/authJwt.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { requireSelfOrAdmin } from '../middlewares/requireSelfOrAdmin.js';
import { createByAdmin, getById, list, block, unblock } from '../controllers/users.controller.js';

const router = Router();
router.post('/', authJwt, requireAdmin, createByAdmin);

router.get('/:id', authJwt, requireSelfOrAdmin, getById);

router.get('/', authJwt, requireAdmin, list);

router.patch('/:id/block', authJwt, requireSelfOrAdmin, block);
router.patch('/:id/unblock', authJwt, requireAdmin, unblock);

export default router;
