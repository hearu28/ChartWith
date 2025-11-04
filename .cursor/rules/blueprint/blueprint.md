Blueprint.md: Base Onchain Kit Social Chart PoC Technical Design Document1.0 Project Overview1.1 Project DefinitionThis document is the technical design document (Blueprint) for building a minimal front-end (Minimal Proof-of-Concept) that integrates social chatting features based on Onchain Identity with real-time cryptocurrency market charts, utilizing Base's Onchain Kit.1Core Concept: Users visually analyze real-time financial charts while simultaneously exchanging opinions about the charts with other users in real-time, using their Base wallet (and associated Basename or ENS name) as their profile.1.2 PoC (Proof-of-Concept) Core ObjectivesThis PoC focuses on validating technical feasibility rather than feature completeness.Objective 1: Onchain Kit Feasibility Validation (Core Question): To verify if Onchain Kit functions smoothly in the user's "cursorAI vibe coding environment," specifically whether the Identity 3 and Wallet 3 components can be integrated without conflict with disparate UI libraries like lightweight-charts.Objective 2: Core Feature Integration Test: To test the data flow and rendering integration of three heterogeneous components:Onchain Identity: Wallet connection, address, Basename/Avatar lookup (Handled by Onchain Kit).Market Chart: High-performance financial data visualization (Handled by Third-Party Library).Social UI: Custom chat input and message list (Handled by Custom React UI).Objective 3: Developer Experience (DX) Assessment: To evaluate if Onchain Kit actually delivers on its value proposition of "Ship in minutes, not weeks" 3 and if front-end developers with "No blockchain experience required" 6 can easily implement onchain features.1.3 PoC ScopeIn-Scope (To be implemented):Project environment setup based on Vite + React + TypeScript.OnchainKitProvider setup and wagmi context integration.Implementation of wallet connection functionality using Onchain Kit's <ConnectWallet> component.5Basic cryptocurrency chart rendering using the lightweight-charts library (using static or Mock data).7Basic chat UI (input box, message list) overlaid on the chart.9Integration of Onchain Kit's <Avatar> and <Name> components to automatically display Basename/ENS names based on the sender's address in chat messages.4Binding the connected user's address to the chat input logic using wagmi's useAccount hook.11Out-of-Scope (Excluded from this test):Real-time chat backend (e.g., WebSocket, Socket.io, PubNub 12). This PoC will use React's Local State as a temporary database.Real-time chart data streaming (API integration). The PoC will use static (Mock) data.On-chain storage or transmission of chat messages (Gas cost generation). All messages will exist only on the client side.Server-side session authentication via SIWE (Sign-In With Ethereum).5 (However, this will be proposed as a production roadmap in Section 8.0).2.0 PoC Technology Stack and RationaleThis PoC adopts a stack that maximizes synergy by leveraging Onchain Kit's React compatibility 3 and Vite's fast development environment.14CategoryTechnologyRationaleEnvironmentVite + React + TypeScriptOnchain Kit provides React components and hooks.3 Vite can instantly configure a React environment including TypeScript via npm create vite@latest 14 and offers excellent development server performance.Onchain SDKBase Onchain Kit (@coinbase/onchainkit)**** Provides ready-made components and hooks for wallet connection (ConnectWallet) 5 and onchain identity (Avatar, Name) 3, radically reducing development time.3Web3 Corewagmi & viemThese are Onchain Kit's essential peer dependencies.15 Although OCK handles wagmi setup internally 15, we must directly use the useAccount hook 11 to access wallet status (address, connection status) throughout the application.Chart Librarylightweight-charts & lightweight-charts-react-wrapperThe user's requirement is a "cryptocurrency market chart." While recharts [17, 18] is a general-purpose chart library, lightweight-charts [19] is a high-performance financial chart library developed by TradingView. This is the best fit for the requirement. We use lightweight-charts-react-wrapper 7 for declarative integration in the React environment.State ManagementReact Local State (useState)Within the PoC's scope, there is no real-time backend (Out-of-Scope). Therefore, the chat message list will be managed as a local array using the useState hook in a parent component (e.g., SocialOverlay.tsx). This is the fastest and simplest test method.StylingTailwind CSS / Plain CSSOnchain Kit provides a default stylesheet (@coinbase/onchainkit/styles.css) 14, which integrates well with Tailwind CSS.20 The PoC will use minimal CSS (or Tailwind) for layout.3.0 Project Setup and Onchain Kit Environment ConfigurationThis section describes the specific steps to start the project in the "cursorAI vibe" environment.3.1 Vite Project InitializationCreate a React + TypeScript project using Vite.14Bash# npm create vite@latest onchain-social-chart -- --template react-ts
npm create vite@latest
# Enter 'onchain-social-chart' at the prompt, select React and TypeScript
cd onchain-social-chart
npm install
3.2 Core Dependency InstallationManually install Onchain Kit and core Web3 libraries.15Bash# Onchain Kit and Web3 core libraries
npm install @coinbase/onchainkit wagmi viem

