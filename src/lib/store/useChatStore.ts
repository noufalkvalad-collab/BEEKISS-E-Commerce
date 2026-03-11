import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: 'NAVIGATE_ORDERS';
}

interface ChatStore {
  isOpen: boolean;
  messages: Message[];
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Hello! I am Bee, your virtual assistant. How can I help you today?',
    },
  ],
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Math.random().toString(36).substring(7) },
      ],
    })),
  clearMessages: () =>
    set({
      messages: [
        {
          id: 'greeting',
          role: 'assistant',
          content: 'Hello! I am Bee, your virtual assistant. How can I help you today?',
        },
      ],
    }),
}));
