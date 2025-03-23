-- CreateTable
CREATE TABLE "EquityInfo" (
    "symbol" VARCHAR(10) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "industry" VARCHAR(255) NOT NULL,
    "isin" VARCHAR(255) NOT NULL,
    "slbIsin" VARCHAR(255),

    CONSTRAINT "EquityInfo_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "EquityMetadata" (
    "symbol" VARCHAR(10) NOT NULL,
    "series" VARCHAR(255) NOT NULL,
    "isin" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "listingDate" TIMESTAMP(3),
    "industry" VARCHAR(255) NOT NULL,
    "lastUpdateTime" TIMESTAMP(3),
    "pdSectorPe" DOUBLE PRECISION,
    "pdSymbolPe" DOUBLE PRECISION,
    "pdSectorInd" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "EquityPriceInfo" (
    "symbol" VARCHAR(10) NOT NULL,
    "lastPrice" DOUBLE PRECISION,
    "change" DOUBLE PRECISION,
    "pChange" DOUBLE PRECISION,
    "previousClose" DOUBLE PRECISION,
    "open" DOUBLE PRECISION,
    "close" DOUBLE PRECISION,
    "vwap" DOUBLE PRECISION,
    "stockIndClosePrice" DOUBLE PRECISION,
    "lowerCp" VARCHAR(255),
    "upperCp" VARCHAR(255),
    "pPriceBand" VARCHAR(255),
    "basePrice" DOUBLE PRECISION,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,
    "intradayHighLowValue" DOUBLE PRECISION,
    "weekHighLowMin" DOUBLE PRECISION,
    "weekHighLowMinDate" TIMESTAMP(3),
    "weekHighLowMax" DOUBLE PRECISION,
    "weekHighLowMaxDate" TIMESTAMP(3),
    "weekHighLowValue" DOUBLE PRECISION,
    "iNavValue" DOUBLE PRECISION,
    "checkINav" BOOLEAN,
    "tickSize" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "EquityIndustryInfo" (
    "symbol" VARCHAR(10) NOT NULL,
    "macro" VARCHAR(255),
    "sector" VARCHAR(255),
    "industry" VARCHAR(255),
    "basicIndustry" VARCHAR(255)
);

-- CreateTable
CREATE TABLE "TradeInfo" (
    "symbol" VARCHAR(10) NOT NULL,
    "noBlockDeals" BOOLEAN,
    "bulkBlockDealsName" TEXT[],
    "totalBuyQuantity" BIGINT,
    "totalSellQuantity" BIGINT,
    "totalTradedVolume" DOUBLE PRECISION,
    "totalTradedValue" DOUBLE PRECISION,
    "totalMarketCap" DOUBLE PRECISION,
    "ffmc" DOUBLE PRECISION,
    "impactCost" DOUBLE PRECISION,
    "cmDailyVolatility" VARCHAR(255),
    "cmAnnualVolatility" VARCHAR(255),
    "marketLot" VARCHAR(255),
    "activeSeries" VARCHAR(255),
    "securityVar" DOUBLE PRECISION,
    "indexVar" DOUBLE PRECISION,
    "varMargin" DOUBLE PRECISION,
    "extremeLossMargin" DOUBLE PRECISION,
    "adhocMargin" DOUBLE PRECISION,
    "applicableMargin" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "SecurityWiseDp" (
    "symbol" VARCHAR(10) NOT NULL,
    "quantityTraded" BIGINT,
    "deliveryQuantity" BIGINT,
    "deliveryToTradedQuantity" DOUBLE PRECISION,
    "seriesRemarks" VARCHAR(255),
    "secWiseDelPosDate" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "CorporateAction" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "exdate" TIMESTAMP(3) NOT NULL,
    "purpose" VARCHAR(255) NOT NULL,

    CONSTRAINT "CorporateAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareholdingsPattern" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "promoterAndPromoterGroup" DOUBLE PRECISION,
    "public" DOUBLE PRECISION,
    "sharesHeldByEmployeeTrusts" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,

    CONSTRAINT "ShareholdingsPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialResult" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "expenditure" DOUBLE PRECISION,
    "income" DOUBLE PRECISION,
    "audited" VARCHAR(255),
    "cumulative" VARCHAR(255),
    "consolidated" VARCHAR(255),
    "reDilEps" DOUBLE PRECISION,
    "reProLossBefTax" DOUBLE PRECISION,
    "proLossAftTax" DOUBLE PRECISION,
    "reBroadcastTimestamp" TIMESTAMP(3),
    "xbrlAttachment" VARCHAR(255),
    "naAttachment" VARCHAR(255),

    CONSTRAINT "FinancialResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardMeeting" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "purpose" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EquityMetadata_symbol_key" ON "EquityMetadata"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "EquityPriceInfo_symbol_key" ON "EquityPriceInfo"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "EquityIndustryInfo_symbol_key" ON "EquityIndustryInfo"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "TradeInfo_symbol_key" ON "TradeInfo"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityWiseDp_symbol_key" ON "SecurityWiseDp"("symbol");

-- AddForeignKey
ALTER TABLE "EquityMetadata" ADD CONSTRAINT "EquityMetadata_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquityPriceInfo" ADD CONSTRAINT "EquityPriceInfo_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquityIndustryInfo" ADD CONSTRAINT "EquityIndustryInfo_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeInfo" ADD CONSTRAINT "TradeInfo_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityWiseDp" ADD CONSTRAINT "SecurityWiseDp_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporateAction" ADD CONSTRAINT "CorporateAction_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareholdingsPattern" ADD CONSTRAINT "ShareholdingsPattern_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialResult" ADD CONSTRAINT "FinancialResult_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardMeeting" ADD CONSTRAINT "BoardMeeting_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "EquityInfo"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
