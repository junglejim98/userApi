import express from 'express';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from './utils/httpError.js';
import { Prisma } from '@prisma/client';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET не задан, для работы программы токен обязателен.');
}

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
});

const has = <K extends string>(o: unknown, k: K): o is Record<K, unknown> =>
  typeof o === 'object' && o !== null && k in o;

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && has(err, 'status')) {
    return res.status(400).json({ message: 'Некорректный JSON в запросе' });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Запись с такими данными уже существует' });
    }
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (has(err, 'status')) {
    const status = typeof err.status === 'number' ? err.status : 500;
    const payload = has(err, 'payload')
      ? err.payload
      : {
          message: has(err, 'message') && typeof err.message === 'string' ? err.message : 'Ошибка',
        };
    return res.status(status).json(payload);
  }

  console.error(err);
  return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
