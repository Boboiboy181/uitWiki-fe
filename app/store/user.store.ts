import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '~/types';

type UserState = {
  user: User;
  setUser: (messages: User) => void;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {} as User,
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user',
    },
  ),
);

export const useUser = () => useUserStore((state) => state);
