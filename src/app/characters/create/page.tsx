'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bot, Save, Eye } from 'lucide-react';
import { Character } from '@/types';
import { saveCharacter } from '@/lib/storage';
import { generateId } from '@/lib/character-utils';

const categories = [
  'Fictional',
  'Historical',
  'Educational',
  'Entertainment',
  'Helper',
  'Creative',
  'Roleplay',
  'Other'
];

export default function CreateCharacterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    category: '',
    isPublic: true,
    avatar: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.systemPrompt.trim() || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const character: Character = {
        id: generateId(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        systemPrompt: formData.systemPrompt.trim(),
        category: formData.category,
        isPublic: formData.isPublic,
        avatar: formData.avatar || `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b5f3e720-1fb9-4655-9cb4-512236f96cab.png}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatCount: 0
      };

      saveCharacter(character);
      router.push(`/characters/${character.id}`);
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!formData.name.trim()) {
      alert('Please enter a character name first');
      return;
    }
    
    const previewPrompt = `Character: ${formData.name}\nDescription: ${formData.description}\nPersonality: ${formData.systemPrompt}\n\nHow would this character respond to: "Hello, nice to meet you!"`;
    alert(previewPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Create Character
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Bring your AI character to life
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Define your character's identity and appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Character Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Sherlock Holmes, Einstein, Luna"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="A brief description of your character (what they do, their background, etc.)"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="avatar">Avatar URL (optional)</Label>
                        <Input
                          id="avatar"
                          placeholder="https://example.com/avatar.jpg"
                          value={formData.avatar}
                          onChange={(e) => handleInputChange('avatar', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personality & Behavior */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personality & Behavior</CardTitle>
                    <CardDescription>
                      Define how your character thinks, speaks, and behaves
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="systemPrompt">System Prompt *</Label>
                      <Textarea
                        id="systemPrompt"
                        placeholder="You are [character name]. You are [personality traits]. You speak in [speaking style]. You [behavioral patterns]. Always [key behaviors]..."
                        value={formData.systemPrompt}
                        onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                        className="mt-1 min-h-[200px] font-mono text-sm"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        This prompt defines your character's personality, speaking style, and behavior patterns.
                        Be specific about how they should respond and interact.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Configure your character's visibility and sharing options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic">Make Public</Label>
                        <p className="text-sm text-gray-500">
                          Allow others to discover and chat with your character
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Character Avatar */}
                    <div className="flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt={formData.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          formData.name.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                    </div>

                    {/* Character Info */}
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-lg">
                        {formData.name || 'Character Name'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.category || 'Category'}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {formData.description || 'Character description will appear here...'}
                      </p>
                    </div>

                    {/* Preview Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePreview}
                      className="w-full"
                      disabled={!formData.name.trim()}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Response
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.description.trim() || !formData.systemPrompt.trim() || !formData.category}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Character
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}