import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authJwt';

export function requireSelfOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const paramId = Number(req.params.id);
  if (Number.isNaN(paramId)) return res.status(400).json({ message: 'Некорректный id' });
  if (req.user?.role === 'admin' || req.user?.id === paramId) return next();
  return res.status(403).json({ message: 'Доступ запрещён' });
}
