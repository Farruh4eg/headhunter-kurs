/*
  Warnings:

  - You are about to alter the column `salary` on the `joblistings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "joblistings" ALTER COLUMN "salary" SET DATA TYPE INTEGER;
