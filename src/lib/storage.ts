import { Character, ChatSession, ChatMessage } from '@/types';

const STORAGE_KEYS = {
  CHARACTERS: 'character-ai-characters',
  CHAT_SESSIONS: 'character-ai-chat-sessions',
  USER_PREFERENCES: 'character-ai-preferences',
} as const;

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultCharacterCategory: string;
  chatHistoryLimit: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultCharacterCategory: 'all',
  chatHistoryLimit: 100,
};

// Character Storage Functions
export const saveCharacter = (character: Character): void => {
  const characters = getCharacters();
  const existingIndex = characters.findIndex(c => c.id === character.id);
  
  if (existingIndex >= 0) {
    characters[existingIndex] = { ...character, updatedAt: new Date() };
  } else {
    characters.push(character);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
};

export const getCharacters = (): Character[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (!stored) return [];
    
    const characters = JSON.parse(stored);
    return characters.map((char: any) => ({
      ...char,
      createdAt: new Date(char.createdAt),
      updatedAt: new Date(char.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
};

export const getCharacterById = (id: string): Character | null => {
  const characters = getCharacters();
  return characters.find(char => char.id === id) || null;
};

// Alias for compatibility
export const getCharacter = getCharacterById;

// Add missing getChatHistory function
export const getChatHistory = (characterId: string): ChatMessage[] => {
  const session = getChatSessionByCharacterId(characterId);
  return session ? session.messages : [];
};

export const deleteCharacter = (id: string): void => {
  const characters = getCharacters().filter(char => char.id !== id);
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  
  // Also delete associated chat sessions
  const sessions = getChatSessions().filter(session => session.characterId !== id);
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

export const searchCharacters = (query: string, category?: string): Character[] => {
  const characters = getCharacters();
  const lowercaseQuery = query.toLowerCase();
  
  return characters.filter(char => {
    const matchesQuery = !query || 
      char.name.toLowerCase().includes(lowercaseQuery) ||
      char.description.toLowerCase().includes(lowercaseQuery);
    
    const matchesCategory = !category || category === 'all' || char.category === category;
    
    return matchesQuery && matchesCategory;
  });
};

// Chat Session Storage Functions
export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = { ...session, updatedAt: new Date() };
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

export const getChatSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

export const getChatSessionByCharacterId = (characterId: string): ChatSession | null => {
  const sessions = getChatSessions();
  return sessions.find(session => session.characterId === characterId) || null;
};

export const addMessageToSession = (characterId: string, message: ChatMessage): void => {
  let session = getChatSessionByCharacterId(characterId);
  
  if (!session) {
    session = {
      id: `session-${characterId}-${Date.now()}`,
      characterId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  session.messages.push(message);
  session.updatedAt = new Date();
  
  // Limit message history based on user preferences
  const preferences = getUserPreferences();
  if (session.messages.length > preferences.chatHistoryLimit) {
    session.messages = session.messages.slice(-preferences.chatHistoryLimit);
  }
  
  saveChatSession(session);
};

export const clearChatSession = (characterId: string): void => {
  const sessions = getChatSessions().filter(session => session.characterId !== characterId);
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

export const deleteChatSession = (sessionId: string): void => {
  const sessions = getChatSessions().filter(session => session.id !== sessionId);
  localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
};

// User Preferences Functions
export const getUserPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!stored) return DEFAULT_PREFERENCES;
    
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
};

// Import/Export Functions
export const exportCharacter = (characterId: string): string | null => {
  const character = getCharacterById(characterId);
  if (!character) return null;
  
  return JSON.stringify(character, null, 2);
};

export const importCharacter = (characterData: string): Character | null => {
  try {
    const character = JSON.parse(characterData);
    
    // Validate required fields
    if (!character.name || !character.description || !character.systemPrompt) {
      throw new Error('Invalid character data: missing required fields');
    }
    
    // Generate new ID to avoid conflicts
    const importedCharacter: Character = {
      ...character,
      id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    saveCharacter(importedCharacter);
    return importedCharacter;
  } catch (error) {
    console.error('Error importing character:', error);
    return null;
  }
};

export const exportAllData = (): string => {
  const data = {
    characters: getCharacters(),
    chatSessions: getChatSessions(),
    preferences: getUserPreferences(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
};

export const importAllData = (dataString: string): boolean => {
  try {
    const data = JSON.parse(dataString);
    
    if (data.characters) {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(data.characters));
    }
    
    if (data.chatSessions) {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(data.chatSessions));
    }
    
    if (data.preferences) {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Utility Functions
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
  localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
};

export const getStorageStats = () => {
  const characters = getCharacters();
  const sessions = getChatSessions();
  const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
  
  return {
    charactersCount: characters.length,
    chatSessionsCount: sessions.length,
    totalMessagesCount: totalMessages,
    storageUsed: new Blob([
      localStorage.getItem(STORAGE_KEYS.CHARACTERS) || '',
      localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS) || '',
      localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '',
    ]).size,
  };
};

// Add missing saveChatMessage function
export const saveChatMessage = (message: ChatMessage): void => {
  addMessageToSession(message.characterId, message);
};

// Add missing createChatSession function  
export const createChatSession = (characterId: string): ChatSession => {
  const session: ChatSession = {
    id: `session-${characterId}-${Date.now()}`,
    characterId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  saveChatSession(session);
  return session;
};