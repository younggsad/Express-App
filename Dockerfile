# =========================
# Build stage
# =========================

FROM node:22-alpine AS builder

WORKDIR /app

# Копируем package-файлы отдельно,
# чтобы Docker мог кэшировать установку зависимостей
COPY package*.json ./

RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Компилируем TypeScript
RUN npm run build


# =========================
# Production stage
# =========================

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Устанавливаем только production-зависимости
COPY package*.json ./

RUN npm ci --omit=dev

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist

# Prisma schema/config нужны только если приложение
# выполняет Prisma CLI-команды внутри контейнера.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]