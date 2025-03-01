-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentStatus` ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending';
