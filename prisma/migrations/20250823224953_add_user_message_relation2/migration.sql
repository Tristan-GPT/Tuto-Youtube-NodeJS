/*
  Warnings:

  - A unique constraint covering the columns `[id,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropIndex
DROP INDEX `Message_userId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_username_key` ON `User`(`id`, `username`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_username_fkey` FOREIGN KEY (`userId`, `username`) REFERENCES `User`(`id`, `username`) ON DELETE RESTRICT ON UPDATE CASCADE;
