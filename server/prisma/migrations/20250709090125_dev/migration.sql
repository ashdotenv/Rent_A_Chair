/*
  Warnings:

  - You are about to drop the column `ownerId` on the `furniture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `furniture` DROP FOREIGN KEY `Furniture_ownerId_fkey`;

-- DropIndex
DROP INDEX `Furniture_ownerId_fkey` ON `furniture`;

-- AlterTable
ALTER TABLE `furniture` DROP COLUMN `ownerId`;
