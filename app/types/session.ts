import { MessageType } from './message';

export type Session = {
  _id: string;
  sessionId: string;
  messages: MessageType[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
