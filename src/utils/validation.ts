import { HttpError } from './httpError.js';

interface RegisterBody {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  email: string;
  password: string;
}

export function isNonEmptyString(v: unknown, max = 100): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

export function toPastDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  if (d >= now) return null;
  return d;
}

export function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const s = v.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isPassword(v: unknown): v is string {
  return typeof v === 'string' && v.length >= 8 && v.length <= 72;
}

export function allBodyData(body: RegisterBody) {
  if (!isNonEmptyString(body.firstName)) throw new HttpError(400, 'Имя - Обязательное поле');
  if (!isNonEmptyString(body.lastName)) throw new HttpError(400, 'Фамилия - Обязательное поле');

  let middleName: string | undefined = undefined;

  if (typeof body.middleName === 'string' && body.middleName.trim() !== '') {
    if (!isNonEmptyString(body.middleName)) throw new HttpError(400, 'Некорректное значение');
    else middleName = body.middleName.trim();
  }

  const birthDate = toPastDate(body.birthDate);
  if (!birthDate) throw new HttpError(400, 'Дата должна быть в прошлом');

  if (!isEmail(body.email)) throw new HttpError(400, 'Некорректный email');
  const email = String(body.email).trim().toLowerCase();

  if (!isPassword(body.password)) throw new HttpError(400, 'Минимальная длина пароля 8 символов');

  return {
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    middleName,
    birthDate: birthDate!,
    email,
    password: body.password.trim(),
  };
}
