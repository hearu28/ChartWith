import { ChatMessage } from "./ChatMessage";
import type { Message } from "./SocialOverlay";

interface ChatMessageListProps {
  messages: Message[]; // Array of message objects
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
