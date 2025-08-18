export interface Character {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar?: string;
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  chatCount?: number;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  characterId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  characterId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface CreateCharacterRequest {
  name: string;
  description: string;
  systemPrompt: string;
  category: string;
  avatar?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface ChatRequest {
  characterId: string;
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  messageId: string;
}

export interface CharacterFilter {
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'chatCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CharacterCategory = 
  | 'fictional'
  | 'historical'
  | 'educational'
  | 'entertainment'
  | 'assistant'
  | 'creative'
  | 'other';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface StorageData {
  characters: Character[];
  chatSessions: ChatSession[];
  userPreferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCategory: CharacterCategory;
  chatSettings: {
    showTypingIndicator: boolean;
    autoSave: boolean;
    messageLimit: number;
  };
}

export interface CharacterStats {
  totalChats: number;
  averageRating?: number;
  lastUsed?: Date;
  messageCount: number;
}