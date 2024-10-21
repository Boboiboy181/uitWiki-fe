import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getNewSession } from '~/services';

interface SessionState {
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  getNewSessionId: () => Promise<void>;
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: '',
      setSessionId: (sessionId: string) => set({ sessionId }),
      getNewSessionId: async () => {
        try {
          const response = await getNewSession();
          set({ sessionId: response.sessionId });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: 'sessionId',
    },
  ),
);

export const useSession = () => useSessionStore((state) => state);
