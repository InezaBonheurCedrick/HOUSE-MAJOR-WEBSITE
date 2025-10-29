-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExp" TIMESTAMP(3);
