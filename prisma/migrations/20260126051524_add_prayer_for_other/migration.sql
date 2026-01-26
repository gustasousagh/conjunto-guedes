-- AlterTable
ALTER TABLE `prayer` ADD COLUMN `otherPersonName` VARCHAR(191) NULL,
    ADD COLUMN `prayerForOther` BOOLEAN NOT NULL DEFAULT false;
