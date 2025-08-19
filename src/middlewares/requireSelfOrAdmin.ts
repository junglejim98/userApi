import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authJwt';
import { HttpError } from '../utils/httpError';

export function requireSelfOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const paramId = Number(req.params.id);
  if (Number.isNaN(paramId)) throw new HttpError(400, 'Некорректный id');
  if (req.user?.role === 'admin' || req.user?.id === paramId) return next();
  throw new HttpError(403, 'Доступ запрещен');
}
