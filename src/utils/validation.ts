interface RegisterBody {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  email: string;
  password: string;
  roleName?: string;
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
  const s = v.trim().toLocaleLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isPassword(v: unknown): v is string {
  return typeof v === 'string' && v.length >= 8 && v.length <= 72;
}

export function pickRegisterBody(body: RegisterBody) {
  const errors: { path: string; message: string }[] = [];

  if (!isNonEmptyString(body.firstName))
    errors.push({ path: 'firstName', message: 'Обязательное поле' });
  if (!isNonEmptyString(body.lastName))
    errors.push({ path: 'lastName', message: 'Обязательно поле' });

  let middleName: string | undefined = undefined;

  if (typeof body.middleName === 'string' && body.middleName.trim() !== '') {
    if (!isNonEmptyString(body.middleName))
      errors.push({ path: 'middleName', message: 'Некорректное значение' });
    else middleName = body.middleName.trim();
  }

  const birthDate = toPastDate(body.birthDate);
  if (!birthDate) errors.push({ path: 'birthDate', message: 'Дата должна быть в прошлом' });

  if (!isEmail(body.email)) errors.push({ path: 'email', message: 'Некорректный email' });
  const email = String(body.email).trim().toLowerCase();

  if (!isPassword(body.password)) errors.push({ path: 'password', message: 'Минимум 8 символов' });

  if (errors.length) {
    const err = new Error('Ошибка валидации') as Error & {
      status?: number;
      payload?: unknown;
    };
    err.status = 400;
    err.payload = { message: err.message, errors };
    throw err;
  }

  return {
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    middleName,
    birthDate: birthDate!,
    email,
    password: body.password as string,
    roleName: body.roleName ? String(body.roleName).trim().toLowerCase() : undefined,
  };
}
