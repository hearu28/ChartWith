import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import "../../styles/Layout.css"; // Includes header styles

export function Header() {
  return (
    <header className="app-header">
      <h1>Onchain Social Chart (PoC)</h1>
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
    </header>
  );
}
