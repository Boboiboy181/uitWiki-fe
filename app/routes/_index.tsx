import { ArrowUpIcon } from '@radix-ui/react-icons';
import type { MetaFunction } from '@remix-run/node';
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MessageList, PreDefinedList } from '~/components';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
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
  const [messages, setMessages] = useState<MessageType[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);
    const newMessageFromUser: MessageType = {
      sessionId: '1',
      content: input,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessageFromUser]);
    setInput('');
    textareaRef.current!.value = '';
  };

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (input.trim() === '') return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleOnSubmit(new Event('submit', { bubbles: true }) as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="container max-w-3xl">
        {messages.length === 0 && (
          <h1 className="mb-6 text-center text-4xl font-semibold text-gray-900">Tôi có thể giúp gì cho bạn?</h1>
        )}
        {messages.length !== 0 && <MessageList messages={messages} />}
        <form
          onSubmit={(e) => handleOnSubmit(e)}
          className={cn('mb-3 flex flex-col gap-2 rounded-xl border p-2 px-3 pt-3 shadow-sm transition-all', {
            'container fixed bottom-8 max-w-3xl': messages.length !== 0,
          })}
        >
          <Textarea
            ref={textareaRef}
            onChange={(e) => handleOnChange(e)}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="Nhập câu hỏi ở đây?"
            className="max-h-[300px] min-h-[40px] resize-none overflow-auto border-none p-0 shadow-none outline-none focus-visible:ring-0"
          />
          <Button
            disabled={input.trim() !== '' ? false : true}
            type="submit"
            className="size-8 flex-grow-0 self-end rounded-lg p-2"
          >
            <ArrowUpIcon />
          </Button>
        </form>
        {messages.length === 0 && <PreDefinedList />}
        <div className="container fixed bottom-0 max-w-3xl">
          <p className="py-2 text-center text-xs text-gray-500">
            uitWiki có thể mắc lỗi. Vui lòng sử dụng một cách cẩn trọng.
          </p>
        </div>
      </div>
    </main>
  );
}
