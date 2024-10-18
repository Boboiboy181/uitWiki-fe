import { MessageType } from '~/types';
import Message from './message.component';

type MessagesContainerProps = {
  messages: MessageType[];
  isLoading: boolean;
};

export default function MessagesContainer({ messages, isLoading }: MessagesContainerProps) {
  return (
    <div className="flex h-fit w-full max-w-3xl flex-col pt-4">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      {isLoading && <Message typing={true} />}
    </div>
  );
}
