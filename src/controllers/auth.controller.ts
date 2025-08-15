import type { Request, Response, NextFunction } from 'express';
import { pickRegisterBody } from '../utils/validation';
import { registerUser } from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = pickRegisterBody(req.body);
    const user = await registerUser(dto);
    return res.status(201).json(user);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status?: number; payload?: unknown; message: string };
      return res.status(e.status ?? 500).json(e.payload ?? { message: e.message });
    }
    next(err);
  }
}
