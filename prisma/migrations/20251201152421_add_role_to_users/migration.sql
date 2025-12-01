-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
