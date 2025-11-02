import { useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import type { IChartApi, ISeriesApi } from "lightweight-charts";

// Mock data for PoC
const lineData = [
  { time: "2019-04-11" as const, value: 80.01 },
  { time: "2019-04-12" as const, value: 96.63 },
  { time: "2019-04-13" as const, value: 76.64 },
  { time: "2019-04-14" as const, value: 81.89 },
  { time: "2019-04-15" as const, value: 74.43 },
  { time: "2019-04-16" as const, value: 80.01 },
];

export function CryptoChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

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
    });

    // Create line series
    // lightweight-charts v5 API - pass LineSeries directly
    const lineSeries = chart.addSeries(LineSeries) as ISeriesApi<"Line">;

    // Apply options to the series
    lineSeries.applyOptions({
      color: "#3b82f6",
      lineWidth: 2,
    });

    // Set data
    lineSeries.setData(lineData);

    chartRef.current = chart;
    seriesRef.current = lineSeries;

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
  }, []);

  return (
    <div
      className="chart-container"
      ref={chartContainerRef}
      style={{ height: "600px", width: "100%" }}
    >
      {/* Chart will be rendered here */}
    </div>
  );
}
