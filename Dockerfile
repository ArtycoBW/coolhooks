# Этап 1: Создание приложения React
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Запуск линтера
RUN npm run lint
# Запуск тестов
RUN npm run test
# Запуск сборки
RUN npm run build

# Этап 2: обслуживаем приложение React с помощью веб-сервера
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]