import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import type { IChartApi, ISeriesApi } from "lightweight-charts";
import { useQuery } from "@tanstack/react-query";

export type TimeFrame = "1d" | "15m" | "5m";

interface CryptoChartProps {
  timeFrame: TimeFrame;
}

// Binance API에서 BTCUSDT.P 캔들 데이터 가져오기
async function fetchBTCUSDTData(timeFrame: TimeFrame) {
  try {
    // Binance 시간 프레임 매핑
    const intervalMap: Record<TimeFrame, string> = {
      "1d": "1d",
      "15m": "15m",
      "5m": "5m",
    };

    const interval = intervalMap[timeFrame];
    const response = await fetch(
      `https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=${interval}&limit=500`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch BTCUSDT data");
    }
    const data = await response.json();
    
    // lightweight-charts 캔들 형식으로 변환
    return data.map((item: any[]) => ({
      time: (item[0] / 1000) as any, // timestamp를 초 단위로 변환
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  } catch (error) {
    console.error("Error fetching BTCUSDT data:", error);
    throw error;
  }
}

export function CryptoChart({ timeFrame }: CryptoChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // React Query로 BTCUSDT.P 데이터 가져오기
  const { data: chartData, error, refetch } = useQuery({
    queryKey: ["btcusdt-chart", timeFrame],
    queryFn: () => fetchBTCUSDTData(timeFrame),
    refetchInterval: 60000, // 1분마다 데이터 갱신
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!chartData) return;

    // 기존 차트 제거
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1a1a1a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#2a2a2a" },
        horzLines: { color: "#2a2a2a" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries) as ISeriesApi<"Candlestick">;

    // Apply options to the series
    candlestickSeries.applyOptions({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // Set data
    candlestickSeries.setData(chartData);

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [chartData, timeFrame]);

  // 시간 프레임 변경 시 데이터 재요청
  useEffect(() => {
    refetch();
  }, [timeFrame, refetch]);

  return (
    <div
      className="chart-container"
      ref={chartContainerRef}
      style={{ height: "600px", width: "100%" }}
    >
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "#d1d5db",
          }}
        >
          Loading BTCUSDT.P chart ({timeFrame})...
        </div>
      )}
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "#ef4444",
          }}
        >
          Error loading chart data. Please try again later.
        </div>
      )}
    </div>
  );
}
