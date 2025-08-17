import type { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number; role: 'admin' | 'user' };
}

type AccessTokenPayload = JwtPayload & {
  role: 'admin' | 'user';
  sub: string; // sub строка по типам jsonwebtoken
};

export function authJwt(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded !== 'object' || decoded === null) {
      return res.status(401).json({ message: 'Неверный или истекший токен' });
    }

    const payload = decoded as AccessTokenPayload;
    if (!payload.sub || (payload.role !== 'admin' && payload.role !== 'user')) {
      return res.status(401).json({ message: 'Неверный или истекший токен' });
    }

    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный или истекший токен' });
  }
}