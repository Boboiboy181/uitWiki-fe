import { ArrowUpIcon, ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { ChangeEvent, FormEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MessagesContainer, PreDefinedList } from '~/components';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import { sendMessage } from '~/services';
import { useSession } from '~/store';
import { useChat } from '~/store/chat.store';
import { MessageType } from '~/types';

export default function ChatContainer({ messages }: { messages: MessageType[] }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sessionId } = useSession();
  const { addMessage } = useChat();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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
      setIsError(true);
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

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Fragment>
      {messages.length === 0 ? (
        <h1 className="mb-6 text-center text-4xl font-semibold text-gray-900">Tôi có thể giúp gì cho bạn?</h1>
      ) : (
        <MessagesContainer messages={messages} isLoading={isLoading} isError={isError} />
      )}

      <div
        className={cn('container w-full max-w-3xl bg-white', {
          'sticky bottom-0': messages.length !== 0,
        })}
      >
        <div
          className={cn(
            'mb-5 hidden items-center justify-center gap-2 opacity-0 transition-all duration-300',
            isError && 'flex opacity-100',
          )}
        >
          <div className="flex items-center gap-4 rounded-md border border-red-700 bg-red-200 p-2 px-4">
            <ExclamationTriangleIcon className="size-5" />
            <p className="text-sm">
              Đã xảy ra lỗi. Nếu vấn đề này vẫn tiếp diễn, vui lòng liên hệ với tụi mình qua email <br />
              <a className="underline" href="mailto:21520806@gm.uit.edu.vn">
                21520806@gm.uit.edu.vn
              </a>{' '}
              hoặc{' '}
              <a className="underline" href="mailto:21520227@gm.uit.edu.vn">
                21520227@gm.uit.edu.vn
              </a>
            </p>
          </div>
          <Button className="bg-green-700 hover:bg-green-800" onClick={handleReload}>
            <ReloadIcon className="ml-1" />
          </Button>
        </div>
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
            disabled={input.trim() !== '' && isLoading === false && isError === false ? false : true}
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
    </Fragment>
  );
}
