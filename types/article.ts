import { Models } from "react-native-appwrite";

export interface Article extends Models.Document {
  title: string;
  description: string;
  image: string; 
  content: string;
  category: 'hipertensi' | 'diabetes' | 'kanker' | 'nutrisi' | 'diet' | 'kesehatan';
  author: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
}

export interface CreateArticleData {
  title: string;
  description: string;
  image: string; 
  content: string;
  category: Article['category'];
  author: string;
  tags: string[];
  isPublished: boolean;
  imageFile?: any; 
}
