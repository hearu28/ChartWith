import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import type { IChartApi, ISeriesApi } from "lightweight-charts";
import { useQuery } from "@tanstack/react-query";

export type TimeFrame = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

interface CryptoChartProps {
  timeFrame: TimeFrame;
}

// Binance API에서 BTCUSDT.P 캔들 데이터 가져오기
async function fetchBTCUSDTData(timeFrame: TimeFrame) {
  try {
    // Binance 시간 프레임 매핑
    const intervalMap: Record<TimeFrame, string> = {
      "1m": "1m",
      "5m": "5m",
      "15m": "15m",
      "1h": "1h",
      "4h": "4h",
      "1d": "1d",
    };

    const interval = intervalMap[timeFrame];
    const maxLimit = 1500; // Binance API 최대 limit

    // 첫 번째 요청: 최신 데이터 (1500개)
    const recentResponse = await fetch(
      `https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=${interval}&limit=${maxLimit}`
    );
    if (!recentResponse.ok) {
      throw new Error("Failed to fetch BTCUSDT data");
    }
    const recentData = await recentResponse.json();

    // 두 번째 요청: 과거 데이터 (1500개) - 첫 번째 요청의 가장 오래된 데이터 이전
    // 타임프레임별 interval 시간 계산 (밀리초)
    const intervalMsMap: Record<TimeFrame, number> = {
      "1m": 60 * 1000,
      "5m": 5 * 60 * 1000,
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "4h": 4 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
    };

    const intervalMs = intervalMsMap[timeFrame];
    const oldestTimestamp = recentData[0]?.[0]; // 첫 번째 캔들의 타임스탬프
    const endTime = oldestTimestamp
      ? oldestTimestamp - intervalMs
      : Date.now() - maxLimit * intervalMs;

    let historicalData: any[] = [];
    try {
      const historicalResponse = await fetch(
        `https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=${interval}&limit=${maxLimit}&endTime=${endTime}`
      );
      if (historicalResponse.ok) {
        historicalData = await historicalResponse.json();
      } else {
        console.warn("Failed to fetch historical data, using recent data only");
      }
    } catch (historicalError) {
      console.warn(
        "Error fetching historical data, using recent data only:",
        historicalError
      );
    }

    // 데이터 합치기 (시간순 정렬)
    const allData =
      historicalData.length > 0
        ? [...historicalData, ...recentData]
        : recentData;

    // 중복 제거 및 정렬 (타임스탬프 기준)
    const uniqueDataMap = new Map<number, any[]>();
    allData.forEach((item: any[]) => {
      const timestamp = item[0];
      if (!uniqueDataMap.has(timestamp)) {
        uniqueDataMap.set(timestamp, item);
      }
    });

    const sortedData = Array.from(uniqueDataMap.values()).sort(
      (a, b) => a[0] - b[0]
    );

    // lightweight-charts 캔들 형식으로 변환
    return sortedData.map((item: any[]) => ({
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

  // React Query로 BTCUSDT.P 데이터 가져오기
  const {
    data: chartData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["btcusdt-chart", timeFrame],
    queryFn: () => fetchBTCUSDTData(timeFrame),
    refetchInterval: 60000, // 1분마다 데이터 갱신
    retry: 3, // 에러 발생 시 3번 재시도
    retryDelay: 1000, // 재시도 간격 1초
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (!chartData || chartData.length === 0) return;

    try {
      // 기존 차트 안전하게 제거
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (removeError) {
          console.warn("Error removing existing chart:", removeError);
        }
        chartRef.current = null;
      }
      seriesRef.current = null;

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
          secondsVisible: timeFrame === "1m" || timeFrame === "5m", // 1분봉, 5분봉일 때만 초 표시
        },
      });

      // Create candlestick series
      const candlestickSeries = chart.addSeries(
        CandlestickSeries
      ) as ISeriesApi<"Candlestick">;

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

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          try {
            chartRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: chartContainerRef.current.clientHeight,
            });
          } catch (resizeError) {
            console.warn("Error resizing chart:", resizeError);
          }
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          try {
            chartRef.current.remove();
          } catch (cleanupError) {
            console.warn("Error cleaning up chart:", cleanupError);
          }
          chartRef.current = null;
        }
        seriesRef.current = null;
      };
    } catch (chartError) {
      console.error("Error creating chart:", chartError);
      // 에러 발생 시 차트 참조 초기화
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (removeError) {
          console.warn("Error removing chart after error:", removeError);
        }
        chartRef.current = null;
      }
      seriesRef.current = null;
    }
  }, [chartData, timeFrame]);

  // 시간 프레임 변경 시 데이터 재요청
  useEffect(() => {
    // 타임프레임 변경 시 기존 차트 정리
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (removeError) {
        console.warn("Error removing chart on timeframe change:", removeError);
      }
      chartRef.current = null;
    }
    seriesRef.current = null;

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
