-- AlterTable
ALTER TABLE "Dealer"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "defaultDealerKickback" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3); -- ✅ сначала nullable

-- ✅ заполнить существующие строки
UPDATE "Dealer"
SET "updatedAt" = NOW()
WHERE "updatedAt" IS NULL;

-- ✅ теперь можно сделать NOT NULL
ALTER TABLE "Dealer"
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Dealer_isActive_idx" ON "Dealer"("isActive");
