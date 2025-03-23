"use client";
import { useEffect, useState } from "react";

interface StockData {
  symbol: string;
  companyName: string;
  industry: string;
  isin: string;
  lastPrice: number | null;
  change: number | null;
}

const DashboardPage = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stocks");
        if (!response.ok) throw new Error("Failed to fetch stock data");
        const data: StockData[] = await response.json();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!stockData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">Stock Data Dashboard</h1>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Symbol</th>
            <th className="border border-gray-300 px-4 py-2">Company Name</th>
            <th className="border border-gray-300 px-4 py-2">Industry</th>
            <th className="border border-gray-300 px-4 py-2">ISIN</th>
            <th className="border border-gray-300 px-4 py-2">Last Price</th>
            <th className="border border-gray-300 px-4 py-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock) => (
            <tr key={stock.symbol}>
              <td className="border border-gray-300 px-4 py-2">{stock.symbol}</td>
              <td className="border border-gray-300 px-4 py-2">{stock.companyName}</td>
              <td className="border border-gray-300 px-4 py-2">{stock.industry}</td>
              <td className="border border-gray-300 px-4 py-2">{stock.isin}</td>
              <td className="border border-gray-300 px-4 py-2">
                {stock.lastPrice !== null ? stock.lastPrice.toFixed(2) : "N/A"}
              </td>
              <td
                className={`border border-gray-300 px-4 py-2 font-bold ${
                  stock.change && stock.change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.change !== null ? stock.change.toFixed(2) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
