-- AlterTable
ALTER TABLE `user` MODIFY `role` VARCHAR(191) NULL DEFAULT 'User',
    MODIFY `updatedAt` DATETIME(3) NULL;
