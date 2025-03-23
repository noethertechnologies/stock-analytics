"use client";

import React, { useEffect, useState } from "react";

interface StockData {
  symbol: string;
  companyName: string;
  industry: string;
  lastPrice: number;
  change: number;
  pChange: number;
  previousClose: number;
  marketCap: number;
  yearHigh: number;
  yearLow: number;
}

const NiftyView: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const fetchStockData = async () => {
    try {
      const response = await fetch("/api/stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      setStockData(data);
      setLoading(false);
    } catch  {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg font-semibold text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-lg font-semibold text-red-500">Error: {error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Stock Data
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full border-collapse bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Symbol</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Company Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b">Industry</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Last Price</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Change</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">% Change</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Previous Close</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Market Cap (B)</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Year High</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b">Year Low</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((data, index) => (
              <tr
                key={data.symbol}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-left font-medium text-gray-800 border-b">
                  {data.symbol}
                </td>
                <td className="px-6 py-4 text-left text-gray-700 border-b">
                  {data.companyName}
                </td>
                <td className="px-6 py-4 text-left text-gray-700 border-b">
                  {data.industry}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 font-medium border-b">
                  {data.lastPrice.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-medium border-b ${
                    data.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.change.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-medium border-b ${
                    data.pChange > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {data.pChange.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right text-gray-700 border-b">
                  {data.previousClose.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 border-b">
                  {(data.marketCap / 1e9).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 border-b">
                  {data.yearHigh.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-700 border-b">
                  {data.yearLow.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NiftyView;