import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/authJwt';
import { registerUser } from '../services/auth.service';

export async function createByAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const roleName =
      typeof req.body.roleName === 'string'
        ? req.body.roleName.trim().toLowerCase()
        : typeof req.body.role === 'string'
        ? req.body.role.trim().toLowerCase()
        : 'user';

    const user = await registerUser({
      firstName: String(req.body.firstName ?? '').trim(),
      lastName: String(req.body.lastName ?? '').trim(),
      middleName: typeof req.body.middleName === 'string' ? req.body.middleName : undefined,
      birthDate: new Date(req.body.birthDate),
      email: String(req.body.email ?? '').trim().toLowerCase(),
      password: String(req.body.password ?? ''),
      roleName,
    });

    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}