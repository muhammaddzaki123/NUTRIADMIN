import { Models } from 'react-native-appwrite';

export interface Message extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  chatId: string;      // format: "userId-nutritionistId"
  userId: string;      // relation to usersProfileCollection
  nutritionistId: string; // relation to ahligiziCollection
  text: string;        // min: 1, max: 1000
  sender: 'user' | 'nutritionist';
  time: string;        // format: datetime
  read: boolean;       // default: false
  userDetails?: User;  // User details for displaying names
}

export interface Nutritionist extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  name: string;        // min: 2, max: 100
  email: string;       // format: email, unique
  userType: 'nutritionist';
  specialization: 'kanker' | 'hipertensi' | 'diabetes';
  type: 'Konsultasi Online';
  description?: string; // max: 500
  avatar?: string;     // format: URL
  lastSeen: string;    // format: datetime
  status: 'online' | 'offline';
}

export interface User extends Models.Document {
  $id: string;
  name: string;
  email: string;
  userType: 'user' | 'nutritionist';
  avatar?: string;
}

export interface ChatSubscriptionResponse {
  events: string[];
  payload: Message;
}

export interface SendMessageData {
  userId: string;
  nutritionistId: string;
  text: string;
  chatId: string;
}

export interface ChatContextType {
  messages: { [key: string]: Message[] };
  addMessage: (nutritionistId: string, text: string) => Promise<void>;
  nutritionists: Nutritionist[];
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  markMessageAsRead: (messageId: string) => Promise<void>;
  unreadMessages: { [key: string]: number };
  loading: boolean;
}

export interface MessageState {
  [key: string]: Message[];
}

export interface UnreadMessageState {
  [key: string]: number;
}
