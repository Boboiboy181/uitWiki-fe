export type MessageType = {
  sessionId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
};
