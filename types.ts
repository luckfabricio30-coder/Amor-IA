export enum MessageRole {
  User = 'user',
  Model = 'model',
}

export interface Character {
  id: string;
  name: string;
  age: number;
  job: string;
  bio: string;
  avatar: string; // URL
  coverImage: string; // URL
  systemInstruction: string;
  personality: string;
  interests: string[];
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  image?: string; // Base64 string for images sent by model
  timestamp: number;
  isThinking?: boolean;
}

export interface ChatSession {
  characterId: string;
  messages: Message[];
  lastUpdated: number;
}