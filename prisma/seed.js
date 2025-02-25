import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient();

// Константы для генерации
const NUM_DISHES = 30;
const NUM_RESTAURANTS = 5;
const NUM_CUSTOMERS = 5;
const DISH_IMAGE_COUNT = 10;

async function main() {
    console.log("🧹 Очищаем базу...");
    // Удаляем данные в нужном порядке (важно соблюдать зависимости)
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.restaurant.deleteMany();

    console.log("👤 Генерация пользователей с разными ролями...");
    const testUsers = [];
    const customers = [];

    // Создаем пользователя-админа
    const adminPassword = "admin123";
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@example.com",
            name: "Admin User",
            passwordHash: adminPasswordHash,
            role: "ADMIN",
        },
    });
    testUsers.push({ email: "admin@example.com", password: adminPassword });

    // Создаем пользователя-менеджера
    const managerPassword = "manager123";
    const managerPasswordHash = await bcrypt.hash(managerPassword, 10);
    const managerUser = await prisma.user.create({
        data: {
            email: "manager@example.com",
            name: "Manager User",
            passwordHash: managerPasswordHash,
            role: "MANAGER",
        },
    });
    testUsers.push({ email: "manager@example.com", password: managerPassword });

    // Создаем пользователя-курьера
    const courierPassword = "courier123";
    const courierPasswordHash = await bcrypt.hash(courierPassword, 10);
    const courierUser = await prisma.user.create({
        data: {
            email: "courier@example.com",
            name: "Courier User",
            passwordHash: courierPasswordHash,
            role: "COURIER",
        },
    });
    testUsers.push({ email: "courier@example.com", password: courierPassword });

    // Генерируем случайных пользователей с ролью CUSTOMER
    for (let i = 0; i < NUM_CUSTOMERS; i++) {
        const email = faker.internet.email().toLowerCase();
        const password = faker.internet.password();
        const passwordHash = await bcrypt.hash(password, 10);

        const customerUser = await prisma.user.create({
            data: {
                email,
                name: faker.person.fullName(),
                passwordHash,
                role: "CUSTOMER",
            },
        });
        customers.push(customerUser);
        testUsers.push({ email, password });
    }

    console.log("💾 Сохранение тестовых пользователей в test-users.json...");
    fs.writeFileSync("test-users.json", JSON.stringify(testUsers, null, 2));

    console.log("🏠 Генерация ресторанов...");
    const restaurants = [];
    for (let i = 0; i < NUM_RESTAURANTS; i++) {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: faker.company.name(),
            },
        });
        restaurants.push(restaurant);
    }

    console.log("🍽️ Генерация блюд...");
    const dishes = [];
    // Список возможных ингредиентов
    const possibleIngredients = [
        "tomato",
        "basil",
        "mozzarella",
        "olive oil",
        "garlic",
        "onion",
        "pepper",
        "salt",
        "mushroom",
        "chicken",
        "beef",
        "pork",
        "spinach",
        "eggplant",
        "parsley",
        "oregano",
        "potato",
        "carrot",
        "celery",
        "thyme",
        "rosemary",
        "lemon",
        "zucchini",
    ];

    for (let i = 0; i < NUM_DISHES; i++) {
        // Выбираем от 3 до 5 ингредиентов случайным образом
        const ingredientCount = faker.number.int({ min: 3, max: 5 });
        const shuffled = faker.helpers.shuffle(possibleIngredients);
        const selectedIngredients = shuffled.slice(0, ingredientCount);

        // Создаем более правдоподобное название блюда и описание
        const dishName = faker.commerce.productName();
        const description = `Enjoy our delicious ${dishName.toLowerCase()} made with a perfect blend of ${selectedIngredients.join(
            ", "
        )}. Savor the taste and aroma in every bite!`;

        // Выбираем случайное изображение из имеющихся
        const imageIndex = faker.number.int({ min: 1, max: DISH_IMAGE_COUNT });
        const imagePath = `/uploads/seeded/dish_(${imageIndex}).jpg`;

        // Назначаем случайный ресторан из сгенерированных
        const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];

        const dish = await prisma.dish.create({
            data: {
                name: dishName,
                description,
                ingredients: JSON.stringify(selectedIngredients),
                price: faker.number.int({ min: 5000, max: 50000 }),
                imageUrl: imagePath,
                thumbnailUrl: imagePath, // Используем тот же путь для thumbnail
                category: faker.commerce.department(),
                restaurantId: randomRestaurant.id,
            },
        });
        dishes.push(dish);
    }

    console.log("🛒 Заполнение корзин пользователей (только для CUSTOMER)...");
    for (const customer of customers) {
        const cart = await prisma.cart.create({
            data: {
                userId: customer.id,
            },
        });

        const selectedDishes = new Set();
        // Добавляем 3 уникальных блюда в корзину
        for (let i = 0; i < 3; i++) {
            let randomDish;
            do {
                randomDish = dishes[Math.floor(Math.random() * dishes.length)];
            } while (selectedDishes.has(randomDish.id));
            selectedDishes.add(randomDish.id);

            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    dishId: randomDish.id,
                    quantity: faker.number.int({ min: 1, max: 5 }),
                },
            });
        }
    }

    console.log("✅ Заполнение завершено!");
}

main()
    .catch((e) => {
        console.error("❌ Ошибка при выполнении seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
