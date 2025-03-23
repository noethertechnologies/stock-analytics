import NseIndia from "../../utils/nse";
import { PrismaClient } from "@prisma/client";

const nse = new NseIndia();
const prisma = new PrismaClient();

// Helper function to parse and validate dates
const parseDate = (date) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

// Helper function to parse and validate floats
const parseFloatOrNull = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    // Get the list of stock symbols (from API or any other source)
    const symbols = await nse.getAllStockSymbols();

    // Process each symbol: if the data exists in the DB, use it;
    // otherwise, fetch from the API and upsert into the DB.
    const stockDataPromises = symbols.map(async (symbol) => {
      try {
        // Check if we already have data in the DB for this symbol.
        const [equityInfo, equityPriceInfo] = await Promise.all([
          prisma.equityInfo.findUnique({ where: { symbol } }),
          prisma.equityPriceInfo.findUnique({ where: { symbol } }),
        ]);

        if (equityInfo && equityPriceInfo) {
          // Data found in DB – return the values needed by the frontend.
          return {
            symbol: equityInfo.symbol,
            companyName: equityInfo.companyName,
            industry: equityInfo.industry,
            isin: equityInfo.isin,
            lastPrice: equityPriceInfo.lastPrice,
            change: equityPriceInfo.change,
          };
        } else {
          // Data not found in DB – fetch it from the API.
          const equityDetails = await nse.getEquityDetails(symbol);
          const listingDate = parseDate(equityDetails.metadata.listingDate);
          const lastUpdateTime = parseDate(equityDetails.metadata.lastUpdateTime);

          // Upsert data in all related tables in a transaction.
          await prisma.$transaction([
            prisma.equityInfo.upsert({
              where: { symbol },
              update: {
                companyName: equityDetails.info.companyName,
                industry: equityDetails.info.industry,
                isin: equityDetails.info.isin,
                slbIsin: equityDetails.info.slbIsin || null,
              },
              create: {
                symbol,
                companyName: equityDetails.info.companyName,
                industry: equityDetails.info.industry,
                isin: equityDetails.info.isin,
                slbIsin: equityDetails.info.slbIsin || null,
              },
            }),
            prisma.equityMetadata.upsert({
              where: { symbol },
              update: {
                series: equityDetails.metadata.series || null,
                isin: equityDetails.metadata.isin || null,
                status: equityDetails.metadata.status || null,
                listingDate,
                industry: equityDetails.metadata.industry || null,
                lastUpdateTime,
                pdSectorPe: parseFloatOrNull(equityDetails.metadata.pdSectorPe),
                pdSymbolPe: parseFloatOrNull(equityDetails.metadata.pdSymbolPe),
                pdSectorInd: equityDetails.metadata.pdSectorInd || null,
              },
              create: {
                symbol,
                series: equityDetails.metadata.series || null,
                isin: equityDetails.metadata.isin || null,
                status: equityDetails.metadata.status || null,
                listingDate,
                industry: equityDetails.metadata.industry || null,
                lastUpdateTime,
                pdSectorPe: parseFloatOrNull(equityDetails.metadata.pdSectorPe),
                pdSymbolPe: parseFloatOrNull(equityDetails.metadata.pdSymbolPe),
                pdSectorInd: equityDetails.metadata.pdSectorInd || null,
              },
            }),
            prisma.equityPriceInfo.upsert({
              where: { symbol },
              update: {
                lastPrice: parseFloatOrNull(equityDetails.priceInfo?.lastPrice),
                change: parseFloatOrNull(equityDetails.priceInfo?.change),
                pChange: parseFloatOrNull(equityDetails.priceInfo?.pChange),
                previousClose: parseFloatOrNull(equityDetails.priceInfo?.previousClose),
                open: parseFloatOrNull(equityDetails.priceInfo?.open),
                close: parseFloatOrNull(equityDetails.priceInfo?.close),
                vwap: parseFloatOrNull(equityDetails.priceInfo?.vwap),
                stockIndClosePrice: parseFloatOrNull(equityDetails.priceInfo?.stockIndClosePrice),
                lowerCp: equityDetails.priceInfo?.lowerCP || null,
                upperCp: equityDetails.priceInfo?.upperCP || null,
                pPriceBand: equityDetails.priceInfo?.pPriceBand || null,
                basePrice: parseFloatOrNull(equityDetails.priceInfo?.basePrice),
                min: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.min),
                max: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.max),
                intradayHighLowValue: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.value),
                weekHighLowMin: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.min),
                weekHighLowMinDate: parseDate(equityDetails.priceInfo?.weekHighLow?.minDate),
                weekHighLowMax: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.max),
                weekHighLowMaxDate: parseDate(equityDetails.priceInfo?.weekHighLow?.maxDate),
                weekHighLowValue: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.value),
                iNavValue: parseFloatOrNull(equityDetails.priceInfo?.iNavValue),
                checkINav: equityDetails.priceInfo?.checkINAV || null,
                tickSize: parseFloatOrNull(equityDetails.priceInfo?.tickSize),
              },
              create: {
                symbol,
                lastPrice: parseFloatOrNull(equityDetails.priceInfo?.lastPrice),
                change: parseFloatOrNull(equityDetails.priceInfo?.change),
                pChange: parseFloatOrNull(equityDetails.priceInfo?.pChange),
                previousClose: parseFloatOrNull(equityDetails.priceInfo?.previousClose),
                open: parseFloatOrNull(equityDetails.priceInfo?.open),
                close: parseFloatOrNull(equityDetails.priceInfo?.close),
                vwap: parseFloatOrNull(equityDetails.priceInfo?.vwap),
                stockIndClosePrice: parseFloatOrNull(equityDetails.priceInfo?.stockIndClosePrice),
                lowerCp: equityDetails.priceInfo?.lowerCP || null,
                upperCp: equityDetails.priceInfo?.upperCP || null,
                pPriceBand: equityDetails.priceInfo?.pPriceBand || null,
                basePrice: parseFloatOrNull(equityDetails.priceInfo?.basePrice),
                min: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.min),
                max: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.max),
                intradayHighLowValue: parseFloatOrNull(equityDetails.priceInfo?.intraDayHighLow?.value),
                weekHighLowMin: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.min),
                weekHighLowMinDate: parseDate(equityDetails.priceInfo?.weekHighLow?.minDate),
                weekHighLowMax: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.max),
                weekHighLowMaxDate: parseDate(equityDetails.priceInfo?.weekHighLow?.maxDate),
                weekHighLowValue: parseFloatOrNull(equityDetails.priceInfo?.weekHighLow?.value),
                iNavValue: parseFloatOrNull(equityDetails.priceInfo?.iNavValue),
                checkINav: equityDetails.priceInfo?.checkINAV || null,
                tickSize: parseFloatOrNull(equityDetails.priceInfo?.tickSize),
              },
            }),
            prisma.equityIndustryInfo.upsert({
              where: { symbol },
              update: {
                macro: equityDetails.industryInfo?.macro || null,
                sector: equityDetails.industryInfo?.sector || null,
                industry: equityDetails.industryInfo?.industry || null,
                basicIndustry: equityDetails.industryInfo?.basicIndustry || null,
              },
              create: {
                symbol,
                macro: equityDetails.industryInfo?.macro || null,
                sector: equityDetails.industryInfo?.sector || null,
                industry: equityDetails.industryInfo?.industry || null,
                basicIndustry: equityDetails.industryInfo?.basicIndustry || null,
              },
            }),
          ]);

          // Return the freshly fetched data.
          return {
            symbol,
            companyName: equityDetails.info.companyName,
            industry: equityDetails.info.industry,
            isin: equityDetails.info.isin,
            lastPrice: parseFloatOrNull(equityDetails.priceInfo?.lastPrice),
            change: parseFloatOrNull(equityDetails.priceInfo?.change),
          };
        }
      } catch (error) {
        console.error(`Error processing symbol ${symbol}:`, error);
        return null;
      }
    });

    // Wait for all symbols to be processed and filter out any failures.
    const stockData = (await Promise.all(stockDataPromises)).filter(Boolean);
    return res.status(200).json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res.status(500).json({ error: "Failed to fetch stock data." });
  } finally {
    await prisma.$disconnect();
  }
}
