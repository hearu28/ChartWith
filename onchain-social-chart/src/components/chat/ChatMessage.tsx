import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import type { Message } from "./SocialOverlay";
import "../../styles/Chat.css";

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
        fetch and render the Basename/ENS name and avatar
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
