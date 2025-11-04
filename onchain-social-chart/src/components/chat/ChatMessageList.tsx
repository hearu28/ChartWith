import { ChatMessage } from "./ChatMessage";
import type { Message } from "./SocialOverlay";

interface ChatMessageListProps {
  messages: Message[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <>
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </>
  );
}
