# Express App

REST API для управления пользователями, построенный на **Node.js + Express + TypeScript + Prisma + PostgreSQL**.

Проект создан как backend practice project с акцентом на **чистую архитектуру, валидацию данных, обработку ошибок, тестирование, Swagger-документацию и Docker**.

---

## Tech Stack

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| **Node.js 22**        | JavaScript runtime       |
| **TypeScript**        | Static typing            |
| **Express 5**         | HTTP server and REST API |
| **Prisma 7**          | ORM                      |
| **PostgreSQL 17**     | Relational database      |
| **Zod**               | Request validation       |
| **Vitest**            | Testing                  |
| **Supertest**         | HTTP API testing         |
| **Swagger / OpenAPI** | API documentation        |
| **Docker**            | Containerization         |
| **Docker Compose**    | Local infrastructure     |

---

## Features

- CRUD operations for users
- Request validation with **Zod**
- Centralized error handling
- Custom application errors
- Prisma error handling
- Duplicate email protection
- Pagination
- Search users by name or email
- Sorting users
- Automated API tests
- Swagger / OpenAPI documentation
- PostgreSQL running in Docker
- Production Docker image with multi-stage build
- TypeScript type checking
- Production build

---

## Project Structure

```text
express-app/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   │
│   ├── errors/
│   │   └── app.error.ts
│   │
│   ├── lib/
│   │   └── test-prisma.ts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── routes/
│   │   └── user.routes.ts
│   │
│   ├── schemas/
│   │   ├── user-query.schema.ts
│   │   └── user.schema.ts
│   │
│   ├── swagger/
│   │   └── swagger.ts
│   │
│   ├── tests/
│   │   ├── helpers/
│   │   │   └── user.helper.ts
│   │   ├── setup.ts
│   │   └── user.test.ts
│   │
│   ├── utils/
│   │   └── async-handler.ts
│   │
│   ├── app.ts
│   └── index.ts
│
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## API Endpoints

### Users

| Method   | Endpoint     | Description         |
| -------- | ------------ | ------------------- |
| `GET`    | `/users`     | Get paginated users |
| `GET`    | `/users/:id` | Get user by ID      |
| `POST`   | `/users`     | Create user         |
| `PATCH`  | `/users/:id` | Update user         |
| `DELETE` | `/users/:id` | Delete user         |

---

## API Examples

### Create User

```http
POST /users
Content-Type: application/json
```

Request:

```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com"
}
```

Response:

```json
{
  "id": 1,
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com"
}
```

---

### Get Users

```http
GET /users
```

Example response:

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

### Pagination

The users endpoint supports pagination:

```http
GET /users?page=1&limit=10
```

Available parameters:

| Parameter | Type            | Default | Description              |
| --------- | --------------- | ------: | ------------------------ |
| `page`    | integer         |     `1` | Page number              |
| `limit`   | integer         |    `10` | Number of users per page |
| `search`  | string          |       — | Search by name or email  |
| `sort`    | `name \| email` |  `name` | Sorting field            |
| `order`   | `asc \| desc`   |   `asc` | Sorting direction        |

Example:

```http
GET /users?page=2&limit=5&search=john&sort=email&order=desc
```

---

### Get User

```http
GET /users/1
```

---

### Update User

```http
PATCH /users/1
Content-Type: application/json
```

Request:

```json
{
  "name": "Alex Updated"
}
```

---

### Delete User

```http
DELETE /users/1
```

Successful response:

```http
204 No Content
```

---

## Validation

Request validation is implemented using **Zod**.

Example validation rules:

- `name` must contain at least 2 characters
- `email` must be a valid email address
- pagination parameters have minimum and maximum values
- sorting fields are restricted to supported values
- sorting direction is restricted to `asc` / `desc`

Invalid requests return an appropriate `400 Bad Request` response.

---

## Error Handling

The application uses centralized error handling through `errorMiddleware`.

Application errors are represented by `AppError`.

Supported application error codes:

```text
USER_NOT_FOUND
EMAIL_EXISTS
VALIDATION_ERROR
INTERNAL_ERROR
```

Prisma errors are also handled centrally.

For example:

| Error            | HTTP Status | Meaning               |
| ---------------- | ----------: | --------------------- |
| `P2025`          |       `404` | User not found        |
| `P2002`          |       `409` | Email already exists  |
| Validation error |       `400` | Invalid request       |
| Unknown error    |       `500` | Internal server error |

Example:

```json
{
  "message": "User not found"
}
```

---

## Swagger / OpenAPI

The API is documented using **Swagger UI**.

After starting the application, documentation is available at:

```text
http://localhost:3000/api-docs
```

Swagger provides:

- available endpoints
- request parameters
- request bodies
- response schemas
- HTTP status codes
- interactive API testing

---

## Testing

The project uses:

- **Vitest** — test runner
- **Supertest** — HTTP API testing
- separate PostgreSQL database for tests

Covered scenarios include:

- creating users
- preventing duplicate emails
- retrieving users
- retrieving a user by ID
- handling missing users
- updating users
- deleting users
- handling deletion of a non-existent user

Run tests:

```bash
npm test
```

Run tests once:

```bash
npm test -- --run
```

---

## Type Checking

TypeScript type checking can be executed with:

```bash
npm run typecheck
```

The project also supports a production TypeScript build:

```bash
npm run build
```

Compiled files are generated in:

```text
dist/
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/express_app"
```

For the test database:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/backend_practice_test"
```

