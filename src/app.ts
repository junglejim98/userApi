import express from 'express';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from './utils/httpError';
import { Prisma } from '@prisma/client';

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({message: `Not found: ${req.method} ${req.originalUrl}` });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err && typeof err === 'object' && 'type' in err && (err as any).type === 'entity.parse.faild') {
    return res.status(400).json({ message: 'Некорретный JSON в запросе' });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err && typeof err === 'object' && 'status' in err) {
    const e = err as { status?: number; payload?: unknown; message?: string };
    return res.status(e.status ?? 500).json(e.payload ?? { message: e.message ?? 'Ошибка' });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Запись с такими данными уже существеут' });
    }
  }

  console.error(err);
  return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
