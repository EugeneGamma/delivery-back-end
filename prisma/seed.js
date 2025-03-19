import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Очищаем базу...");
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.restaurant.deleteMany();

    console.log("👤 Генерация пользователей с разными ролями...");
    const testUsers = [];
    const customers = [];

    // Пользователь-админ
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

    // Пользователь-менеджер
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

    // Пользователь-курьер
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

    // Генерация случайных пользователей с ролью CUSTOMER
    for (let i = 0; i < 5; i++) {
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

    console.log("🏠 Генерация ресторана...");
    const restaurant = await prisma.restaurant.create({
        data: {
            name: faker.company.name(),
            latitude: parseFloat(faker.location.latitude()),
            longitude: parseFloat(faker.location.longitude()),
        },
    });

    console.log("🍽️ Генерация блюд...");
    const dishes = [];
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
    ];

    for (let i = 0; i < 10; i++) {
        const ingredientCount = faker.number.int({ min: 3, max: 5 });
        const shuffled = faker.helpers.shuffle(possibleIngredients);
        const selectedIngredients = shuffled.slice(0, ingredientCount);
        const description = `A delightful dish featuring ${selectedIngredients.join(", ")}.`;

        const dish = await prisma.dish.create({
            data: {
                name: faker.commerce.productName(),
                description,
                ingredients: JSON.stringify(selectedIngredients),
                price: faker.number.int({ min: 5000, max: 50000 }),
                imageUrl: `/uploads/seeded/dish_(${i + 1}).jpg`,
                category: faker.commerce.department(),
                restaurantId: restaurant.id,
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
