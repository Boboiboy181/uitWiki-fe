import type { MetaFunction } from '@remix-run/node';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ChatContainer, Header, Loading } from '~/components';
import { cn } from '~/lib/utils';
import { getSessionById } from '~/services';
import { useSession } from '~/store';
import { useChat } from '~/store/chat.store';

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
  const { messages, setMessages } = useChat();
  const { sessionId, getNewSessionId, hasHydrated } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: [sessionId],
    queryFn: () => getSessionById(sessionId),
    enabled: !!sessionId,
    select: (data) => data.messages,
  });

  useEffect(() => {
    if (hasHydrated && !sessionId) {
      getNewSessionId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, sessionId]);

  useEffect(() => {
    setMessages(data || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <main className="mx-auto h-screen">
      <Header />
      <div
        className={cn('relative mx-auto flex h-full w-full flex-col items-center justify-center', {
          'justify-between overflow-y-hidden': messages.length !== 0,
        })}
      >
        {isLoading ? <Loading /> : <ChatContainer messages={messages} />}
      </div>
    </main>
  );
}
