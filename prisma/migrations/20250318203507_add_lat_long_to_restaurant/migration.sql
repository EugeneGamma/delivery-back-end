/*
  Warnings:

  - Added the required column `latitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL;
