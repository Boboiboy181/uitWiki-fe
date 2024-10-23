import { ArrowUpIcon } from '@radix-ui/react-icons';
import type { MetaFunction } from '@remix-run/node';
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MessagesContainer, PreDefinedList } from '~/components';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import { getSessionById, sendMessage } from '~/services';
import { useSession } from '~/store';
import { useChat } from '~/store/chat.store';
import { MessageType } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'UIT Wiki' },
    {
      name: 'description',
      content:
        'uitWiki is an interactive platform designed for UIT students, providing a comprehensive repository of university information, resources, and a chatbot for instant Q&A assistance.',
    },
  ];
};

export default function Index() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sessionId, getNewSessionId, hasHydrated } = useSession();
  const { messages, setMessages, addMessage } = useChat();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (sessionId === '') {
      getNewSessionId();
      return;
    }

    const fetchMessages = async () => {
      try {
        const { messages } = await getSessionById(sessionId);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, sessionId]);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessageFromUser: MessageType = {
      content: input,
      sender: 'user',
      timestamp: Date.now(),
    };
    addMessage(newMessageFromUser);
    setInput('');
    textareaRef.current!.value = '';

    setIsLoading(true);

    try {
      const newMessageFromBot: MessageType = await sendMessage(input, sessionId, Date.now());
      addMessage(newMessageFromBot);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (input.trim() === '' || isLoading) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleOnSubmit(new Event('submit', { bubbles: true }) as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <main className="mx-auto h-screen">
      <div
        className={cn('relative mx-auto flex h-full w-full flex-col items-center justify-center', {
          'justify-between overflow-y-auto': messages.length !== 0,
        })}
      >
        {messages.length === 0 && (
          <h1 className="mb-6 text-center text-4xl font-semibold text-gray-900">Tôi có thể giúp gì cho bạn?</h1>
        )}
        {messages.length !== 0 && <MessagesContainer messages={messages} isLoading={isLoading} />}
        <div
          className={cn('container w-full max-w-3xl bg-white', {
            'sticky bottom-0': messages.length !== 0,
          })}
        >
          <form
            onSubmit={(e) => handleOnSubmit(e)}
            className={cn('mb-3 flex w-full flex-col gap-2 rounded-xl border p-2 px-3 pt-3 shadow-sm transition-all')}
          >
            <Textarea
              ref={textareaRef}
              onChange={(e) => handleOnChange(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Nhập câu hỏi ở đây?"
              className="max-h-[300px] min-h-[40px] resize-none overflow-auto border-none p-0 shadow-none outline-none focus-visible:ring-0"
            />
            <Button
              disabled={input.trim() !== '' && isLoading === false ? false : true}
              type="submit"
              className="size-8 flex-grow-0 self-end rounded-lg p-2"
            >
              <ArrowUpIcon />
            </Button>
          </form>
          {messages.length === 0 && <PreDefinedList />}
          <p className="mt-1 py-2 text-center text-xs text-gray-500">
            uitWiki có thể mắc lỗi. Vui lòng sử dụng một cách cẩn trọng.
          </p>
        </div>
      </div>
    </main>
  );
}
