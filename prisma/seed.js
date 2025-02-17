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

    console.log("👤 Генерация пользователей...");
    const users = [];
    const testUsers = [];

    for (let i = 0; i < 5; i++) {
        const email = faker.internet.email().toLowerCase();
        const password = faker.internet.password();
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name: faker.person.fullName(),
                passwordHash,
                role: "CUSTOMER",
            },
        });

        users.push(user);
        testUsers.push({ email, password });
    }

    console.log("💾 Сохранение тестовых пользователей в test-users.json...");
    fs.writeFileSync("test-users.json", JSON.stringify(testUsers, null, 2));

    console.log("🍽️ Генерация блюд...");
    const dishes = [];
    for (let i = 0; i < 10; i++) {
        const dish = await prisma.dish.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.lorem.sentence(),
                ingredients: JSON.stringify([faker.commerce.product(), faker.commerce.product()]),
                price: faker.number.int({ min: 5000, max: 50000 }),
                imageUrl: `/uploads/seeded/dish_(${i + 1}).jpg`,
                category: faker.commerce.department(),
            },
        });
        dishes.push(dish);
    }

    console.log("🛒 Заполнение корзин пользователей...");
    for (const user of users) {
        const cart = await prisma.cart.create({
            data: {
                userId: user.id,
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
