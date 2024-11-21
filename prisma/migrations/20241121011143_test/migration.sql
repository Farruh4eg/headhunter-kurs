/*
  Warnings:

  - Made the column `description` on table `joblistings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salary` on table `joblistings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "joblistings" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "salary" SET NOT NULL;
