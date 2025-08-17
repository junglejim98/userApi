import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authJwt';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Доступ запрещён' });
  next();
}