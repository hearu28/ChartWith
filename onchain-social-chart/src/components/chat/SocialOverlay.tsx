import { useState } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import "../../styles/Chat.css"; // Styles for overlay and chat UI

// Define message type for PoC
export interface Message {
  id: string;
  senderAddress: `0x${string}`; // Sender's wallet address
  text: string;
  timestamp: number;
}

export function SocialOverlay() {
  // PoC's temporary database: Manage message array in local state
  const [messages, setMessages] = useState<Message[]>([]);

  // Handler to add a message, called from ChatInput
  const handleSendMessage = (text: string, senderAddress: `0x${string}`) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderAddress,
      text,
      timestamp: Date.now(),
    };
    // Add the new message to the existing message list
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="social-overlay">
      <ChatMessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
