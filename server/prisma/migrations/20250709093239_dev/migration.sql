/*
  Warnings:

  - The values [CARD,PAYPAL,ESEWA] on the enum `Payment_paymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [CARD,PAYPAL,ESEWA] on the enum `Payment_paymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `paymentMethod` ENUM('CASH', 'KHALTI') NOT NULL;

-- AlterTable
ALTER TABLE `rental` MODIFY `paymentMethod` ENUM('CASH', 'KHALTI') NOT NULL;
