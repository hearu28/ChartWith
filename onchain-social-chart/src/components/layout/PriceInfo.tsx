import { useQuery } from "@tanstack/react-query";

interface PriceData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

async function fetchPriceData(): Promise<PriceData> {
  const response = await fetch(
    "https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }
  const data = await response.json();

  const price = parseFloat(data.lastPrice);
  const prevPrice = parseFloat(data.prevClosePrice);
  const priceChange = price - prevPrice;
  const priceChangePercentNum = (priceChange / prevPrice) * 100;
  const priceChangePercent = priceChangePercentNum.toFixed(2);

  return {
    symbol: "BTC-USD",
    price: price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    priceChange:
      priceChange >= 0
        ? `+${priceChange.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : priceChange.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
    priceChangePercent:
      priceChangePercentNum >= 0
        ? `+${priceChangePercent}%`
        : `${priceChangePercent}%`,
    highPrice: parseFloat(data.highPrice).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    lowPrice: parseFloat(data.lowPrice).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    volume: parseFloat(data.volume).toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }),
  };
}

export function PriceInfo() {
  const { data, isLoading } = useQuery({
    queryKey: ["btc-price"],
    queryFn: fetchPriceData,
    refetchInterval: 5000, // 5초마다 갱신
  });

  if (isLoading || !data) {
    return (
      <div className="price-info">
        <div className="price-symbol">BTC-USD</div>
        <div className="price-loading">Loading...</div>
      </div>
    );
  }

  const isPositive =
    parseFloat(data.priceChangePercent.replace("%", "").replace("+", "")) >= 0;

  return (
    <div className="price-info">
      <div className="price-symbol">{data.symbol}</div>
      <div className="price-main">
        <span className="price-value">{data.price}</span>
        <span
          className={`price-change ${isPositive ? "positive" : "negative"}`}
        >
          {data.priceChange} ({data.priceChangePercent})
        </span>
      </div>
      <div className="price-stats">
        <span className="stat-item">
          24h High <strong>{data.highPrice}</strong>
        </span>
        <span className="stat-item">
          24h Low <strong>{data.lowPrice}</strong>
        </span>
        <span className="stat-item">
          24h Vol <strong>{data.volume}</strong>
        </span>
      </div>
    </div>
  );
}
