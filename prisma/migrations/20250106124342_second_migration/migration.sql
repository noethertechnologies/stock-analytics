/*
  Warnings:

  - You are about to drop the `BoardMeeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CorporateAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinancialResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecurityWiseDp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShareholdingsPattern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BoardMeeting" DROP CONSTRAINT "BoardMeeting_symbol_fkey";

-- DropForeignKey
ALTER TABLE "CorporateAction" DROP CONSTRAINT "CorporateAction_symbol_fkey";

-- DropForeignKey
ALTER TABLE "FinancialResult" DROP CONSTRAINT "FinancialResult_symbol_fkey";

-- DropForeignKey
ALTER TABLE "SecurityWiseDp" DROP CONSTRAINT "SecurityWiseDp_symbol_fkey";

-- DropForeignKey
ALTER TABLE "ShareholdingsPattern" DROP CONSTRAINT "ShareholdingsPattern_symbol_fkey";

-- DropForeignKey
ALTER TABLE "TradeInfo" DROP CONSTRAINT "TradeInfo_symbol_fkey";

-- DropTable
DROP TABLE "BoardMeeting";

-- DropTable
DROP TABLE "CorporateAction";

-- DropTable
DROP TABLE "FinancialResult";

-- DropTable
DROP TABLE "SecurityWiseDp";

-- DropTable
DROP TABLE "ShareholdingsPattern";

-- DropTable
DROP TABLE "TradeInfo";
