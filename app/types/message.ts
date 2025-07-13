export type MessageType = {
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  isLoading?: boolean;
  messageId: string;
};
