import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import type { Message } from "./SocialOverlay";
import "../../styles/Chat.css";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { senderAddress, text, x, y } = message;

  // 메시지 위치를 화면 경계 내로 조정
  const adjustPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const messageWidth = 400; // max-width
    const messageHeight = 60; // 대략적인 높이

    let adjustedX = x;
    let adjustedY = y;

    // X 위치 조정
    if (adjustedX + messageWidth > viewportWidth - 20) {
      adjustedX = viewportWidth - messageWidth - 20;
    }
    if (adjustedX < 20) {
      adjustedX = 20;
    }

    // Y 위치 조정 (헤더 아래)
    const headerHeight = 70;
    if (adjustedY < headerHeight + 20) {
      adjustedY = headerHeight + 20;
    }
    if (adjustedY + messageHeight > viewportHeight - 20) {
      adjustedY = viewportHeight - messageHeight - 20;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const position = adjustPosition();

  return (
    <div
      className="chat-message floating"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="chat-user-profile">
        <div className="chat-avatar-placeholder">
          <Identity address={senderAddress}>
            <Avatar className="chat-avatar" />
          </Identity>
        </div>
        <Identity address={senderAddress}>
          <Name className="chat-user-name" />
        </Identity>
      </div>
      <span className="chat-message-text">{text}</span>
    </div>
  );
}
