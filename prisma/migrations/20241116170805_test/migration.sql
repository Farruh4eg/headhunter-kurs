-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rolesRole_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rolesRole_id_fkey" FOREIGN KEY ("rolesRole_id") REFERENCES "roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;
