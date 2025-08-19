import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authJwt.js';
import { HttpError } from '../utils/httpError.js';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') throw new HttpError(403, 'Доступ запрещен');
  next();
}
