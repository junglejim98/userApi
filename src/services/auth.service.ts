import bcrypt from 'bcryptjs';
import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import type { User, Role, Status } from '@prisma/client';
import { HttpError } from '../utils/httpError';

export type UserWithRs = User & { role: Role; status: Status };

type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  email: string;
  role: string;
  status: string;
};

function toPublicUser(u: User & { role: Role; status: Status }): PublicUser {
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    middleName: u.middle_name ?? undefined,
    birthDate: u.birth_date.toISOString().slice(0, 10),
    email: u.email,
    role: u.role.role_name,
    status: u.status.status_name,
  };
}

export async function registerUser(input: {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  roleName?: string;
}): Promise<PublicUser> {
  const roleName = input.roleName ?? 'user';
  const roleUser = await prisma.role.findUnique({ where: { role_name: roleName } });
  const statusActive = await prisma.status.findUnique({ where: { status_name: 'active' } });

  if (!roleUser || !statusActive) {
    const e = new Error('Справочник ролей/ статусов не инициализированы') as Error & {
      status: number;
    };
    e.status = 500;
    throw e;
  }

  const password_hash = await bcrypt.hash(input.password, 10);

  try {
    const created = await prisma.user.create({
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        middle_name: input.middleName ?? null,
        birth_date: input.birthDate,
        email: input.email,
        password_hash,
        role_id: roleUser.id,
        status_id: statusActive.id,
      },
      include: { role: true, status: true },
    });

    return toPublicUser(created);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        const e = new Error('Пользователь с таким email уже существует') as Error & {
          status?: number;
        };
        e.status = 409;
        throw e;
      }
    }
    throw err;
  }
}

export async function verifyCredentials(email: string, password: string): Promise<UserWithRs> {
  const normalized = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    include: { role: true, status: true },
  });
  if (!user) throw new HttpError(401, 'Неверный email или пароль нет email');

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Неверный email или пароль нет pass');

  if (user.status.status_name !== 'active') {
    throw new HttpError(403, 'Пользователь заблокирован');
  }

  return user;
}
