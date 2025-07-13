import { useEffect, useRef } from 'react';
import type { MessageType } from '~/types';
import Message from './message.component';

type MessagesContainerProps = {
  messages: MessageType[];
};

export default function MessagesContainer({ messages }: MessagesContainerProps) {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!lastMessage) return;

    const timeoutId = setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [lastMessage]);

  return (
    <div
      ref={messageContainerRef}
      className="flex w-full flex-grow justify-center overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="flex h-fit w-full max-w-3xl flex-col pb-5 pt-8 md:pb-10 md:pt-[60px]">
        {messages.map((message) => (
          <Message key={message.messageId} message={message} />
        ))}
      </div>
    </div>
  );
}
