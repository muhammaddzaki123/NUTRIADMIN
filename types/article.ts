// types/article.ts

export interface Article {
  $id: string;
  title: string;
  description: string;
  imageUrl: string; // Diubah dari 'image'
  content: string;
  category: 'hipertensi' | 'diabetes' | 'kanker' | 'nutrisi' | 'diet' | 'kesehatan';
  author: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  $createdAt: string;
  // ... properti lain dari Appwrite
}

export interface CreateArticleData {
  title: string;
  // description dihapus sesuai permintaan
  imageUrl: string;
  content: string;
  category: 'hipertensi' | 'diabetes' | 'kanker' | 'nutrisi' | 'diet' | 'kesehatan';
  author: string;
  tags: string[];
  isPublished: boolean;
}