// lib/notification-service.ts

import { CreateNotificationParams } from '../types/notification';
import { config, databases } from './appwrite';

export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
  try {
    const dataPayload = params.data ? JSON.stringify(params.data) : '{}';

    await databases.createDocument(
      config.databaseId!,
      config.notificationsCollectionId!,
      'unique()',
      {
        userId: params.userId,
        type: params.type,
        title: params.title,
        description: params.description,
        timestamp: new Date().toISOString(),
        read: params.read || false,
        data: dataPayload,
      }
    );
  } catch (error) {
    console.error('Error in createNotification:', error);
    throw error;
  }
};

export const createArticleNotification = async (
  articleId: string,
  articleTitle: string,
  articleSummary: string,
  userIds: string[]
): Promise<void> => {
  try {
    const notificationPromises = userIds.map(userId =>
      createNotification({
        userId,
        type: 'article',
        title: 'Artikel Baru Tersedia',
        description: articleSummary,
        data: { articleId, articleTitle }
      })
    );
    await Promise.all(notificationPromises);
    console.log(`Berhasil membuat notifikasi artikel untuk ${userIds.length} pengguna.`);
  } catch (error) {
    console.error('Error creating article notifications:', error);
    throw error;
  }
};