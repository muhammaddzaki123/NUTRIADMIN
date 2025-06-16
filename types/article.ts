// types/article.ts

/**
 * Interface yang merepresentasikan struktur data dari sebuah dokumen artikel
 * yang diambil dari database Appwrite.
 */
export interface Article {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
}

/**
 * Interface untuk data yang dibutuhkan saat membuat artikel baru.
 * Digunakan dalam form di aplikasi admin.
 */
export interface CreateArticleData {
  title: string;
  description: string;
  content: string;
  category: string;
  image?: string; // Opsional, karena gambar bisa diunggah terpisah
  author: string;
  tags: string[];
  isPublished?: boolean;
  viewCount?: number;
}