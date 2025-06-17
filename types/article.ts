// types/article.ts

import { Models } from "react-native-appwrite";

/**
 * Interface yang merepresentasikan struktur data dari sebuah dokumen artikel
 * yang diambil dari database Appwrite.
 */
export interface Article extends Models.Document {
  title: string;
  description: string;
  image: string; // Diubah dari 'image'
  content: string;
  category: 'hipertensi' | 'diabetes' | 'kanker' | 'nutrisi' | 'diet' | 'kesehatan';
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
  description?: string; // Dibuat opsional
  image: string;
  content: string;
  category: Article['category']; // Menggunakan tipe enum dari Article
  author: string;
  tags: string[];
  isPublished: boolean;
  imageFile?: any; // Opsional, untuk menampung data file dari image picker
}