# Chart libraries
npm install lightweight-charts lightweight-charts-react-wrapper

# Install React Query, an internal dependency of Onchain Kit
npm install @tanstack/react-query
While npm create onchain@latest 3 provides an automated template, the user's requirement is to test custom integration with a chart library. Therefore, manually installing OCK into a default Vite template 15 is more suitable for the PoC's purpose.3.3 OnchainKitProvider Setup (src/main.tsx)The application's entry point (main.tsx or App.tsx) must be wrapped with OnchainKitProvider. This allows OCK components and hooks to access the wagmi and React Query contexts.5Environment Variable Setup (.env):Create a .env file in the project root.15 You must obtain an API key from the Coinbase Developer Platform (CDP).20VITE_ONCHAINKIT_API_KEY=YOUR_API_KEY_HERE
Vite uses the VITE_ prefix instead of NEXT_PUBLIC_.15 Access it in code via import.meta.env.VITE_ONCHAINKIT_API_KEY.src/main.tsx (Full Setup Example):TypeScriptimport React from 'react';
import ReactDOM from 'react-dom/client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import Onchain Kit global styles (required)
import '@coinbase/onchainkit/styles.css'; 
// Custom global styles
import './styles/globals.css'; 

import App from './App';

// Create a React Query client instance
const queryClient = new QueryClient();

// Access environment variable in Vite
const onchainKitApiKey = import.meta.env.VITE_ONCHAINKIT_API_KEY;