> **Do not commit `.env` files or database credentials to Git.**

---

## Database

PostgreSQL is used as the primary database.

The project uses **Prisma ORM** to interact with PostgreSQL.

Generate Prisma Client:

```bash
npx prisma generate
```

Create and apply a development migration:

```bash
npx prisma migrate dev
```

Check the database using Prisma Studio:

```bash
npx prisma studio
```

---

## Docker

The project includes a `Dockerfile` and `docker-compose.yml`.

Docker Compose starts:

- PostgreSQL
- Express API

Start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs api
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Stop the application:

```bash
docker compose down
```

---

## Docker Architecture

The application uses a multi-stage Docker build.

### Builder stage

The builder:

1. installs dependencies
2. copies the source code
3. generates Prisma Client
4. compiles TypeScript

### Production stage

The production image:

1. installs only production dependencies
2. copies the compiled application
3. copies Prisma Client
4. starts the Node.js application

This keeps the production image smaller and prevents development dependencies from being included in the final runtime image.

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up postgres -d
```

### 3. Apply Prisma migrations

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api-docs
```

---

## NPM Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start development server     |
| `npm run build`     | Compile TypeScript           |
| `npm run start`     | Start production build       |
| `npm run test`      | Run Vitest                   |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint`      | Run ESLint                   |

---

## Architecture

The application follows a layered structure:

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

### Router

Responsible for:

- defining endpoints
- connecting middleware
- connecting controllers

### Middleware

Responsible for cross-cutting concerns such as:

- validation
- error handling
- asynchronous error forwarding

### Controller

Responsible for:

- processing HTTP requests
- extracting parameters/body/query
- calling application logic
- returning HTTP responses

### Service

Responsible for:

- business logic
- database operations
- interaction with Prisma

### Prisma

Responsible for:

- database access
- queries
- migrations
- generated database client

---

## Error Flow

Errors are handled centrally instead of duplicating `try/catch` logic inside every controller.

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
        ├── AppError → known HTTP error
        │
        ├── Prisma error → mapped HTTP error
        │
        └── Unknown error → 500
```

This keeps controllers focused on HTTP logic and provides consistent API responses.

---

## API Response Examples

### `400 Bad Request`

```json
{
  "message": "Validation error"
}
```

### `404 Not Found`

```json
{
  "message": "User not found"
}
```

### `409 Conflict`

```json
{
  "message": "Email already exists"
}
```

### `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

---

## Project Goals

The main goal of this project is to practice backend development using a modern TypeScript stack and production-oriented development practices.

The project focuses on:

- REST API design
- TypeScript
- Express architecture
- database interaction
- error handling
- validation
- automated testing
- API documentation
- Docker
- CI/CD

---

## License

This project is created for educational and portfolio purposes.
