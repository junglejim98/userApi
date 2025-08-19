# User Service

Сервис работы с пользователями на Express + TypeScript + Prisma (SQLite).
Реализованы эндпоинты из ТЗ: регистрация, авторизация, получение пользователя, список пользователей, блокировка/разблокировка.

***

## Запуск проекта

1. Установить зависимости

`npm install`

2. Создать базу, выполнить миграции, заполнить справочники и создать администратора

`npx prisma migrate dev --name init`

3. Запуск сервера

`npm run dev`

Сервер будет доступен по адресу:
http://localhost:3000

***

## Переменные окружения (`.env`)
```bash
# Prisma DB URL (SQLite по умолчанию)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="change-me"

# Данные для seed-скрипта (создание первого администратора)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123ADMIN"
```

***

## Основные эндпоинты
 - POST /api/auth/register — регистрация пользователя
 - POST /api/auth/login — авторизация, возвращает JWT
 - GET /api/users/:id — получить пользователя (сам себя или админ)
 - GET /api/users — список пользователей (только админ)
 - PATCH /api/users/:id/block — блокировка (сам себя или админ)
 - PATCH /api/users/:id/unblock — разблокировка (только админ)

***

## Проверка вручную

В проекте есть файл api.http (формат VSCode REST Client).
В нём примеры последовательных запросов:
 1. Регистрация
 2. Авторизация
 3. Получение себя
 4. Список пользователей
 5. Блокировка/разблокировка

***

## Структура проекта
```bash
.
├── prisma/
│   ├── migrations/               # миграции Prisma (генерируются)
│   └── schema.prisma             # схема БД (User/Role/Status и пр.)
├── src/
│   ├── app.ts                    # инициализация Express, роуты, error handler
│   ├── server.ts                 # запуск сервера (listen)
│   ├── db/
│   │   └── prisma.ts             # PrismaClient
│   ├── controllers/
│   │   ├── auth.controller.ts    # register/login
│   │   └── users.controller.ts   # createByAdmin/getById/list/block/unblock
│   ├── middlewares/
│   │   ├── authJwt.ts            # проверка Bearer JWT → req.user
│   │   ├── requireAdmin.ts       # доступ только admin
│   │   └── requireSelfOrAdmin.ts # доступ сам/админ
│   ├── routes/
│   │   ├── auth.routes.ts        # /api/auth (register, login)
│   │   └── users.routes.ts       # /api/users (CRUD/блокировки)
│   ├── services/
│   │   ├── auth.service.ts       # registerUser/verifyCredentials
│   │   └── users.service.ts      # list/get/block/unblock
│   └── utils/
│       ├── httpError.ts          # HttpError(status, message)
│       ├── userType.ts           # PublicUser + toPublicUser()
│       ├── validation.ts         # allBodyData()/isEmail()/toPastDate()
│       └── seed.ts               # сиды ролей/статусов/админа (если лежит в src)
└── api.http                      # сценарии ручной проверки (REST Client)                      
```

***
