import type { MetaFunction } from '@remix-run/node';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ChatContainer, Header } from '~/components';
import { useIsClient } from '~/hooks';
import { cn } from '~/lib/utils';
import { getSessionById } from '~/services';
import { useSession } from '~/store';
import { useChat } from '~/store/chat.store';

const Loading = lazy(() => import('~/components').then((module) => ({ default: module.Loading })));

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
  const [localLoading, setLocalLoading] = useState(true);
  const isClient = useIsClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setQuerySessionId] = useQueryState('sessionId', { defaultValue: '' });

  const { data, isLoading } = useQuery({
    queryKey: [sessionId],
    queryFn: () => getSessionById(sessionId),
    enabled: !!sessionId,
    select: (data) => data.messages,
  });

  useEffect(() => {
    if (hasHydrated) {
      if (sessionId === '') {
        getNewSessionId();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, sessionId]);

  useEffect(() => {
    if (sessionId) {
      setQuerySessionId(sessionId);
    }
    setMessages(data || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sessionId]);

  useEffect(() => {
    setLocalLoading(isLoading);
  }, [isLoading]);

  return (
    <main className="mx-auto h-screen">
      <Header />
      <div
        className={cn('relative mx-auto flex h-full w-full flex-col items-center justify-center', {
          'justify-between overflow-y-hidden': messages.length !== 0,
        })}
      >
        {localLoading ? (
          isClient ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Loading />
            </Suspense>
          ) : (
            <div>Loading...</div> // Server-side fallback
          )
        ) : (
          <ChatContainer messages={messages} />
        )}
      </div>
    </main>
  );
}
