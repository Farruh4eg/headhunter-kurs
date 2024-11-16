/*
  Warnings:

  - You are about to drop the column `location` on the `employers` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employers" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "location";
