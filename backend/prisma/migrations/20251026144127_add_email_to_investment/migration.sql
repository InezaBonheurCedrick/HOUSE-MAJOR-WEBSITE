/*
  Warnings:

  - You are about to drop the column `image` on the `Investment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "image",
ADD COLUMN     "email" TEXT;
