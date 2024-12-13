/*
  Warnings:

  - Added the required column `userId` to the `AppState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Patch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppState" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patch" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Patch" ADD CONSTRAINT "Patch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppState" ADD CONSTRAINT "AppState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
