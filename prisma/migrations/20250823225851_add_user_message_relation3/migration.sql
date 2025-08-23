-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_username_fkey`;

-- DropIndex
DROP INDEX `Message_userId_username_fkey` ON `message`;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_username_fkey` FOREIGN KEY (`userId`, `username`) REFERENCES `User`(`id`, `username`) ON DELETE CASCADE ON UPDATE CASCADE;
