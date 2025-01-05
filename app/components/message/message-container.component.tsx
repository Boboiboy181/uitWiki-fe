import { useEffect, useRef } from 'react';
import { MessageType } from '~/types';
import Message from './message.component';

type MessagesContainerProps = {
  messages: MessageType[];
  isLoading: boolean;
  isError?: boolean;
};

export default function MessagesContainer({ messages, isLoading, isError }: MessagesContainerProps) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageContainerRef.current) return;

    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages, isError]);

  return (
    <div ref={messageContainerRef} className="flex w-full flex-grow justify-center overflow-y-auto scroll-smooth">
      <div className="flex h-fit w-full max-w-3xl flex-col pb-5 pt-8 md:pb-10 md:pt-[60px]">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && <Message typing={true} />}
      </div>
    </div>
  );
}
