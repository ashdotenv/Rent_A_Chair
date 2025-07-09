/*
  Warnings:

  - You are about to drop the column `deliveryAddress` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryDate` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `rental` table. All the data in the column will be lost.
  - You are about to drop the column `pickupDate` on the `rental` table. All the data in the column will be lost.
  - Added the required column `deliveryCity` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryCountry` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryPostalCode` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryState` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryStreet` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rental` DROP COLUMN `deliveryAddress`,
    DROP COLUMN `deliveryDate`,
    DROP COLUMN `notes`,
    DROP COLUMN `pickupDate`,
    ADD COLUMN `deliveryCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryPostalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryState` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryStreet` VARCHAR(191) NOT NULL,
    ADD COLUMN `discountCode` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `paymentMethod` ENUM('CARD', 'CASH', 'PAYPAL', 'ESEWA') NOT NULL,
    ADD COLUMN `paymentStatus` ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL,
    ALTER COLUMN `status` DROP DEFAULT;