if (!onchainKitApiKey) {
  throw new Error("VITE_ONCHAINKIT_API_KEY is not set in.env file. Get one from Coinbase Developer Platform.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* OnchainKitProvider internally manages Wagmi and React Query  */}
    <OnchainKitProvider
      apiKey={onchainKitApiKey}
      chain={base} // Set the PoC's target chain to Base
      config={{
        // Theme settings for OCK components 
        appearance: {
          mode: 'dark', // 'light', 'dark', 'auto'
        },
        // Wallet connection settings 
        wallet: {
          display: 'modal', // 'modal' | 'drawer'
          preference: 'all', // 'all' | 'smartWalletOnly' | 'eoaOnly'
        },
      }}
    >
      {/* OnchainKitProvider requires a QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </OnchainKitProvider>
  </React.StrictMode>,
);
Configuration Core: OnchainKitProvider 5 is not just a context provider. It abstracts and internally manages the complex setup of wagmi and @tanstack/react-query.15 Thanks to this design, the developer only needs to pass apiKey and chain without writing a complex wagmi createConfig 5 themselves. This aligns perfectly with OCK's core goal of "No blockchain experience required".33.4 Global Styles Import (src/main.tsx or src/App.tsx)For Onchain Kit components to render correctly, you must import the styles.css file at the application's entry point.14TypeScriptimport '@coinbase/onchainkit/styles.css'; 
4.0 PoC Directory Structure (Blueprint)While the PoC's complexity is low, its features (chart, chat, layout) are clearly distinct, so a feature-based directory structure 24 is proposed. This structure is easily scalable to production.Plaintext/src
|
|-- /assets               # Static assets like images, fonts
|
|-- /components           # Core components of the application
| |
| |-- /chart            # Chart-related components
| | |-- CryptoChart.tsx
| |
| |-- /chat             # Social chat-related components
| | |-- SocialOverlay.tsx    # Main chat UI container and state management
| | |-- ChatMessageList.tsx  # List of messages
| | |-- ChatMessage.tsx      # Individual message (OCK Identity integration)
| | |-- ChatInput.tsx        # Chat input box (Wagmi useAccount integration)
| |
| |-- /layout           # Page layout components
| |-- AppLayout.tsx
| |-- Header.tsx           # Includes OCK Wallet component
|
|-- /hooks                # Custom hooks
| |-- (Not used in PoC)
|
|-- /styles               # CSS files
| |-- globals.css       # Global styles
| |-- Chat.css          # Styles specific to the chat UI
| |-- Layout.css        # Layout styles
|
|-- App.tsx               # Main application layout and routing
|
|-- main.tsx              # React DOM rendering and OnchainKitProvider setup
|
|-- types.ts              # (Optional) Global TypeScript types
5.0 Core Component Architecture DetailsThis section is the core of the blueprint.md 1, specifying each component's role, implementation strategy, and Onchain Kit integration points.275.1 App.tsx (Application Root)Role: Renders AppLayout as a child of OnchainKitProvider.Implementation:TypeScriptimport { AppLayout } from './components/layout/AppLayout';
import './styles/globals.css';

function App() {
  return (
    <AppLayout />
  );
}
export default App;
5.2 AppLayout.tsx (Main Layout)Role: Defines the application's basic structure (header, main content). The main content area is structured so the chart and chat overlay are stacked.Implementation:TypeScriptimport { Header } from './Header';
import { CryptoChart } from '../chart/CryptoChart';
import { SocialOverlay } from '../chat/SocialOverlay';
import '../../styles/Layout.css'; // CSS for layout

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
5.3 Header.tsx (Header and Wallet Connection)Role: Contains the logo and the Onchain Kit Wallet Connection UI.OCK Integration Point: <Wallet> and <ConnectWallet> components.3Implementation:TypeScriptimport { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import '../../styles/Layout.css'; // Includes header styles

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
5.4 CryptoChart.tsx (Cryptocurrency Market Chart)Role: Renders a financial chart using lightweight-charts.OCK Integration Point: (None) - This component operates independently of OCK and is a subject of the integration test.Implementation 7:TypeScriptimport { Chart, LineSeries } from 'lightweight-charts-react-wrapper';

// Mock data for PoC [7, 19]
const lineData = [
  { time: '2019-04-11', value: 80.01 },
  { time: '2019-04-12', value: 96.63 },
  { time: '2019-04-13', value: 76.64 },
  { time: '2019-04-14', value: 81.89 },
  { time: '2019-04-15', value: 74.43 },
  { time: '2019-04-16', value: 80.01 },
];

export function CryptoChart() {
  return (
    <div className="chart-container" style={{ height: '600px', width: '100%' }}>
      {/* 
        Using lightweight-charts-react-wrapper.
        Use the autoSize option to follow the parent container's size instead of fixed width/height.
      */}
      <Chart
        autoSize // Fit to parent container
        dark={true} // Match the OCK theme (dark)
        //... (other chart options)
      >
        <LineSeries data={lineData} />
      </Chart>
    </div>
  );
}
5.5 SocialOverlay.tsx (Social Overlay and State Management)Role: Transparently overlays the chart, containing ChatMessageList and ChatInput. This is the parent component that manages the PoC's chat message state.Implementation:TypeScriptimport React, { useState } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import '../../styles/Chat.css'; // Styles for overlay and chat UI

// Define message type for PoC
export interface Message {
  id: string;
  senderAddress: `0x${string}`; // Sender's wallet address
  text: string;
  timestamp: number;
}

export function SocialOverlay() {
  // PoC's temporary database: Manage message array in local state
  const [messages, setMessages] = useState<Message>();

  // Handler to add a message, called from ChatInput
  const handleSendMessage = (text: string, senderAddress: `0x${string}`) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderAddress,
      text,
      timestamp: Date.now(),
    };
    // Add the new message to the existing message list
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="social-overlay">
      <ChatMessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
