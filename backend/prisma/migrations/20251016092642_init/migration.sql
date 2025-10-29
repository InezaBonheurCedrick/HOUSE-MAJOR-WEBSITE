-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "fullDescription" TEXT,
    "images" TEXT[],
    "features" TEXT[],
    "results" JSONB NOT NULL,
    "tags" TEXT[],
    "team" TEXT[],
    "duration" TEXT,
    "externalLinks" JSONB NOT NULL,
    "downloadLinks" JSONB NOT NULL,
    "client" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
