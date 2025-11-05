import { useEffect, useRef } from "react";
import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import type { Message } from "./SocialOverlay";
import "../../styles/Chat.css";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { senderAddress, text, x, y } = message;
  const avatarRef = useRef<HTMLDivElement>(null);

  // 이미지 로드 실패 시 기본 이미지 표시
  useEffect(() => {
    const placeholder = avatarRef.current;
    if (!placeholder) return;

    const checkAndSetDefaultImage = () => {
      const images = placeholder.querySelectorAll("img");
      let hasValidImage = false;

      images.forEach((img) => {
        // 이미지가 있고 유효한 src를 가지고 있으며, 로드가 완료되었고 너비가 0이 아닌 경우
        if (img.src && img.src !== "" && img.complete && img.naturalWidth > 0) {
          hasValidImage = true;
        } else {
          // 유효하지 않은 이미지는 숨김
          img.style.display = "none";
        }
      });

      // 유효한 이미지가 없으면 배경 이미지가 보이도록 설정
      // 인라인 스타일 제거 (CSS가 처리하도록)
      if (!hasValidImage) {
        placeholder.style.removeProperty("background-image");
      } else {
        placeholder.style.backgroundImage = "none";
      }
    };

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      if (img) {
        img.style.display = "none";
        checkAndSetDefaultImage();
      }
    };

    const handleImageLoad = () => {
      checkAndSetDefaultImage();
    };

    // 초기 체크
    setTimeout(checkAndSetDefaultImage, 100);

    // MutationObserver로 Avatar 컴포넌트가 렌더링되는 것을 감지
    const observer = new MutationObserver(() => {
      checkAndSetDefaultImage();
      // 새로 추가된 이미지에 이벤트 리스너 추가
      const images = placeholder.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("error", handleImageError);
        img.addEventListener("load", handleImageLoad);
      });
    });

    observer.observe(placeholder, {
      childList: true,
      subtree: true,
    });

    // 기존 이미지에 이벤트 리스너 추가
    const images = placeholder.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("error", handleImageError);
      img.addEventListener("load", handleImageLoad);
      // 이미 로드 실패한 이미지 처리
      if (!img.complete || img.naturalWidth === 0) {
        img.style.display = "none";
      }
    });

    return () => {
      observer.disconnect();
      images.forEach((img) => {
        img.removeEventListener("error", handleImageError);
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, [senderAddress]);

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
        <div className="chat-avatar-placeholder" ref={avatarRef}>
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
