# 🍔 Food Delivery Backend

Этот проект представляет собой backend для сервиса доставки еды, разработанный на **NestJS** с использованием **Prisma**, **MySQL** и **JWT-аутентификации**.

## 🚀 Функционал

- 📌 **Регистрация и аутентификация** (JWT, шифрование паролей с bcrypt)
- 🍽 **Работа с блюдами** (CRUD-операции)
- 🛒 **Корзина пользователя** (добавление, удаление, изменение количества)
- 🛍 **Оформление заказов**
- 🗂 **Загрузка изображений** (Multer)
- 🛡 **Роли пользователей** (CUSTOMER, ADMIN)

## 🏗️ Установка и запуск

### 1️⃣ Клонируем репозиторий
```sh
git clone https://github.com/your-repo/food-delivery-backend.git
cd food-delivery-backend
```
### 2️⃣ Устанавливаем зависимости
```sh
npm install
```
### 3️⃣ Настраиваем базу данных
Создай .env файл и добавь параметры подключения к базе данных:
```ini
DATABASE_URL="mysql://root:password@localhost:3306/delivery_app"
JWT_SECRET=token_here
JWT_EXPIRES_IN=20000s
```
Применяем миграции:
```sh
npx prisma migrate dev --name <name_of_mirgration>
```

### 4️⃣ Заполняем тестовые данные
```sh
npm run seed
```
Все сгенерированные данные пользователей будут лежать в файле test-user.json

### 5️⃣ Запуск сервера
В режиме разработки:
```sh
npm run start:dev
```

### 🛠️ Основные команды
```npm run build	``` Сборка проекта
```npm run start	``` Запуск в обычном режиме
```npm run start:dev	``` Запуск в режиме разработки (hot reload)
```npm run start:debug	``` Запуск с отладкой
```npm run start:prod	``` Запуск в продакшене
```npm run lint	``` Проверка кода на ошибки
```npm run format	``` Форматирование кода (Prettier)
```npm run test	``` Запуск тестов
```npm run test:watch	``` Тесты в режиме наблюдения
```npm run test:cov	``` Запуск тестов с покрытием кода
```npm run test:e2e	``` End-to-End тестирование
```npm run seed	``` Заполнение базы тестовыми данными
