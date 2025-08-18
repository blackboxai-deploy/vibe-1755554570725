import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Users, Calendar } from 'lucide-react';
import { Character } from '@/types';
import Link from 'next/link';

interface CharacterCardProps {
  character: Character;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export function CharacterCard({ 
  character, 
  showStats = true, 
  variant = 'default' 
}: CharacterCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={character.avatar} alt={character.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(character.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{character.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {truncateDescription(character.description, 50)}
              </p>
            </div>
            <Link href={`/characters/${character.id}/chat`}>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={character.avatar} alt={character.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                {getInitials(character.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{character.name}</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {character.category}
                </Badge>
              </div>
              <CardDescription className="mt-2 text-sm leading-relaxed">
                {truncateDescription(character.description, 120)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {showStats && (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{character.chatCount || 0} chats</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(character.createdAt)}</span>
                </div>
              </div>
              {character.isPublic && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Public</span>
                </div>
              )}
            </div>
          )}
          <div className="flex space-x-2">
            <Link href={`/characters/${character.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/characters/${character.id}/chat`} className="flex-1">
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={character.avatar} alt={character.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(character.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{character.name}</CardTitle>
              <Badge variant="secondary">
                {character.category}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-sm">
              {truncateDescription(character.description, 100)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showStats && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{character.chatCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(character.createdAt)}</span>
              </div>
            </div>
            {character.isPublic && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>Public</span>
              </div>
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <Link href={`/characters/${character.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Details
            </Button>
          </Link>
          <Link href={`/characters/${character.id}/chat`} className="flex-1">
            <Button size="sm" className="w-full">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}