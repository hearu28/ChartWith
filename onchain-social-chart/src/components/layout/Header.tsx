import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import "../../styles/Layout.css"; // Includes header styles
import type { TimeFrame } from "../chart/CryptoChart";

interface HeaderProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export function Header({ timeFrame, onTimeFrameChange }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>Onchain Social Chart (PoC)</h1>
      <div className="header-controls">
        {/* 시간 프레임 선택 */}
        <select
          className="timeframe-select"
          value={timeFrame}
          onChange={(e) => onTimeFrameChange(e.target.value as TimeFrame)}
        >
          <option value="1m">1분봉</option>
          <option value="5m">5분봉</option>
          <option value="15m">15분봉</option>
          <option value="1h">1시간봉</option>
          <option value="4h">4시간봉</option>
          <option value="1d">1일봉</option>
        </select>

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
