import { useState, useEffect } from "react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import "../../styles/Chat.css";

export interface Message {
  id: string;
  senderAddress: `0x${string}`;
  text: string;
  timestamp: number;
  x: number; // 클릭한 X 좌표
  y: number; // 클릭한 Y 좌표
}

interface SocialOverlayProps {
  clickPosition: { x: number; y: number } | null;
  onClearClickPosition: () => void;
}

export function SocialOverlay({ clickPosition, onClearClickPosition }: SocialOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  // 3초 후 메시지 자동 제거
  useEffect(() => {
    if (messages.length === 0) return;

    const timers = messages.map((msg) => {
      return setTimeout(() => {
        setMessages((prevMessages) => 
          prevMessages.filter((m) => m.id !== msg.id)
        );
      }, 3000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages]);

  const handleSendMessage = (text: string, senderAddress: `0x${string}`) => {
    if (!clickPosition) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderAddress,
      text,
      timestamp: Date.now(),
      x: clickPosition.x,
      y: clickPosition.y,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    onClearClickPosition();
  };

  return (
    <div className="social-overlay">
      <ChatMessageList messages={messages} />
      {clickPosition && (
        <ChatInput 
          onSendMessage={handleSendMessage} 
          position={clickPosition}
          onCancel={onClearClickPosition}
        />
      )}
    </div>
  );
}
