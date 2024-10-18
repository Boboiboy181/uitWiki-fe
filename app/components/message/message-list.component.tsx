import { MessageType } from '~/types';
import Message from './message.component';

export default function MessageList({ messages }: { messages: MessageType[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
}
