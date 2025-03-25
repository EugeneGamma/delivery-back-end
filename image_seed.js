import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";

/**
 * Создаёт изображение с двумя строками текста и сохраняет его по outputPath.
 * Первая строка (boldText) выводится жирным, вторая (normalText) – обычным.
 * Если один из текстов не помещается по ширине или блок из двух строк не помещается по высоте,
 * размер шрифта динамически уменьшается.
 *
 * @param {number} width - Ширина изображения.
 * @param {number} height - Высота изображения.
 * @param {string} boldText - Текст для первой строки (выводится жирным).
 * @param {string} normalText - Текст для второй строки (выводится обычным шрифтом).
 * @param {string} outputPath - Путь для сохранения изображения.
 */
export function createImage(width, height, boldText, normalText, outputPath) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Генерация случайного яркого фона
    const r = Math.floor(Math.random() * 156 + 100);
    const g = Math.floor(Math.random() * 156 + 100);
    const b = Math.floor(Math.random() * 156 + 100);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, width, height);

    // Параметры отступов и межстрочного интервала
    const margin = 20;
    const lineSpacing = 10;

    // Начальный размер шрифта
    let fontSize = Math.floor(height / 10);
    const fontFamily = "Arial";

    // Функция для установки шрифта и измерения ширины текста
    const measureTexts = (fsz) => {
        ctx.font = `bold ${fsz}px ${fontFamily}`;
        const boldWidth = ctx.measureText(boldText).width;
        ctx.font = `${fsz}px ${fontFamily}`;
        const normalWidth = ctx.measureText(normalText).width;
        return { boldWidth, normalWidth };
    };

    // Определяем оптимальный размер шрифта, чтобы оба текста вписывались по горизонтали и блок по вертикали
    let { boldWidth, normalWidth } = measureTexts(fontSize);
    while (
        (boldWidth > (width - margin * 2) ||
            normalWidth > (width - margin * 2) ||
            (2 * fontSize + lineSpacing) > (height - margin * 2)) &&
        fontSize > 10
        ) {
        fontSize -= 2;
        ({ boldWidth, normalWidth } = measureTexts(fontSize));
    }

    // Вычисляем координаты для центрирования блока из двух строк
    const totalTextHeight = 2 * fontSize + lineSpacing;
    const startY = (height - totalTextHeight) / 2 + fontSize; // baseline первой строки

    // Первая строка – жирным
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    const boldX = (width - boldWidth) / 2;
    ctx.fillStyle = "black";
    ctx.fillText(boldText, boldX, startY);

    // Вторая строка – обычным
    ctx.font = `${fontSize}px ${fontFamily}`;
    const normalX = (width - normalWidth) / 2;
    const normalY = startY + lineSpacing + fontSize;
    ctx.fillText(normalText, normalX, normalY);

    // Сохраняем изображение в формате JPEG
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync(outputPath, buffer);
}

/**
 * Генерирует три изображения (баннер, основное и thumbnail) для ресторана.
 * @param {string} restaurantName - Название ресторана (будет выведено жирным).
 * @param {number} restaurantIndex - Номер ресторана (для формирования имени файла).
 * @param {string} outputDir - Путь к папке, где будут сохранены изображения.
 * @returns {Object} Пути к сгенерированным изображениям.
 */
export function generateRestaurantImages(restaurantName, restaurantIndex, outputDir) {
    const bannerPath = path.join(outputDir, `restaurant_${restaurantIndex}_banner.jpg`);
    const mainPath = path.join(outputDir, `restaurant_${restaurantIndex}_main.jpg`);
    const thumbPath = path.join(outputDir, `restaurant_${restaurantIndex}_thumbnail.jpg`);

    // Для каждого изображения передаём название ресторана и тип изображения как две строки
    createImage(1000, 500, restaurantName, "Баннер", bannerPath);
    createImage(1000, 1000, restaurantName, "Основное изображение", mainPath);
    createImage(500, 500, restaurantName, "Thumbnail", thumbPath);

    return { bannerPath, mainPath, thumbPath };
}
