/*
  Warnings:

  - You are about to drop the column `rolesRole_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_rolesRole_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "rolesRole_id";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
