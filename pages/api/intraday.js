import NseIndia from "../../utils/nse";

const nse = new NseIndia();

const handler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const niftyData = await nse.getIndexIntradayData("NIFTY", true);

    const processedData = niftyData.data.map((item) => ({
      symbol: item.metadata.symbol,
      lastPrice: item.metadata.lastPrice,
      change: item.metadata.change,
      pChange: item.metadata.pChange,
      previousClose: item.metadata.previousClose,
      marketCap: item.metadata.marketCap,
      yearHigh: item.metadata.yearHigh,
      yearLow: item.metadata.yearLow,
    }));

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Error fetching Nifty data:", error);
    res.status(500).json({ error: "Failed to fetch Nifty data" });
  }
};

export default handler;
