import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { sendMessage } from '~/services';
import { useChat, useSession } from '~/store';
import { MessageType } from '~/types';
import { Button } from '../ui/button';

export default function PreDefinedItem({ question }: { question: string }) {
  const { sessionId } = useSession();
  const { addMessage, setIsLoading, setIsError } = useChat();

  const handleOnSubmit = async () => {
    setIsLoading(true);

    const newMessageFromUser: MessageType = {
      content: question,
      sender: 'user',
      timestamp: Date.now(),
    };
    addMessage(newMessageFromUser);

    try {
      const newMessageFromBot: MessageType = await sendMessage(question, sessionId, Date.now());
      addMessage(newMessageFromBot);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="h-fit rounded-2xl border bg-white px-2 py-1 text-xs text-gray-900 hover:bg-gray-100"
      onClick={handleOnSubmit}
    >
      <span>{question}</span>
      <ArrowTopRightIcon />
    </Button>
  );
}
