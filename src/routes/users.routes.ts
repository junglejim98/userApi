import { Router } from 'express';
import { authJwt } from '../middlewares/authJwt';
import { requireAdmin } from '../middlewares/requireAdmin';
import { createByAdmin } from '../controllers/users.controller';

const router = Router();
router.post('/', authJwt, requireAdmin, createByAdmin);

export default router;
