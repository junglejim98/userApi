import { Router } from 'express';
import { authJwt } from '../middlewares/authJwt';
import { requireAdmin } from '../middlewares/requireAdmin';
import { requireSelfOrAdmin } from '../middlewares/requireSelfOrAdmin';
import { createByAdmin, getById, list, block, unblock } from '../controllers/users.controller';

const router = Router();
router.post('/', authJwt,  requireAdmin, createByAdmin);

router.get('/:id', authJwt,  requireSelfOrAdmin, getById);

router.get('/', authJwt,  requireAdmin, list);

router.patch('/:id/block', authJwt,  requireSelfOrAdmin, block);
router.patch('/:id/unblock', authJwt,  requireAdmin, unblock);

export default router;
