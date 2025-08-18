import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../utils/httpError';

export interface AuthRequest extends Request {
  user?: { id: number; role: 'admin' | 'user' };
}

type AccessTokenPayload = JwtPayload & {
  role: 'admin' | 'user';
  sub: string;
};

export function authJwt(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Нет токена');
  }

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded !== 'object' || decoded === null) {
      throw new HttpError(401, 'Неверный или истекший токен');
    }

    const payload = decoded as AccessTokenPayload;
    if (!payload.sub || (payload.role !== 'admin' && payload.role !== 'user')) {
      throw new HttpError(401, 'Неверный или истекший токен');
    }

    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    throw new HttpError(401, 'Неверный или истекший токен');
  }
}
