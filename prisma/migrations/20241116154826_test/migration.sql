-- CreateTable
CREATE TABLE "employers" (
    "employer_id" SERIAL NOT NULL,
    "company" VARCHAR(150) NOT NULL,
    "location" VARCHAR(150),

    CONSTRAINT "employers_pkey" PRIMARY KEY ("employer_id")
);

-- CreateTable
CREATE TABLE "joblistings" (
    "job_id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "salary" DECIMAL(10,2),
    "deadline" DATE,
    "employer_id" INTEGER NOT NULL,
    "experience" SMALLINT,

    CONSTRAINT "joblistings_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role" VARCHAR(64) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "savedjoblistings" (
    "saved_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "saved_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "savedjoblistings_pkey" PRIMARY KEY ("saved_id")
);

-- CreateTable
CREATE TABLE "userjobapplications" (
    "application_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "application_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userjobapplications_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "location" VARCHAR(150),
    "experience" SMALLINT,
    "date_created" DATE DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "joblistings" ADD CONSTRAINT "joblistings_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employers"("employer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "savedjoblistings" ADD CONSTRAINT "savedjoblistings_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "joblistings"("job_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "savedjoblistings" ADD CONSTRAINT "savedjoblistings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userjobapplications" ADD CONSTRAINT "userjobapplications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "joblistings"("job_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userjobapplications" ADD CONSTRAINT "userjobapplications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