5.6 ChatInput.tsx (Chat Input Box)Role: Allows the user to type and send messages.Core Integration Point (Wagmi): Uses wagmi's useAccount hook 11 to get the currently connected user's address and isConnected status.Implementation:TypeScriptimport React, { useState } from 'react';
import { useAccount } from 'wagmi'; // Directly use the hook from the wagmi context set up by OCK

interface ChatInputProps {
  onSendMessage: (text: string, senderAddress: `0x${string}`) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const = useState('');

  // *** Core OnchainKit Integration Insight (Insight 1) ***
  // We directly read the account info connected via OCK's <ConnectWallet>
  // using wagmi's useAccount hook.
  // This is possible because OCK correctly sets up the wagmi Provider.
  const { address, isConnected } = useAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() ||!isConnected ||!address) {
      // Cannot send if not connected or message is empty
      return;
    }

    // Pass the message and "sender address" to the parent (SocialOverlay)
    onSendMessage(text, address);
    setText(''); // Clear the input box
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          isConnected? "Share your opinion..." : "Connect your wallet to chat"
        }
        // Disable input if wallet is not connected
        disabled={!isConnected} 
      />
      <button type="submit" disabled={!isConnected ||!text.trim()}>
        Send
      </button>
    </form>
  );
}
5.7 ChatMessageList.tsx (Chat Message List)Role: Iterates over the messages array received from SocialOverlay and renders a ChatMessage component for each.Implementation:TypeScriptimport { ChatMessage } from './ChatMessage';
import { Message } from './SocialOverlay';

