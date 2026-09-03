-- DropForeignKey
ALTER TABLE "CrmPipelineStage" DROP CONSTRAINT "CrmPipelineStage_pipelineId_fkey";

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "announcementMessage" TEXT,
    "announcementCtaLabel" TEXT,
    "announcementCtaUrl" TEXT,
    "announcementActive" BOOLEAN NOT NULL DEFAULT false,
    "eventTitle" TEXT,
    "eventStartsAt" TIMESTAMP(3),
    "eventLocation" TEXT,
    "eventCapacity" INTEGER,
    "eventRegisterUrl" TEXT,
    "newsTitle" TEXT,
    "newsSourceLabel" TEXT,
    "newsSourceUrl" TEXT,
    "sponsorTitle" TEXT,
    "sponsorSubtitle" TEXT,
    "sponsorCtaUrl" TEXT,
    "sponsorActive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CrmPipelineStage" ADD CONSTRAINT "CrmPipelineStage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "CrmPipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
