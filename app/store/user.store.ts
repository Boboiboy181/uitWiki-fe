import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '~/types';

type UserState = {
  user: User;
  setUser: (messages: User) => void;
  token: string;
  setToken: (token: string) => void;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
      user: {} as User,
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user',
    },
  ),
);

export const useUser = () => useUserStore((state) => state);
