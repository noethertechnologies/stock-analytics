// api/socket.js
import { Server } from "socket.io";
import NseIndia from "../../utils/nse";

const nse = new NseIndia();

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("subscribeToSymbols", async (symbols) => {
        const fetchStockData = async () => {
          const stockDataPromises = symbols.map(async (symbol) => {
            try {
              const equityDetails = await nse.getEquityDetails(symbol);
              const tradeInfo = await nse.getEquityTradeInfo(symbol);
              const corporateInfo = await nse.getEquityCorporateInfo(symbol);
              const intradayData = await nse.getEquityIntradayData(symbol);
              
              
              return {
                symbol,
                equityDetails,
                tradeInfo,
                corporateInfo,
                intradayData,
              };
              
            } catch (error) {
              console.error(`Error fetching data for symbol: ${symbol}`, error);
              return null;
            }
          });

          const stockData = await Promise.all(stockDataPromises);
          
          socket.emit("stockData", stockData.filter((data) => data !== null));
        };

        const intervalId = setInterval(fetchStockData, 5000);
        
        socket.on("disconnect", () => {
          clearInterval(intervalId);
        });
      });
    });
  }

  res.end();
};

export default SocketHandler;
