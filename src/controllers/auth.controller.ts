import type { Request, Response } from 'express';
import { allBodyData } from '../utils/validation';
import jwt from 'jsonwebtoken';
import { verifyCredentials, registerUser } from '../services/auth.service';
import { HttpError } from '../utils/httpError';

export async function register(req: Request, res: Response) {
  const data = allBodyData(req.body);
  const user = await registerUser({ ...data, roleName: undefined });
  return res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const email = String(req.body.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(req.body.password ?? '');

  if (!email || !password) {
    throw new HttpError(400, 'Email и/или пароль обязательны')
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
    expiresIn: '1h',
    user: {
      email: user.email,
    },
  });
}
