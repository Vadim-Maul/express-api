/*
  Warnings:

  - Added the required column `heatLevel` to the `ProductModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `ProductModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ProductModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ProductModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductModel" ADD COLUMN     "heatLevel" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL;
