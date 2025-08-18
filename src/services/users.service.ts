import prisma from '../db/prisma';
import type { Prisma } from '@prisma/client';
import { HttpError } from '../utils/httpError';
import type { PublicUser } from '../utils/userType';
import { toPublicUser } from '../utils/userType';

export async function getUserByIdPublic(id: number): Promise<PublicUser> {
  const u = await prisma.user.findUnique({ where: { id }, include: { role: true, status: true } });
  if (!u) throw new HttpError(404, 'Пользователь не найден');
  return toPublicUser(u);
}

export async function listUsersPublic(params: {
  limit?: number;
  offset?: number;
  role?: string;
  status?: string;
  q?: string;
}) {
  const { limit = 20, offset = 0, role, status, q } = params;

  const and: Prisma.UserWhereInput[] = [];

  if (role) {
    and.push({ role: { is: { role_name: role } } });
  }
  if (status) {
    and.push({ status: { is: { status_name: status } } });
  }
  if (q && q.trim() !== '') {
    and.push({
      OR: [
        { first_name: { contains: q } },
        { last_name: { contains: q } },
        { email: { contains: q } },
      ],
    });
  }

  const where: Prisma.UserWhereInput = and.length ? { AND: and } : {};

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: { role: true, status: true },
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { total, limit, offset, items: items.map(toPublicUser) };
}

export async function blockUser(id: number) {
  const blocked = await prisma.status.findUnique({ where: { status_name: 'blocked' } });
  if (!blocked) throw new HttpError(500, 'Статус не инициализирован');

  const user = await prisma.user.update({
    where: { id },
    data: { status_id: blocked.id },
    include: { role: true, status: true },
  });

  return toPublicUser(user);
}

export async function unblockUser(id: number) {
  const active = await prisma.status.findUnique({ where: { status_name: 'active' } });
  if (!active) throw new HttpError(500, 'Статус не инициализирован');

  const user = await prisma.user.update({
    where: { id },
    data: { status_id: active.id },
    include: { role: true, status: true },
  });

  return toPublicUser(user);
}
