import { MessageType } from '~/types';
import Message from './message.component';

type MessagesContainerProps = {
  messages: MessageType[];
  isLoading: boolean;
};

export default function MessagesContainer({ messages, isLoading }: MessagesContainerProps) {
  return (
    <div className="absolute top-0 h-fit w-full pt-4">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isLoading && <Message typing={true} />}
    </div>
  );
}
