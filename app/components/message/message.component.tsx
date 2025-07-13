import ReactMarkdown from 'react-markdown';
import { Typing } from '~/components/custom';
import { cn } from '~/lib/utils';
import type { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export default function Message({ message, typing = false }: { message?: MessageType; typing?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 py-3',
        message?.sender === 'user' && 'flex-row-reverse',
        typing && 'items-center',
      )}
    >
      <Avatar>
        <AvatarImage
          src={
            message?.sender === 'user'
              ? 'https://github.com/shadcn.png'
              : 'https://avatars.githubusercontent.com/u/16943930?s=200&v=4'
          }
        />
        <AvatarFallback>
          <span className="text-xs">Uiter</span>
        </AvatarFallback>
      </Avatar>

      {message?.isLoading ? (
        <Typing />
      ) : (
        <div className={cn('flex w-full flex-1', message?.sender === 'user' && 'justify-end')}>
          <div
            className={cn(
              'prose prose-sm relative !max-w-[75ch] rounded-xl dark:prose-invert',
              message?.sender === 'user' && 'top-3 w-fit max-w-[500px] bg-gray-200 p-3.5',
            )}
          >
            {message?.sender === 'user' ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{message?.content || ''}</ReactMarkdown>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
