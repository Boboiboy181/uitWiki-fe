import ReactMarkdown from 'react-markdown';
import { Typing } from '~/components/custom';
import { cn } from '~/lib/utils';
import { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// trigger deploy

export default function Message({ message, typing = false }: { message?: MessageType; typing?: boolean }) {
  const ContentComponent = message?.sender === 'user' ? 'p' : ReactMarkdown;

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

      {typing ? (
        <Typing />
      ) : (
        <div
          className={cn(
            'relative rounded-xl p-1.5 py-3 text-sm transition-all',
            message?.sender === 'user' && 'top-3 max-w-[500px] bg-gray-200 p-3.5',
          )}
        >
          <ContentComponent
            components={{
              a: ({ href, children }) => (
                <a href={href} className="font-semibold text-blue-600 underline">
                  {children}
                </a>
              ),
              ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
            }}
          >
            {message?.content}
          </ContentComponent>
        </div>
      )}
    </div>
  );
}
