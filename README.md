# Express App

REST API для управления пользователями, построенный на **Node.js + Express + TypeScript + Prisma + PostgreSQL**.

Проект создан как backend-практика с акцентом на **чистую архитектуру, валидацию данных, обработку ошибок, тестирование, Swagger-документацию и Docker**.

---

## Технологический стек

| Технология            | Назначение                           |
| --------------------- | ------------------------------------ |
| **Node.js 22**        | Среда выполнения JavaScript          |
| **TypeScript**        | Статическая типизация                |
| **Express 5**         | HTTP-сервер и REST API               |
| **Prisma 7**          | ORM                                  |
| **PostgreSQL 17**     | Реляционная база данных              |
| **Zod**               | Валидация входящих данных            |
| **Vitest**            | Тестирование                         |
| **Supertest**         | Тестирование HTTP API                |
| **Swagger / OpenAPI** | Документирование API                 |
| **Docker**            | Контейнеризация                      |
| **Docker Compose**    | Управление локальной инфраструктурой |

---

## Возможности

- CRUD-операции с пользователями
- Валидация запросов с помощью Zod
- Централизованная обработка ошибок
- Пользовательские ошибки приложения
- Обработка ошибок Prisma
- Защита от создания пользователей с дублирующимся email
- Пагинация
- Поиск пользователей по имени или email
- Сортировка пользователей
- Автоматические API-тесты
- Swagger / OpenAPI документация
- PostgreSQL в Docker
- Production Docker-образ с multi-stage build
- Проверка типов TypeScript
- Production-сборка

---

# API Endpoints

## Пользователи

| Метод    | Endpoint     | Описание                                   |
| -------- | ------------ | ------------------------------------------ |
| `GET`    | `/users`     | Получить список пользователей с пагинацией |
| `GET`    | `/users/:id` | Получить пользователя по ID                |
| `POST`   | `/users`     | Создать пользователя                       |
| `PATCH`  | `/users/:id` | Обновить пользователя                      |
| `DELETE` | `/users/:id` | Удалить пользователя                       |

---

# Примеры API

## Создание пользователя

