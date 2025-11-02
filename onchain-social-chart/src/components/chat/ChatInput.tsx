import React, { useState } from "react";
import { useAccount } from "wagmi"; // Directly use the hook from the wagmi context set up by OCK

interface ChatInputProps {
  onSendMessage: (text: string, senderAddress: `0x${string}`) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");

  // *** Core OnchainKit Integration Insight (Insight 1) ***
  // We directly read the account info connected via OCK's <ConnectWallet>
  // using wagmi's useAccount hook.
  // This is possible because OCK correctly sets up the wagmi Provider.
  const { address, isConnected } = useAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isConnected || !address) {
      // Cannot send if not connected or message is empty
      return;
    }

    // Pass the message and "sender address" to the parent (SocialOverlay)
    onSendMessage(text, address);
    setText(""); // Clear the input box
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          isConnected ? "Share your opinion..." : "Connect your wallet to chat"
        }
        // Disable input if wallet is not connected
        disabled={!isConnected}
      />
      <button type="submit" disabled={!isConnected || !text.trim()}>
        Send
      </button>
    </form>
  );
}
