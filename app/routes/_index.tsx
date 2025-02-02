import type { MetaFunction } from '@remix-run/node';
import { useEffect } from 'react';
import { ChatContainer, Header, Loading, VisitorWarning } from '~/components';
import { useSessionId } from '~/hooks';
import { cn } from '~/lib/utils';
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
  const { messages: data, isLoading } = useSessionId(sessionId!);

  useEffect(() => {
    if (hasHydrated && !sessionId) {
      getNewSessionId();
    }
  }, [getNewSessionId, hasHydrated, sessionId]);

  useEffect(() => {
    if (!isLoading) setMessages(data || []);
  }, [data, isLoading, setMessages]);

  return (
    <main className="mx-auto h-screen p-4 pb-0 text-gray-900 md:p-0">
      <VisitorWarning />
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
