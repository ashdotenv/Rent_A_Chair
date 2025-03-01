-- CreateTable
CREATE TABLE `Referral` (
    `referralId` INTEGER NOT NULL AUTO_INCREMENT,
    `referrerId` INTEGER NOT NULL,
    `refereeId` INTEGER NOT NULL,
    `referralCode` VARCHAR(191) NOT NULL,
    `discountPercentage` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'REWARDED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Referral_referralCode_key`(`referralCode`),
    PRIMARY KEY (`referralId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_refereeId_fkey` FOREIGN KEY (`refereeId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
