import React from "react";
import ReactDOM from "react-dom/client";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import Onchain Kit global styles (required)
import "@coinbase/onchainkit/styles.css";
// Custom global styles
import "./styles/globals.css";

import App from "./App";

// Create a React Query client instance
const queryClient = new QueryClient();

// Access environment variable in Vite
const onchainKitApiKey = import.meta.env.VITE_ONCHAINKIT_API_KEY;

if (!onchainKitApiKey) {
  console.warn(
    "⚠️ VITE_ONCHAINKIT_API_KEY is not set in .env file.\n" +
      "Some OnchainKit features may not work properly.\n" +
      "Get your API key from: https://portal.cdp.coinbase.com/"
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* OnchainKitProvider internally manages Wagmi and React Query  */}
    <OnchainKitProvider
      apiKey={onchainKitApiKey || undefined}
      chain={base} // Set the PoC's target chain to Base
      config={{
        // Theme settings for OCK components
        appearance: {
          mode: "dark", // 'light', 'dark', 'auto'
        },
        // Wallet connection settings
        wallet: {
          display: "modal", // 'modal' | 'drawer'
          preference: "all", // 'all' | 'smartWalletOnly' | 'eoaOnly'
        },
      }}
    >
      {/* OnchainKitProvider requires a QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </OnchainKitProvider>
  </React.StrictMode>
);
