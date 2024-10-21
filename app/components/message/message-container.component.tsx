import { useEffect, useRef } from 'react';
import { MessageType } from '~/types';
import Message from './message.component';

type MessagesContainerProps = {
  messages: MessageType[];
  isLoading: boolean;
};

export default function MessagesContainer({ messages, isLoading }: MessagesContainerProps) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageContainerRef.current) return;

    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={messageContainerRef} className="flex w-full flex-grow justify-center overflow-y-auto scroll-smooth">
      <div className="flex h-fit w-full max-w-3xl flex-col pb-10 pt-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && <Message typing={true} />}
      </div>
    </div>
  );
}
