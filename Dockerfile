# Этап 1: Создание приложения и Storybook
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run build-storybook

# Этап 2: Обслуживание Storybook с помощью веб-сервера
FROM nginx:stable-alpine

# Удаление дефолтного конфига
RUN rm /etc/nginx/conf.d/default.conf

# Копирование собственного конфига
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
