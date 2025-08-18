import prisma from '../db/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  await prisma.role.upsert({
    where: { role_name: 'admin' },
    update: {},
    create: { role_name: 'admin' },
  });
  await prisma.role.upsert({
    where: { role_name: 'user' },
    update: {},
    create: { role_name: 'user' },
  });

  await prisma.status.upsert({
    where: { status_name: 'active' },
    update: {},
    create: { status_name: 'active' },
  });
  await prisma.status.upsert({
    where: { status_name: 'blocked' },
    update: {},
    create: { status_name: 'blocked' },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail.toLowerCase().trim() },
    });
    if (!existing) {
      const adminRole = await prisma.role.findUnique({ where: { role_name: 'admin' } });
      const activeStatus = await prisma.status.findUnique({ where: { status_name: 'active' } });
      if (!adminRole || !activeStatus) throw new Error('Не инициализированы статусы и роли');

      const password_hash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          first_name: 'System',
          last_name: 'Admin',
          middle_name: null,
          birth_date: new Date('1990-01-01'),
          email: adminEmail.toLowerCase().trim(),
          password_hash,
          role_id: adminRole.id,
          status_id: activeStatus.id,
        },
      });
      console.warn('Админ создан:', adminEmail);
    } else {
      console.warn('Админ уже сущестует:', adminEmail);
    }
  } else {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD не заданы');
  }
}
main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
