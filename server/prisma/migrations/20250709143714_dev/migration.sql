/*
  Warnings:

  - You are about to alter the column `severity` on the `damagereport` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(9))`.

*/
-- DropForeignKey
ALTER TABLE `rental` DROP FOREIGN KEY `Rental_furnitureId_fkey`;

-- DropIndex
DROP INDEX `Rental_furnitureId_fkey` ON `rental`;

-- AlterTable
ALTER TABLE `damagereport` ADD COLUMN `adminNotes` VARCHAR(191) NULL,
    ADD COLUMN `costOfRepair` DOUBLE NULL,
    ADD COLUMN `rentalId` VARCHAR(191) NULL,
    ADD COLUMN `resolvedAt` DATETIME(3) NULL,
    MODIFY `severity` ENUM('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL') NOT NULL;

-- AlterTable
ALTER TABLE `furniture` ADD COLUMN `currentLocation` VARCHAR(191) NULL,
    ADD COLUMN `lastInspectedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `invoiceUrl` VARCHAR(191) NULL,
    ADD COLUMN `nextPaymentDue` DATETIME(3) NULL,
    MODIFY `paymentMethod` ENUM('CASH', 'KHALTI', 'STRIPE', 'PAYPAL') NOT NULL,
    MODIFY `status` ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL;

-- AlterTable
ALTER TABLE `rental` ADD COLUMN `actualDeliveryDate` DATETIME(3) NULL,
    ADD COLUMN `bundleId` VARCHAR(191) NULL,
    ADD COLUMN `deliveryTrackingNumber` VARCHAR(191) NULL,
    ADD COLUMN `estimatedDeliveryDate` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `returnScheduledAt` DATETIME(3) NULL,
    ADD COLUMN `returnedAt` DATETIME(3) NULL,
    MODIFY `furnitureId` VARCHAR(191) NULL,
    MODIFY `rentalType` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'SUBSCRIPTION') NOT NULL,
    MODIFY `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'RENT_TO_OWN_PENDING', 'RENT_TO_OWN_ACTIVE', 'RENT_TO_OWN_COMPLETED') NOT NULL,
    MODIFY `paymentMethod` ENUM('CASH', 'KHALTI', 'STRIPE', 'PAYPAL') NOT NULL,
    MODIFY `paymentStatus` ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,
    MODIFY `deliveryStatus` ENUM('PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `SubscriptionPlan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `durationInMonths` INTEGER NOT NULL,
    `pricePerMonth` DOUBLE NOT NULL,
    `benefits` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SubscriptionPlan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `autoRenew` BOOLEAN NOT NULL DEFAULT false,
    `stripeSubscriptionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Subscription_stripeSubscriptionId_key`(`stripeSubscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionPayment` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,

    UNIQUE INDEX `SubscriptionPayment_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FurnitureBundle` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FurnitureBundle_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BundleItem` (
    `id` VARCHAR(191) NOT NULL,
    `bundleId` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WishlistItem` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `WishlistItem_userId_furnitureId_key`(`userId`, `furnitureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `methodType` ENUM('CASH', 'KHALTI', 'STRIPE', 'PAYPAL') NOT NULL,
    `providerCustomerId` VARCHAR(191) NULL,
    `lastFour` VARCHAR(191) NULL,
    `expirationDate` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserPaymentMethod_userId_methodType_providerCustomerId_key`(`userId`, `methodType`, `providerCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `minRentalAmount` DOUBLE NULL,
    `maxUses` INTEGER NULL,
    `uses` INTEGER NOT NULL DEFAULT 0,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Discount_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FurnitureConditionLog` (
    `id` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `conditionScore` INTEGER NOT NULL,
    `wearLevel` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `inspectorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryUpdate` (
    `id` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED') NOT NULL,
    `location` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryMovement` (
    `id` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reason` VARCHAR(191) NULL,
    `movedBy` VARCHAR(191) NULL,
    `movedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `isMaintenance` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalMaintenanceService` (
    `id` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `performedAt` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceRecord` (
    `id` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `performedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cost` DOUBLE NULL,
    `notes` VARCHAR(191) NULL,
    `performedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentToOwnAgreement` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `optionFee` DOUBLE NOT NULL,
    `purchasePrice` DOUBLE NOT NULL,
    `rentCreditPercentage` DOUBLE NOT NULL,
    `agreementStartDate` DATETIME(3) NOT NULL,
    `agreementEndDate` DATETIME(3) NOT NULL,
    `isExercised` BOOLEAN NOT NULL DEFAULT false,
    `exercisedAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'RENT_TO_OWN_PENDING', 'RENT_TO_OWN_ACTIVE', 'RENT_TO_OWN_COMPLETED') NOT NULL DEFAULT 'RENT_TO_OWN_PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RentToOwnAgreement_rentalId_key`(`rentalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FurnitureSwap` (
    `id` VARCHAR(191) NOT NULL,
    `initiatorId` VARCHAR(191) NOT NULL,
    `requesterId` VARCHAR(191) NOT NULL,
    `initiatorFurnitureId` VARCHAR(191) NOT NULL,
    `requesterFurnitureId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `proposedDate` DATETIME(3) NULL,
    `swapDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FurnitureSwap_initiatorId_initiatorFurnitureId_requesterId_r_key`(`initiatorId`, `initiatorFurnitureId`, `requesterId`, `requesterFurnitureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_bundleId_fkey` FOREIGN KEY (`bundleId`) REFERENCES `FurnitureBundle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_id_fkey` FOREIGN KEY (`id`) REFERENCES `RentToOwnAgreement`(`rentalId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_discountCode_fkey` FOREIGN KEY (`discountCode`) REFERENCES `Discount`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `SubscriptionPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionPayment` ADD CONSTRAINT `SubscriptionPayment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionPayment` ADD CONSTRAINT `SubscriptionPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BundleItem` ADD CONSTRAINT `BundleItem_bundleId_fkey` FOREIGN KEY (`bundleId`) REFERENCES `FurnitureBundle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BundleItem` ADD CONSTRAINT `BundleItem_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItem` ADD CONSTRAINT `WishlistItem_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPaymentMethod` ADD CONSTRAINT `UserPaymentMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureConditionLog` ADD CONSTRAINT `FurnitureConditionLog_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureConditionLog` ADD CONSTRAINT `FurnitureConditionLog_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryUpdate` ADD CONSTRAINT `DeliveryUpdate_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_movedBy_fkey` FOREIGN KEY (`movedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalMaintenanceService` ADD CONSTRAINT `RentalMaintenanceService_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalMaintenanceService` ADD CONSTRAINT `RentalMaintenanceService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceRecord` ADD CONSTRAINT `MaintenanceRecord_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceRecord` ADD CONSTRAINT `MaintenanceRecord_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceRecord` ADD CONSTRAINT `MaintenanceRecord_performedBy_fkey` FOREIGN KEY (`performedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentToOwnAgreement` ADD CONSTRAINT `RentToOwnAgreement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentToOwnAgreement` ADD CONSTRAINT `RentToOwnAgreement_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureSwap` ADD CONSTRAINT `FurnitureSwap_initiatorId_fkey` FOREIGN KEY (`initiatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureSwap` ADD CONSTRAINT `FurnitureSwap_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureSwap` ADD CONSTRAINT `FurnitureSwap_initiatorFurnitureId_fkey` FOREIGN KEY (`initiatorFurnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureSwap` ADD CONSTRAINT `FurnitureSwap_requesterFurnitureId_fkey` FOREIGN KEY (`requesterFurnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
