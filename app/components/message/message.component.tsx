import ReactMarkdown from 'react-markdown';
import { Typing } from '~/components/custom';
import { cn } from '~/lib/utils';
import { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
            'prose prose-sm relative max-w-none rounded-xl py-3 text-sm transition-all dark:prose-invert',
            message?.sender === 'user' && 'top-3 max-w-[500px] bg-gray-200 p-3.5',
          )}
        >
          <ContentComponent
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 underline hover:text-blue-800"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
              code: ({ children }) => (
                <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-900">{children}</pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic dark:border-gray-700">
                  {children}
                </blockquote>
              ),
              h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="mb-3 text-xl font-bold">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-2 text-lg font-bold">{children}</h3>,
              p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800">
                  {children}
                </th>
              ),
              td: ({ children }) => <td className="border border-gray-300 p-2 dark:border-gray-700">{children}</td>,
            }}
          >
            {message?.content}
          </ContentComponent>
        </div>
      )}
    </div>
  );
}
