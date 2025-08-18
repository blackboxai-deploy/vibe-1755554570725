import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Plus, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';

const featuredCharacters = [
  {
    id: 'einstein',
    name: 'Albert Einstein',
    description: 'Brilliant physicist ready to discuss science, philosophy, and the mysteries of the universe.',
    category: 'Educational',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/de2c381d-9193-45e2-b001-85a648890b0b.png',
    chatCount: 1247,
    rating: 4.9
  },
  {
    id: 'sherlock',
    name: 'Sherlock Holmes',
    description: 'The world\'s greatest detective. Bring me your mysteries and puzzles to solve.',
    category: 'Fictional',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e5227536-5a3b-4177-8e01-dfebe601ebb5.png',
    chatCount: 892,
    rating: 4.8
  },
  {
    id: 'shakespeare',
    name: 'William Shakespeare',
    description: 'The Bard himself, ready to craft poetry, discuss literature, and share wisdom through verse.',
    category: 'Historical',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b71b8762-6090-4ac9-a1d7-6e130c909550.png',
    chatCount: 634,
    rating: 4.7
  },
  {
    id: 'yoda',
    name: 'Master Yoda',
    description: 'Wise Jedi Master I am. Guidance and wisdom, provide I will.',
    category: 'Fictional',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b98b6631-6066-4610-8085-7d5ad5114782.png',
    chatCount: 1156,
    rating: 4.9
  },
  {
    id: 'assistant',
    name: 'Friendly Assistant',
    description: 'Your helpful AI companion for any questions, tasks, or friendly conversations.',
    category: 'General',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8d24c1c2-af2e-4ea8-85aa-56aefa8c1af4.png',
    chatCount: 2341,
    rating: 4.6
  },
  {
    id: 'socrates',
    name: 'Socrates',
    description: 'Ancient Greek philosopher who will challenge your thinking through thoughtful questions.',
    category: 'Historical',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0e9a00f9-0abc-485f-b249-815a9f8b0043.png',
    chatCount: 445,
    rating: 4.8
  }
];

const categories = [
  { name: 'All', count: 156, color: 'bg-gray-100 text-gray-800' },
  { name: 'Fictional', count: 67, color: 'bg-blue-100 text-blue-800' },
  { name: 'Historical', count: 34, color: 'bg-green-100 text-green-800' },
  { name: 'Educational', count: 28, color: 'bg-purple-100 text-purple-800' },
  { name: 'Entertainment', count: 27, color: 'bg-pink-100 text-pink-800' }
];

function CharacterCard({ character }: { character: typeof featuredCharacters[0] }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={character.avatar} alt={character.name} />
            <AvatarFallback>{character.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{character.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {character.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {character.rating}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {character.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageCircle className="h-3 w-3" />
            {character.chatCount.toLocaleString()} chats
          </div>
          <Link href={`/characters/${character.id}/chat`}>
            <Button size="sm" className="group-hover:bg-primary/90">
              Chat Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryBadge({ category }: { category: typeof categories[0] }) {
  return (
    <Link href={`/characters?category=${category.name.toLowerCase()}`}>
      <Badge 
        variant="secondary" 
        className={`${category.color} hover:opacity-80 transition-opacity cursor-pointer px-3 py-1`}
      >
        {category.name} ({category.count})
      </Badge>
    </Link>
  );
}

function HeroSection() {
  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
        Chat with AI Characters
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Engage in conversations with fascinating AI personalities. From historical figures to fictional characters, 
        discover endless possibilities for learning and entertainment.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/characters">
          <Button size="lg" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Browse Characters
          </Button>
        </Link>
        <Link href="/characters/create">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Character
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-primary mb-2">150+</div>
          <div className="text-muted-foreground">AI Characters</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-primary mb-2">50K+</div>
          <div className="text-muted-foreground">Conversations</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-primary mb-2">24/7</div>
          <div className="text-muted-foreground">Available</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <div className="container mx-auto px-4">
        <StatsSection />
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <CategoryBadge key={category.name} category={category} />
          ))}
        </div>
      </div>

      {/* Featured Characters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Characters</h2>
          <Link href="/characters">
            <Button variant="outline">
              View All
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </Suspense>
      </div>

      {/* Call to Action Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Character?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bring your imagination to life by creating unique AI personalities. 
            Define their traits, backstory, and conversation style.
          </p>
          <Link href="/characters/create">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Your Character
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}