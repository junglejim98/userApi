import type { User, Role, Status } from '@prisma/client';

export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  email: string;
  role: string;
  status: string;
};

export function toPublicUser(u: User & { role: Role; status: Status }): PublicUser {
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
