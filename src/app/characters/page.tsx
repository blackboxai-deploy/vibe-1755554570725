'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types';
import { getCharacters } from '@/lib/storage';
import CharacterGrid from '@/components/character/CharacterGrid';
import CharacterSearch from '@/components/character/CharacterSearch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
  tags: string[];
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const allCharacters = await getCharacters();
        setCharacters(allCharacters);
        setFilteredCharacters(allCharacters);
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  const handleFiltersChange = (filters: SearchFilters) => {
    let filtered = characters;

    // Filter by search query
    if (filters.query.trim()) {
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        character.description.toLowerCase().includes(filters.query.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(character => character.category === filters.category);
    }

    // Sort characters
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.chatCount || 0) - (a.chatCount || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredCharacters(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Character Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and chat with AI characters created by the community
          </p>
        </div>
        <Link href="/characters/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Character
          </Button>
        </Link>
      </div>

      <CharacterSearch
        onFiltersChange={handleFiltersChange}
        totalResults={filteredCharacters.length}
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : filteredCharacters.length > 0 ? (
          <CharacterGrid characters={filteredCharacters} showSearch={false} />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              {filteredCharacters.length === 0 && characters.length > 0
                ? 'No characters found matching your criteria'
                : 'No characters available yet'
              }
            </div>
            {characters.length === 0 && (
              <Link href="/characters/create" className="mt-4 inline-block">
                <Button>Create the First Character</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {filteredCharacters.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCharacters.length} of {characters.length} characters
        </div>
      )}
    </div>
  );
}