import { MessageType } from '~/types';

export default function Message({ message }: { message: MessageType }) {
  return <p>{message.content}</p>;
}
