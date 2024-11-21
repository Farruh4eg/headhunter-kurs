-- DropForeignKey
ALTER TABLE "joblistings" DROP CONSTRAINT "joblistings_employer_id_fkey";

-- DropForeignKey
ALTER TABLE "savedjoblistings" DROP CONSTRAINT "savedjoblistings_job_id_fkey";

-- DropForeignKey
ALTER TABLE "savedjoblistings" DROP CONSTRAINT "savedjoblistings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "userjobapplications" DROP CONSTRAINT "userjobapplications_job_id_fkey";

-- DropForeignKey
ALTER TABLE "userjobapplications" DROP CONSTRAINT "userjobapplications_user_id_fkey";

-- AddForeignKey
ALTER TABLE "joblistings" ADD CONSTRAINT "joblistings_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("employer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedjoblistings" ADD CONSTRAINT "savedjoblistings_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "joblistings"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedjoblistings" ADD CONSTRAINT "savedjoblistings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userjobapplications" ADD CONSTRAINT "userjobapplications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "joblistings"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userjobapplications" ADD CONSTRAINT "userjobapplications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
