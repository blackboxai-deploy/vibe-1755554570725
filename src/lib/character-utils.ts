import { Character, ChatSession, ChatMessage } from '@/types';

export const CHARACTER_CATEGORIES = [
  'Fictional',
  'Historical',
  'Educational',
  'Entertainment',
  'Helper',
  'Creative',
  'Philosophical',
  'Scientific'
] as const;

export type CharacterCategory = typeof CHARACTER_CATEGORIES[number];

export function generateCharacterId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Alias for compatibility
export const generateId = generateCharacterId;

export function generateChatSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateCharacter(character: Partial<Character>): string[] {
  const errors: string[] = [];

  if (!character.name || character.name.trim().length < 2) {
    errors.push('Character name must be at least 2 characters long');
  }

  if (!character.description || character.description.trim().length < 10) {
    errors.push('Character description must be at least 10 characters long');
  }

  if (!character.systemPrompt || character.systemPrompt.trim().length < 20) {
    errors.push('System prompt must be at least 20 characters long');
  }

  if (!character.category || !CHARACTER_CATEGORIES.includes(character.category as CharacterCategory)) {
    errors.push('Please select a valid category');
  }

  return errors;
}

export function createCharacter(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'chatCount'>): Character {
  const now = new Date();
  return {
    id: generateCharacterId(),
    createdAt: now,
    updatedAt: now,
    chatCount: 0,
    ...data
  };
}

export function updateCharacter(character: Character, updates: Partial<Character>): Character {
  return {
    ...character,
    ...updates,
    updatedAt: new Date()
  };
}

export function incrementChatCount(character: Character): Character {
  return {
    ...character,
    chatCount: (character.chatCount || 0) + 1,
    updatedAt: new Date()
  };
}

export function createChatSession(characterId: string): ChatSession {
  return {
    id: generateChatSessionId(),
    characterId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function addMessageToSession(session: ChatSession, content: string, role: 'user' | 'assistant'): ChatSession {
  const message: ChatMessage = {
    id: generateMessageId(),
    characterId: session.characterId,
    content,
    role,
    timestamp: new Date()
  };

  return {
    ...session,
    messages: [...session.messages, message],
    updatedAt: new Date()
  };
}

export function searchCharacters(characters: Character[], query: string): Character[] {
  if (!query.trim()) return characters;

  const searchTerm = query.toLowerCase().trim();
  return characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm) ||
    character.description.toLowerCase().includes(searchTerm) ||
    character.category.toLowerCase().includes(searchTerm)
  );
}

export function filterCharactersByCategory(characters: Character[], category: string): Character[] {
  if (!category || category === 'all') return characters;
  return characters.filter(character => character.category === category);
}

export function sortCharacters(characters: Character[], sortBy: 'name' | 'created' | 'popular'): Character[] {
  return [...characters].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.chatCount || 0) - (a.chatCount || 0);
      default:
        return 0;
    }
  });
}

export function getCharacterAvatar(character: Character): string {
  if (character.avatar) return character.avatar;
  
  // Generate a consistent avatar based on character name
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500'];
  const colorIndex = character.name.length % colors.length;
  const initials = character.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${colors[colorIndex].replace('bg-', '').replace('-500', '')}" rx="20"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${initials}</text>
    </svg>
  `)}`;
}

export function formatChatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function buildSystemPrompt(character: Character): string {
  return `You are ${character.name}. ${character.systemPrompt}

Important guidelines:
- Stay in character at all times
- Respond naturally and conversationally
- Keep responses engaging but concise
- Maintain the personality traits described above
- If asked about your nature, acknowledge you're an AI character but stay in role`;
}

export function exportCharacter(character: Character): string {
  const exportData = {
    name: character.name,
    description: character.description,
    systemPrompt: character.systemPrompt,
    category: character.category,
    avatar: character.avatar,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function importCharacter(jsonString: string): Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'chatCount'> | null {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.name || !data.description || !data.systemPrompt || !data.category) {
      throw new Error('Invalid character data');
    }
    
    return {
      name: data.name,
      description: data.description,
      systemPrompt: data.systemPrompt,
      category: data.category,
      avatar: data.avatar,
      isPublic: true
    };
  } catch (error) {
    console.error('Failed to import character:', error);
    return null;
  }
}