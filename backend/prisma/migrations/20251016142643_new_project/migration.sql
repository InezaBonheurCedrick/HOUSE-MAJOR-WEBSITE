/*
  Warnings:

  - Made the column `results` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalLinks` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `downloadLinks` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `client` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "results" SET NOT NULL,
ALTER COLUMN "externalLinks" SET NOT NULL,
ALTER COLUMN "downloadLinks" SET NOT NULL,
ALTER COLUMN "client" SET NOT NULL;
