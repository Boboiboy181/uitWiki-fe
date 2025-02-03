import markdownit from 'markdown-it';
import { Fragment } from 'react/jsx-runtime';
import { Typing } from '~/components/custom';
import { cn } from '~/lib/utils';
import { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const md = markdownit({ html: true, breaks: true });

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

      {typing ? (
        <Typing />
      ) : (
        <div
          className={cn(
            'prose prose-sm relative max-w-none rounded-xl text-sm transition-all dark:prose-invert',
            message?.sender === 'user' && 'top-3 max-w-[500px] bg-gray-200 p-3.5',
          )}
        >
          {message?.sender === 'user' ? (
            <p>{message.content}</p>
          ) : (
            <Fragment>
              <div dangerouslySetInnerHTML={{ __html: md.render(message?.content || '') }}></div>
              {/* <TypeAnimation sequence={[md.render(message?.content || '') || '']} speed={70} cursor={false} /> */}
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
}
