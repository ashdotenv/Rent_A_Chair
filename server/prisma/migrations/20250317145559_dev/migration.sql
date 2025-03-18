/*
  Warnings:

  - You are about to drop the column `orderId` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_orderId_fkey` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `orderId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `noOfDays` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `orderOrderId` INTEGER NULL,
    ADD COLUMN `totalQuantity` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderOrderId_fkey` FOREIGN KEY (`orderOrderId`) REFERENCES `Order`(`orderId`) ON DELETE SET NULL ON UPDATE CASCADE;
