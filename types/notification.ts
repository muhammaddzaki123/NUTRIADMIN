import { Models } from 'react-native-appwrite';
import { Nutritionist } from '../constants/chat';
import { RecallData } from '../lib/recall-service';
import { Article } from './article';

export type NotificationType = 'chat' | 'article' | 'recall';

export interface NotificationData {
  chatId?: string;
  articleId?: string;
  nutritionistId?: string;
  recallId?: string;
  userId?: string;
  isRecallShare?: boolean;
  articleTitle?: string;
  recallData?: RecallData;
  articleData?: Article;
}

// Base notification interface
export interface Notification {
  $id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read?: boolean;
  data?: NotificationData;
}

// Parameters for getting notifications
export interface NotificationParams {
  userId: string;
  unreadMessages?: { [key: string]: number };
  nutritionists?: Nutritionist[];
  page?: number;
  pageSize?: number;
}

// Props for notification item component
export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  onPress: () => void;
  onDelete: () => void;
  read?: boolean;
}

// Parameters for creating a notification
export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  read?: boolean;
  data?: NotificationData;
}

// Extended notification document from Appwrite
export interface NotificationDocument extends Models.Document {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  data?: NotificationData;
}