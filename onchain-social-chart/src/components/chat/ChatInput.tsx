import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";

interface ChatInputProps {
  onSendMessage: (text: string, senderAddress: `0x${string}`) => void;
  position: { x: number; y: number };
  onCancel: () => void;
}

export function ChatInput({ onSendMessage, position, onCancel }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();

  // 입력창을 클릭한 위치에 정확히 배치
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      inputRef.current.style.left = `${position.x}px`;
      inputRef.current.style.top = `${position.y}px`;
    }
  }, [position]);

  // ESC 키로 취소
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        // 외부 클릭은 무시 (차트 클릭이므로)
        // 입력창을 닫지 않고 유지
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isConnected || !address) {
      return;
    }

    onSendMessage(text, address);
    setText("");
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div 
      ref={inputRef} 
      className="chat-input-container"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your opinion..."
          autoFocus
        />
        <button type="submit" disabled={!text.trim()}>
          Send
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          ✕
        </button>
      </form>
    </div>
  );
}
