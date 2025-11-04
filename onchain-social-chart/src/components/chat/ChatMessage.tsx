import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import type { Message } from "./SocialOverlay";
import "../../styles/Chat.css";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { senderAddress, text, x, y } = message;

  return (
    <div 
      className="chat-message floating"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <Identity address={senderAddress} className="chat-user-profile">
        <Avatar />
        <Name className="chat-user-name" />
      </Identity>
      <span className="chat-message-text">{text}</span>
    </div>
  );
}
