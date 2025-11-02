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
import { ErrorBoundary } from "./components/ErrorBoundary";

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

// OnchainKitProvider config - apiKey is optional, but some features require it
const providerConfig: {
  chain: typeof base;
  config: {
    appearance: { mode: "dark" };
    wallet: { display: "modal"; preference: "all" };
  };
  apiKey?: string;
} = {
  chain: base,
  config: {
    appearance: {
      mode: "dark",
    },
    wallet: {
      display: "modal",
      preference: "all",
    },
  },
};

// Only add apiKey if it exists
if (onchainKitApiKey) {
  providerConfig.apiKey = onchainKitApiKey;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* OnchainKitProvider internally manages Wagmi and React Query  */}
      <OnchainKitProvider {...providerConfig}>
        {/* OnchainKitProvider requires a QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </OnchainKitProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
