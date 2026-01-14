-- CreateTable
CREATE TABLE "PriceVersion" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceRow" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rb_buy" INTEGER NOT NULL DEFAULT 0,
    "price_rb" INTEGER NOT NULL DEFAULT 0,
    "otkat_rb" INTEGER NOT NULL DEFAULT 0,
    "otkat_rb_d" INTEGER NOT NULL DEFAULT 0,
    "delivery_c_br" INTEGER NOT NULL DEFAULT 0,
    "delivery_c_usd" INTEGER NOT NULL DEFAULT 0,
    "delivery_r_br" INTEGER NOT NULL DEFAULT 0,
    "delivery_r_usd" INTEGER NOT NULL DEFAULT 0,
    "price_delivery_br" INTEGER NOT NULL DEFAULT 0,
    "ru_buy" INTEGER NOT NULL DEFAULT 0,
    "price_ru" INTEGER NOT NULL DEFAULT 0,
    "otkat_ru" INTEGER NOT NULL DEFAULT 0,
    "otkat_ru_d" INTEGER NOT NULL DEFAULT 0,
    "delivery_ru_ru" INTEGER NOT NULL DEFAULT 0,
    "delivery_ru_usd" INTEGER NOT NULL DEFAULT 0,
    "price_delivery_ru" INTEGER NOT NULL DEFAULT 0,
    "koef" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceVersion_version_key" ON "PriceVersion"("version");

-- CreateIndex
CREATE INDEX "PriceVersion_date_idx" ON "PriceVersion"("date");

-- CreateIndex
CREATE INDEX "PriceVersion_isActive_idx" ON "PriceVersion"("isActive");

-- CreateIndex
CREATE INDEX "PriceRow_versionId_idx" ON "PriceRow"("versionId");

-- CreateIndex
CREATE INDEX "PriceRow_product_id_idx" ON "PriceRow"("product_id");

-- CreateIndex
CREATE INDEX "PriceRow_name_idx" ON "PriceRow"("name");

-- AddForeignKey
ALTER TABLE "PriceRow" ADD CONSTRAINT "PriceRow_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "PriceVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
