import NseIndia from "../../utils/nse";
import { GoogleGenerativeAI } from "@google/generative-ai";

const nse = new NseIndia();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: "Symbols are missing or invalid." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key is not configured." });
    }

    // Initialize Google Generative AI with the API key and model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Process each stock symbol
    const stockDataPromises = symbols.map(async (symbol) => {
      const equityDetails = await nse.getEquityDetails(symbol);
      const tradeInfo = await nse.getEquityTradeInfo(symbol);
      const corporateInfo = await nse.getEquityCorporateInfo(symbol);

      const stockDetails = {
        symbol,
        equityDetails,
        tradeInfo,
        corporateInfo,
      };

      const message = `Please summarize and evaluate the following stock data to determine if ${symbol} is a good investment: ${JSON.stringify(
        stockDetails
      )}`;

      // Generate the analysis using Google Generative AI
      const result = await model.generateContent(message);

      return {
        symbol,
        stockData: stockDetails,
        analysis: result.response.text(),
      };
    });

    const stockDataWithAnalysis = await Promise.all(stockDataPromises);
    res.status(200).json(stockDataWithAnalysis);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data." });
  }
}
