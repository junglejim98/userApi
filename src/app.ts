import express from 'express';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import type { Request, Response, NextFunction } from 'express';

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.send('ok'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use('/api/auth', authRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
