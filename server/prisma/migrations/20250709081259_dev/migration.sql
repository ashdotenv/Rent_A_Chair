-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `loyaltyPoints` INTEGER NOT NULL DEFAULT 0,
    `referralCode` VARCHAR(191) NOT NULL,
    `referredById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_referralCode_key`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Furniture` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` ENUM('SOFA', 'BED', 'TABLE', 'CHAIR', 'WARDROBE', 'OTHER') NOT NULL,
    `material` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dimensions` VARCHAR(191) NOT NULL,
    `availableQuantity` INTEGER NOT NULL,
    `dailyRate` DOUBLE NOT NULL,
    `weeklyRate` DOUBLE NOT NULL,
    `monthlyRate` DOUBLE NOT NULL,
    `valuationPrice` DOUBLE NOT NULL,
    `originalPrice` DOUBLE NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL,
    `conditionScore` INTEGER NOT NULL,
    `wearLevel` INTEGER NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FurnitureImage` (
    `id` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rental` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `rentalType` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `deliveryAddress` VARCHAR(191) NOT NULL,
    `deliveryDate` DATETIME(3) NULL,
    `pickupDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `paymentMethod` ENUM('CARD', 'CASH', 'PAYPAL', 'ESEWA') NOT NULL,
    `status` ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `gatewayMeta` JSON NULL,

    UNIQUE INDEX `Payment_rentalId_key`(`rentalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DamageReport` (
    `id` VARCHAR(191) NOT NULL,
    `furnitureId` VARCHAR(191) NOT NULL,
    `reportedById` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `severity` INTEGER NOT NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyBonus` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rentalId` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `earnedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LoyaltyBonus_rentalId_key`(`rentalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Furniture` ADD CONSTRAINT `Furniture_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FurnitureImage` ADD CONSTRAINT `FurnitureImage_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_furnitureId_fkey` FOREIGN KEY (`furnitureId`) REFERENCES `Furniture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DamageReport` ADD CONSTRAINT `DamageReport_reportedById_fkey` FOREIGN KEY (`reportedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyBonus` ADD CONSTRAINT `LoyaltyBonus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyBonus` ADD CONSTRAINT `LoyaltyBonus_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `Rental`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
