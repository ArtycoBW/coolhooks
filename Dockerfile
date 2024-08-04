# Этап 1: Создание приложения React
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run build-storybook

# Этап 2: обслуживаем приложение React с помощью веб-сервера
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/storybook-static /usr/share/nginx/storybook
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
