-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "url" TEXT,
    "isTesting" BOOLEAN NOT NULL DEFAULT false,
    "autoPhoneMode" BOOLEAN NOT NULL DEFAULT false,
    "randomRedirect" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT,
    "productTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_countryId_idx" ON "Project"("countryId");

-- CreateIndex
CREATE INDEX "Project_productTypeId_idx" ON "Project"("productTypeId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
