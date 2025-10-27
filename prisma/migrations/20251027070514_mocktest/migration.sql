-- CreateEnum
CREATE TYPE "public"."Subject" AS ENUM ('quantitative', 'logical_reasoning', 'verbal', 'programming', 'general_knowledge', 'technical');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "public"."TestStatus" AS ENUM ('draft', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" "public"."Subject" NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "totalQuestions" INTEGER NOT NULL DEFAULT 20,
    "status" "public"."TestStatus" NOT NULL DEFAULT 'draft',
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT true,
    "score" INTEGER,
    "correctAnswers" INTEGER,
    "wrongAnswers" INTEGER,
    "timeTakenMinutes" INTEGER,
    "weakAreas" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
