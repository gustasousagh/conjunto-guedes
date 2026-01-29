-- AlterTable
ALTER TABLE `prayer` ADD COLUMN `qrCodeGroupId` VARCHAR(191) NULL,
    ADD COLUMN `source` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `QRCodeGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#6366f1',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QRCodeGroup_name_key`(`name`),
    UNIQUE INDEX `QRCodeGroup_slug_key`(`slug`),
    INDEX `QRCodeGroup_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Prayer_source_idx` ON `Prayer`(`source`);

-- CreateIndex
CREATE INDEX `Prayer_qrCodeGroupId_idx` ON `Prayer`(`qrCodeGroupId`);

-- AddForeignKey
ALTER TABLE `Prayer` ADD CONSTRAINT `Prayer_qrCodeGroupId_fkey` FOREIGN KEY (`qrCodeGroupId`) REFERENCES `QRCodeGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
