import Lottie from 'lottie-react';
import typingAnimation from '~/assets/lottie/typing.json';
import { cn } from '~/lib/utils';
import { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Message({ message, typing = false }: { message?: MessageType; typing?: boolean }) {
  return (
    <div className={cn('flex items-start gap-2 py-3', message?.sender === 'user' && 'flex-row-reverse')}>
      <Avatar>
        <AvatarImage
          src={
            message?.sender === 'user'
              ? 'https://github.com/shadcn.png'
              : 'https://avatars.githubusercontent.com/u/109295079?v=4'
          }
        />
        <AvatarFallback>
          <span className="text-xs">Uiter</span>
        </AvatarFallback>
      </Avatar>

      {typing ? (
        <Lottie
          animationData={typingAnimation}
          loop={true}
          style={{
            height: 50,
          }}
          className="animate-pulse"
        />
      ) : (
        <p
          className={cn(
            'relative top-3 max-w-[500px] rounded-xl p-3.5 py-3 text-sm transition-all',
            message?.sender === 'user' ? 'bg-gray-200' : 'bg-blue-200',
          )}
        >
          {message?.content}
        </p>
      )}
    </div>
  );
}
