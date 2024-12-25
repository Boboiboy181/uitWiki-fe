import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getNewSession } from '~/services';

type SessionState = {
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  getNewSessionId: () => Promise<void>;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

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
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'sessionId',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // Mark as hydrated when rehydration is done
      },
    },
  ),
);

export const useSession = () => useSessionStore((state) => state);
