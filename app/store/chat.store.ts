import { create, StateCreator } from 'zustand';
import { MessageType } from '~/types';
import { logger } from './middleware';

type ChatState = {
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType) => void;
};

const useChatStore = create<ChatState>()(
  (process.env.NODE_ENV === 'development' ? logger : (fn: StateCreator<ChatState>) => fn)((set) => ({
    messages: [],
    setMessages: (messages: MessageType[]) => set({ messages }),
    addMessage: (message: MessageType) => set((state) => ({ messages: [...state.messages, message] })),
  })),
);

export const useChat = () => useChatStore((state) => state);
