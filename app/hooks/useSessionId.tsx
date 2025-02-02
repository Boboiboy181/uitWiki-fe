import { useQuery } from '@tanstack/react-query';
import { getSessionById } from '~/services';
import { MessageType } from '~/types';

type SessionResponse = {
  messages: MessageType[];
};

export const useSessionId = (sessionId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [sessionId],
    queryFn: () => getSessionById(sessionId),
    enabled: !!sessionId,
    select: (data: SessionResponse) => data.messages,
  });

  return {
    messages: data || [],
    isLoading,
  };
};
