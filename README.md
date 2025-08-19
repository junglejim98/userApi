User Service

Сервис работы с пользователями на Express + TypeScript + Prisma (SQLite).
Реализованы эндпоинты из ТЗ: регистрация, авторизация, получение пользователя, список пользователей, блокировка/разблокировка.

***

Запуск проекта

1. Установить зависимости

npm install

2. Создать базу, выполнить миграции, заполнить справочники и создать администратора

npx prisma migrate dev --name init

3. Запуск сервера

npm run dev

Сервер будет доступен по адресу:
http://localhost:3000

***

Переменные окружения (.env)

# Prisma DB URL (SQLite по умолчанию)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="change-me"

# Данные для seed-скрипта (создание первого администратора)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123ADMIN"


***

Основные эндпоинты
 • POST /api/auth/register — регистрация пользователя
 • POST /api/auth/login — авторизация, возвращает JWT
 • GET /api/users/:id — получить пользователя (сам себя или админ)
 • GET /api/users — список пользователей (только админ)
 • PATCH /api/users/:id/block — блокировка (сам себя или админ)
 • PATCH /api/users/:id/unblock — разблокировка (только админ)

***

Проверка вручную

В проекте есть файл api.http (формат VSCode REST Client).
В нём примеры последовательных запросов:
 1. Регистрация
 2. Авторизация
 3. Получение себя
 4. Список пользователей
 5. Блокировка/разблокировка

***

Структура проекта

.
├── prisma/
│   ├── schema.prisma      # описание моделей
│   └── seed.ts            # создание ролей, статусов, админа
├── src/
│   ├── controllers/       # логика роутов
│   ├── middlewares/       # requireAdmin, authJwt и др.
│   ├── routes/            # /auth, /users
│   ├── utils/             # HttpError, валидаторы
│   └── app.ts             # точка входа
├── api.http               # тестовые запросы
├── package.json
└── README.md


***
