import express from 'express';
import authRoutes from './routes/auth.routes';
import type { Request, Response, NextFunction } from 'express';

export const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
