import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import "../../styles/Layout.css"; // Includes header styles
import type { TimeFrame } from "../chart/CryptoChart";
import { PriceInfo } from "./PriceInfo";

interface HeaderProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export function Header({ timeFrame, onTimeFrameChange }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <PriceInfo />
      </div>
      <div className="header-right">
        <div className="timeframe-buttons">
          {(["1m", "5m", "15m", "1h", "4h", "1d"] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${timeFrame === tf ? "active" : ""}`}
              onClick={() => onTimeFrameChange(tf)}
            >
              {tf === "1m"
                ? "1M"
                : tf === "5m"
                ? "5M"
                : tf === "15m"
                ? "15M"
                : tf === "1h"
                ? "1H"
                : tf === "4h"
                ? "4H"
                : "1D"}
            </button>
          ))}
        </div>
        {/* 
          Use OnchainKit's Wallet component.
          <Wallet> is the container that manages the connect button and dropdown menu.
        */}
        <Wallet>
          {/* 
            <ConnectWallet> is the actual connect button UI.
            Customize the connected state UI by passing children components.
            Change the pre-connection text with the `disconnectedLabel` prop.
          */}
          <ConnectWallet disconnectedLabel="Connect Wallet">
            {/* When connected, the Avatar and Name (Basename/ENS) are displayed */}
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>

          {/* <WalletDropdown> is the menu that appears when the button is clicked after connecting  */}
          <WalletDropdown>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </header>
  );
}
