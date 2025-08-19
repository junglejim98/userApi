import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authJwt';
import { registerUser } from '../services/auth.service';
import {
  getUserByIdPublic,
  listUsersPublic,
  blockUser,
  unblockUser,
} from '../services/users.service';
import { HttpError } from '../utils/httpError';

export async function createByAdmin(req: AuthRequest, res: Response) {
  const { firstName, lastName, middleName, birthDate, email, password, role } = req.body;

  const roleName = (role || 'user').toString().trim().toLowerCase();
  if (!['user', 'admin'].includes(roleName)) {
    throw new HttpError(400, 'Роль должна быть user или admin');
  }
  if (!email || !password) {
    throw new HttpError(400, 'Email и пароль обязательны');
  }

  const user = await registerUser({
    firstName: String(firstName ?? '').trim(),
    lastName: String(lastName ?? '').trim(),
    middleName: middleName ? String(middleName).trim() : undefined,
    birthDate: new Date(birthDate),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    roleName,
  });

  return res.status(201).json(user);
}

export async function getById(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Некорректный ID');
  }
  const user = await getUserByIdPublic(id);
  res.json(user);
}

export async function list(req: AuthRequest, res: Response) {
  const limit = Number(req.query.limit ?? 10);
  const offset = Number(req.query.offset ?? 0);
  const role = typeof req.query.role === 'string' ? req.query.role : undefined;
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  res.json(await listUsersPublic({ limit, offset, role, status, q }));
}

export async function block(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Некорректный ID');
  }
  res.json(await blockUser(id));
}

export async function unblock(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Некорректный ID');
  }
  res.json(await unblockUser(id));
}
