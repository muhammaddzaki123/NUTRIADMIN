import { Message as BaseMessage } from '../constants/chat';

export type MessageStatus = 'temporary' | 'sending' | 'sent' | 'failed';

export interface EnhancedMessage extends BaseMessage {
  status: MessageStatus;
  tempId?: string;
  processedAt?: number;
}

export interface MessageState {
  [chatId: string]: EnhancedMessage[];
}
