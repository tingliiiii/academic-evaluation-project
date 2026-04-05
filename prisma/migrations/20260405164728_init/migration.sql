-- CreateTable
CREATE TABLE "wisdoms" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wisdoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "toneId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_wisdoms" (
    "evaluationId" TEXT NOT NULL,
    "wisdomId" TEXT NOT NULL,

    CONSTRAINT "evaluation_wisdoms_pkey" PRIMARY KEY ("evaluationId","wisdomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "wisdoms_content_key" ON "wisdoms"("content");

-- CreateIndex
CREATE UNIQUE INDEX "tones_name_key" ON "tones"("name");

-- CreateIndex
CREATE INDEX "evaluations_studentId_idx" ON "evaluations"("studentId");

-- CreateIndex
CREATE INDEX "evaluations_toneId_idx" ON "evaluations"("toneId");

-- CreateIndex
CREATE INDEX "evaluations_createdAt_idx" ON "evaluations"("createdAt");

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_toneId_fkey" FOREIGN KEY ("toneId") REFERENCES "tones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_wisdoms" ADD CONSTRAINT "evaluation_wisdoms_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_wisdoms" ADD CONSTRAINT "evaluation_wisdoms_wisdomId_fkey" FOREIGN KEY ("wisdomId") REFERENCES "wisdoms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
