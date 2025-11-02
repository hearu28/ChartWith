import { Header } from "./Header";
import { CryptoChart } from "../chart/CryptoChart";
import { SocialOverlay } from "../chat/SocialOverlay";
import "../../styles/Layout.css"; // CSS for layout

export function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* 
          A wrapper for the chart and social overlay.
          Use `position: relative;` in CSS to provide a reference point for the overlay.
        */}
        <div className="chart-social-wrapper">
          <CryptoChart />
          <SocialOverlay />
        </div>
      </main>
    </div>
  );
}