### Запрос

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com"
}
```

### Ответ

```json
{
  "id": 1,
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com"
}
```

---

## Получение пользователей

```http
GET /users
```

### Пример ответа

```json
{
  "data": [
    {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex.johnson@example.com"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Пагинация

Endpoint пользователей поддерживает пагинацию:

```http
GET /users?page=1&limit=10
```

### Доступные параметры

| Параметр | Тип             | По умолчанию | Описание                             |
| -------- | --------------- | -----------: | ------------------------------------ |
| `page`   | integer         |          `1` | Номер страницы                       |
| `limit`  | integer         |         `10` | Количество пользователей на странице |
| `search` | string          |            — | Поиск по имени или email             |
| `sort`   | `name \| email` |       `name` | Поле для сортировки                  |
| `order`  | `asc \| desc`   |        `asc` | Направление сортировки               |

### Пример

```http
GET /users?page=2&limit=5&search=john&sort=email&order=desc
```

---

## Получение пользователя

```http
GET /users/1
```

---

## Обновление пользователя

### Запрос

```http
PATCH /users/1
Content-Type: application/json
```

```json
{
  "name": "Alex Updated"
}
```

---

## Удаление пользователя

```http
DELETE /users/1
```

### Успешный ответ

```http
204 No Content
```

---

# Валидация

Валидация входящих данных реализована с помощью **Zod**.

Основные правила валидации:

- `name` должен содержать минимум 2 символа
- `email` должен иметь корректный формат email
- параметры пагинации имеют минимальные и максимальные значения
- поля сортировки ограничены поддерживаемыми значениями
- направление сортировки ограничено значениями `asc` / `desc`

Некорректные запросы возвращают соответствующий ответ:

```http
400 Bad Request
```

---

# Обработка ошибок

Приложение использует **централизованную обработку ошибок** через `errorMiddleware`.

Ошибки приложения представлены классом `AppError`.

### Поддерживаемые коды ошибок

```text
USER_NOT_FOUND
EMAIL_EXISTS
VALIDATION_ERROR
INTERNAL_ERROR
```

Ошибки Prisma также обрабатываются централизованно.

| Ошибка             | HTTP Status | Значение                  |
| ------------------ | ----------: | ------------------------- |
| `P2025`            |       `404` | Пользователь не найден    |
| `P2002`            |       `409` | Email уже существует      |
| Ошибка валидации   |       `400` | Некорректный запрос       |
| Неизвестная ошибка |       `500` | Внутренняя ошибка сервера |

### Пример

```json
{
  "message": "User not found"
}
```

---

# Swagger / OpenAPI

API документируется с помощью **Swagger UI**.

После запуска приложения документация доступна по адресу:

**http://localhost:3000/api-docs**

Swagger предоставляет:

- список доступных endpoints
- параметры запросов
- тела запросов
- схемы ответов
- HTTP status codes
- возможность интерактивного тестирования API

---

# Тестирование

Для тестирования используются:

- **Vitest** — тестовый раннер
- **Supertest** — тестирование HTTP API
- отдельная PostgreSQL база данных для тестов

Покрыты следующие сценарии:

- создание пользователя
- предотвращение создания пользователя с дублирующимся email
- получение списка пользователей
- получение пользователя по ID
- обработка отсутствующего пользователя
- обновление пользователя
- удаление пользователя
- попытка удаления несуществующего пользователя

### Запуск тестов

```bash
npm test
```

### Однократный запуск тестов

```bash
npm test -- --run
```

---

# Проверка типов

Проверка типов TypeScript выполняется командой:

```bash
npm run typecheck
```

Также проект поддерживает production-сборку TypeScript:

```bash
npm run build
```

Скомпилированные файлы находятся в:

```text
dist/
```

---

# Переменные окружения

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_app"
```

Для тестовой базы данных:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/backend_practice_test"
```

**Не добавляйте `.env` и данные для подключения к базе данных в Git.**

---

# База данных

В качестве основной базы данных используется **PostgreSQL**.

Для взаимодействия с PostgreSQL используется **Prisma ORM**.

### Генерация Prisma Client

```bash
npx prisma generate
```

### Создание и применение миграции

```bash
npx prisma migrate dev
```

### Prisma Studio

Для просмотра и управления данными через Prisma Studio:

```bash
npx prisma studio
```

---

# Docker

Проект содержит:

- `Dockerfile`
- `docker-compose.yml`

Docker Compose запускает:

- PostgreSQL
- Express API

### Запуск приложения

```bash
docker compose up --build
```

### Запуск в фоновом режиме

```bash
docker compose up -d --build
```

### Проверка контейнеров

```bash
docker compose ps
```

### Логи API

```bash
docker compose logs api
```

### Логи PostgreSQL

```bash
docker compose logs postgres
```

### Остановка приложения

```bash
docker compose down
```

---

# Docker Architecture

Приложение использует **multi-stage Docker build**.

## Builder stage

На этапе сборки Docker:

1. устанавливает зависимости
2. копирует исходный код
3. генерирует Prisma Client
4. компилирует TypeScript
5. создаёт production-сборку приложения

## Production stage

Production-образ:

1. устанавливает только production-зависимости
2. копирует скомпилированное приложение
3. копирует Prisma Client
4. запускает Node.js приложение

Такой подход позволяет сделать production-образ компактнее и не включать development-зависимости в финальный runtime-образ.

---

# Локальная разработка

## 1. Установка зависимостей

```bash
npm install
```

## 2. Запуск PostgreSQL

```bash
docker compose up postgres -d
```

## 3. Применение Prisma migrations

```bash
npx prisma migrate dev
```

## 4. Запуск development-сервера

```bash
npm run dev
```

API будет доступен по адресу:

**http://localhost:3000**

Swagger-документация:

**http://localhost:3000/api-docs**

---

# NPM Scripts

| Команда             | Описание                   |
| ------------------- | -------------------------- |
| `npm run dev`       | Запуск development-сервера |
| `npm run build`     | Компиляция TypeScript      |
| `npm run start`     | Запуск production-сборки   |
| `npm run test`      | Запуск Vitest              |
| `npm run typecheck` | Проверка типов TypeScript  |
| `npm run lint`      | Запуск ESLint              |

---

# Архитектура

Приложение использует **слоистую архитектуру**:

```text
HTTP Request
     │
     ▼
   Router
     │
     ▼
 Middleware
     │
     ▼
 Controller
     │
     ▼
  Service
     │
     ▼
   Prisma
     │
     ▼
 PostgreSQL
```

## Router

Отвечает за:

- определение endpoints
- подключение middleware
- подключение controllers

## Middleware

Отвечает за сквозные задачи приложения:

- валидацию
- обработку ошибок
- передачу асинхронных ошибок

## Controller

Отвечает за:

- обработку HTTP-запросов
- получение `params`, `body` и `query`
- вызов application logic
- формирование HTTP-ответов

## Service

Отвечает за:

- бизнес-логику
- операции с базой данных
- взаимодействие с Prisma

## Prisma

Отвечает за:

- доступ к базе данных
- выполнение запросов
- миграции
- сгенерированный database client

---

# Поток обработки ошибок

Ошибки обрабатываются централизованно вместо дублирования `try/catch` в каждом controller.

```text
Controller / Service
        │
        │ throw Error
        ▼
   asyncHandler
        │
        ▼
 errorMiddleware
        │
        ├── AppError
        │      ↓
        │   известная HTTP-ошибка
        │
        ├── Prisma error
        │      ↓
        │   преобразование в HTTP-ошибку
        │
        └── Unknown error
               ↓
              500
```

Такой подход позволяет:

- держать controllers сфокусированными на HTTP-логике
- не дублировать обработку ошибок
- получать единообразные API-ответы
- централизованно обрабатывать ошибки Prisma

---

# Примеры API-ответов

## 400 Bad Request

```json
{
  "message": "Validation error"
}
```

## 404 Not Found

```json
{
  "message": "User not found"
}
```

## 409 Conflict

```json
{
  "message": "Email already exists"
}
```

## 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

# Цели проекта

Основная цель проекта — **практика backend-разработки с использованием современного TypeScript-стека и production-oriented подходов**.

Основные направления:

- REST API design
- TypeScript
- Express architecture
- взаимодействие с базой данных
- обработка ошибок
- валидация данных
- автоматическое тестирование
- API-документация
- Docker
- CI/CD

---

# License

Проект создан в **образовательных целях и для портфолио**.
