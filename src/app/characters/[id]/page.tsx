'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Calendar, Hash, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Character } from '@/types';
import { getCharacter, deleteCharacter, getChatHistory } from '@/lib/storage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function CharacterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (characterId) {
      const char = getCharacter(characterId);
      if (char) {
        setCharacter(char);
        const history = getChatHistory(characterId);
        setChatCount(history.length);
      }
      setLoading(false);
    }
  }, [characterId]);

  const handleStartChat = () => {
    router.push(`/characters/${characterId}/chat`);
  };

  const handleEdit = () => {
    router.push(`/characters/create?edit=${characterId}`);
  };

  const handleDelete = () => {
    if (character) {
      deleteCharacter(character.id);
      router.push('/characters');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Character Not Found</h1>
          <p className="text-gray-600 mb-6">The character you're looking for doesn't exist.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Character Details</h1>
        </div>

        {/* Character Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback className="text-2xl">
                    {character.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{character.name}</CardTitle>
                  <CardDescription className="text-lg mb-4">
                    {character.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {new Date(character.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {chatCount} conversations
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      <Badge variant="secondary">{character.category}</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Character</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{character.name}"? This action cannot be undone and will also delete all chat history with this character.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personality Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personality & Behavior</CardTitle>
            <CardDescription>
              How this character will behave in conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {character.systemPrompt}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleStartChat} size="lg" className="flex-1">
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Conversation
          </Button>
          <Button onClick={() => router.push('/characters')} variant="outline" size="lg">
            Browse More Characters
          </Button>
        </div>

        {/* Stats Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{chatCount}</div>
                <div className="text-sm text-gray-600">Total Conversations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {character.isPublic ? 'Public' : 'Private'}
                </div>
                <div className="text-sm text-gray-600">Visibility</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(character.systemPrompt.length / 100)}
                </div>
                <div className="text-sm text-gray-600">Complexity Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}