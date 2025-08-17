import type { Request, Response, NextFunction } from 'express';
import { pickRegisterBody } from '../utils/validation';
import { registerUser } from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { verifyCredentials } from '../services/auth.service';

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

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const email = String(req.body.email ?? '')
      .trim()
      .toLocaleLowerCase();
    const password = String(req.body.password ?? '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await verifyCredentials(email, password);

    const token = jwt.sign(
      { sub: user.id, role: user.role.role_name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );

    return res.json({
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.role_name,
        status: user.status.status_name,
      },
    });
  } catch (err) {
    next(err);
  }
}
