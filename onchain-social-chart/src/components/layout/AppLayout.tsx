import { useState } from "react";
import { Header } from "./Header";
import { CryptoChart } from "../chart/CryptoChart";
import { SocialOverlay } from "../chat/SocialOverlay";
import "../../styles/Layout.css";
import type { TimeFrame } from "../chart/CryptoChart";

export function AppLayout() {
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1d");

  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setClickPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="app-container">
      <Header 
        timeFrame={timeFrame}
        onTimeFrameChange={setTimeFrame}
      />
      <main className="main-content">
        <div className="chart-social-wrapper" onClick={handleChartClick}>
          <CryptoChart timeFrame={timeFrame} />
          <SocialOverlay 
            clickPosition={clickPosition}
            onClearClickPosition={() => setClickPosition(null)}
          />
        </div>
      </main>
    </div>
  );
}
