/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Dish` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Dish` DROP COLUMN `thumbnailUrl`;

-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL;
