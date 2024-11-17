/*
  Warnings:

  - Added the required column `logo` to the `employers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employers" ADD COLUMN     "logo" VARCHAR(255) NOT NULL;
