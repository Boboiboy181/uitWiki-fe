import Lottie from 'lottie-react';
import typingAnimation from '~/assets/lottie/typing.json';
import { cn } from '~/lib/utils';
import { MessageType } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Message({ message, typing = false }: { message?: MessageType; typing?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2 py-3', message?.sender === 'user' && 'flex-row-reverse')}>
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
        <p className="relative top-3 rounded-xl bg-gray-200 p-3.5 py-3 text-sm transition-all">{message?.content}</p>
      )}
    </div>
  );
}
