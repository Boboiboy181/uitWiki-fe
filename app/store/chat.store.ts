import { create } from 'zustand';
import { MessageType } from '~/types';

type ChatState = {
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType) => void;
  isLoading: boolean;
  isError: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsError: (isError: boolean) => void;
};

const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  setMessages: (messages: MessageType[]) => set({ messages }),
  addMessage: (message: MessageType) => set((state) => ({ messages: [...state.messages, message] })),
  isLoading: false,
  isError: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsError: (isError: boolean) => set({ isError }),
}));

export const useChat = () => useChatStore((state) => state);
