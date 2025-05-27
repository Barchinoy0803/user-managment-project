-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "USER_STATUS" NOT NULL DEFAULT 'ACTIVE'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
