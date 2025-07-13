import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { useChat, useSession } from '~/store';
import type { MessageType } from '~/types';
import { Button } from '../ui/button';

export default function PreDefinedItem({ question }: { question: string }) {
  const { sessionId } = useSession();
  const { addMessage, setIsLoading, setIsError, updateMessage } = useChat();

  const handleOnSubmit = async () => {
    setIsLoading(true);

    const newMessageFromUser: MessageType = {
      content: question,
      sender: 'user',
      timestamp: Date.now(),
      messageId: crypto.randomUUID(),
    };
    addMessage(newMessageFromUser);

    try {
      const queryParams = new URLSearchParams({
        sessionId: sessionId,
        user_question: question,
        timestamp: Date.now().toString(),
      });

      const eventSource = new EventSource(
        `http://localhost:3000/api/v1/chatbot/send_message_stream?${queryParams.toString()}`,
      );

      let streamedMessage = '';
      const messageId = crypto.randomUUID();
      const botResponse: MessageType = {
        content: '',
        sender: 'bot',
        timestamp: Date.now(),
        isLoading: true,
        messageId,
      };

      addMessage(botResponse);

      eventSource.onmessage = (event) => {
        const data = event.data.trim();

        if (data === '[DONE]') {
          eventSource.close();
          return;
        }

        streamedMessage += data;
        updateMessage(messageId, {
          ...botResponse,
          content: streamedMessage,
          isLoading: data === '',
        });
      };

      eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        setIsError(true);
        eventSource.close();
      };

      eventSource.onopen = () => {
        console.log('SSE connection opened');
      };

      eventSource.addEventListener('end', () => {
        eventSource.close();
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
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
