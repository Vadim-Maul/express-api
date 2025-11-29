/*
  Warnings:

  - Made the column `username` on table `UserModel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "username" SET NOT NULL;
