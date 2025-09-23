-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('applied', 'under_review', 'interview_scheduled', 'rejected', 'offer_received', 'accepted');

-- CreateEnum
CREATE TYPE "public"."ApplicationType" AS ENUM ('internship', 'full_time', 'part_time', 'contract');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3),
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'applied',
    "applicationType" "public"."ApplicationType" NOT NULL DEFAULT 'full_time',
    "recruiterName" TEXT,
    "recruiterEmail" TEXT,
    "jobDescription" TEXT,
    "salaryRange" TEXT,
    "interviewDate" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "priority" "public"."Priority" NOT NULL DEFAULT 'medium',
    "applicationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