interface ChatMessageListProps {
  messages: Message; // Array of message objects
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="chat-message-list">
      {messages.map((msg) => (
        // Render a ChatMessage component for each message
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
}
5.8 ChatMessage.tsx (Individual Chat Message)Role: Displays an individual message and shows the sender's onchain identity (avatar, name) based on their senderAddress.Core Integration Point (Onchain Kit Identity): Uses OCK's <Identity>, <Avatar>, and <Name> components 3 to automatically resolve the address into an onchain profile.Implementation:TypeScriptimport { Identity, Avatar, Name } from '@coinbase/onchainkit/identity';
import { Message } from './SocialOverlay';
import '../../styles/Chat.css';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { senderAddress, text } = message;

  return (
    <div className="chat-message">
      {/* 
        *** Core OnchainKit Integration (Insight 2) ***
        By simply passing the 'address' prop to the <Identity> component ,
        its children, <Avatar> and <Name>, automatically
        fetch and render the Basename/ENS name [4, 28] and avatar
        associated with that address.
      */}
      <Identity address={senderAddress} className="chat-user-profile">
        <Avatar />
        <div className="chat-user-details">
          {/* 
            <Name> displays the Basename or ENS name first. 
            If none exists, it shows a truncated address (e.g., 0x123...456).
            It internally uses the `useName` hook.
          */}
          <Name className="chat-user-name" />
        </div>
      </Identity>
      <p className="chat-message-text">{text}</p>
    </div>
  );
}
6.0 Core Data Flow and State Management (PoC)The user's core question ("can it be handled properly?") ultimately comes down to how OCK supports the data flow between these disparate components. The bridge connecting Onchain Kit's <ConnectWallet> component 5 and the custom ChatInput component is not OCK itself, but the wagmi useAccount hook 11 that OCK relies on. Because OCK's OnchainKitProvider 15 provides the wagmi context, all components within the app can access "current logged-in user" information via useAccount.PoC Data Flow (End-to-End Scenario)(Setup) OnchainKitProvider in main.tsx 5 activates the wagmi context for the entire application.(Login) The user clicks the <ConnectWallet> 5 button in Header.tsx and successfully connects their wallet.(State Propagation) The wagmi context is updated, and wagmi's useAccount() hook 16 starts returning isConnected: true and address: '0x...'.(UI Activation) useAccount in ChatInput.tsx detects this change, and the disabled attribute is removed, enabling the input field.(Message Send) The user types a message and clicks "Send".(Address Injection) The handleSubmit function in ChatInput.tsx takes the address received from useAccount 11 and sends it along with the message text to SocialOverlay.tsx via the onSendMessage callback.(State Update) SocialOverlay.tsx executes handleSendMessage and adds a new { senderAddress: '0x...', text: '...' } object to the messages local state array.(List Render) The state change in SocialOverlay.tsx causes ChatMessageList.tsx to re-render, passing the new message object as a prop to ChatMessage.tsx.(Identity Check) ChatMessage.tsx passes the message.senderAddress as a prop to Onchain Kit's <Identity address={...}> 5 component.(OCK Auto-Fetch) The <Avatar> and <Name> 3 components internally trigger the useAvatar 4 and useName 22 hooks, which fetch the Basename/ENS name and avatar for that address from onchain (or cache) and render it to the screen.7.0 Onchain Kit Core Functionality Test ScenariosThese are the specific test scenarios to determine if this PoC is a "success." This table defines the clear boundaries of OCK as an SDK. OCK is responsible for the "authentication UI" and "identity display UI," but not for the "chart" or "chat input logic."FunctionImplementation OwnerOnchainKit (OCK) UsageNon-OCK TechnologyUser Authentication (Login)OCK + Wagmi<ConnectWallet> 5, <Wallet> 5, OnchainKitProvider 15wagmi's useAccount 11 (Read state)Financial Chart Display3rd Party(N/A)lightweight-charts-react-wrapper 7Chat Message InputCustom + Wagmi(N/A)React useState [9], useAccount 11 (Get sender address)Chat Identity (ID) DisplayOCK + Custom<Avatar>, <Name>, <Identity> 3React components (UI layout) [10]8.0 PoC Limitations and Production RoadmapThis PoC is intended to test the integration of Onchain Kit. For a production service, the following extensions are necessary.8.1 Clear Limitations of the PoCEphemeral Chat: Chat history is stored in React local state, so all conversation history disappears on a page refresh.No Real-time: Messages from other users cannot be received in real-time.Client-side Trust: The address from useAccount is used directly as the senderAddress. A technically savvy user could manipulate client-side code to impersonate another user's address.8.2 Roadmap to ProductionStep 1: Build a Real-time Backend:Set up a WebSocket-based real-time messaging server (e.g., Socket.io, PubNub 12, or Firebase Realtime Database).ChatInput.tsx will send (text, address) to the backend instead of calling onSendMessage.SocialOverlay.tsx will subscribe to real-time messages from the backend and call setMessages.Step 2: Server-side Authentication with SIWE (Sign-In With Ethereum):Core Distinction (Authentication vs. Identification): The PoC used useAccount for Identification. Production requires Authentication.Utilize the onConnect callback provided by Onchain Kit's <ConnectWallet> component.5Flow:User clicks <ConnectWallet>.On successful wallet connection, the onConnect callback is triggered.Inside onConnect, use viem's createSiweMessage 5 and wagmi's useSignMessage 5 to request a signature from the user ("Sign in to this site").When the user signs, send this signature to the backend.The backend verifies the signature to authenticate that the user is the true owner of that address and issues a session token (like a JWT).All subsequent chat message submissions are authenticated using this session token.9.0 Conclusion: Onchain Kit Viability AssessmentIs Onchain Kit suitable for this task? Yes, extremely suitable.Assessment: Onchain Kit perfectly solves the 'onchain identity' problem, which is the core of the user's envisioned "social" feature. The developer does not need to learn complex ENS/Basename resolvers 29 or avatar standards. They only need to use the <Identity>, <Avatar>, and <Name> components 3 with an address prop. This perfectly matches OCK's "Ship in minutes" 3 value proposition.Key Finding: The true strength of Onchain Kit lies in its seamless integration with the wagmi ecosystem. The three-part flow—initiating authentication with OCK's <ConnectWallet> 5, sharing state across the app with wagmi's useAccount 11, and displaying identity with OCK's <Name> 22—is robust and scalable.Final Recommendation: The architecture described in this blueprint.md provides a clear and efficient path to test the core value of Onchain Kit in the user's "cursorAI vibe" environment and successfully validate its integration with a chart library.