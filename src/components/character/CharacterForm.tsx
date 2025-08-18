"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Sparkles, Eye, Save } from "lucide-react";
import { Character } from "@/types";
import { saveCharacter } from "@/lib/storage";
import { generateId } from "@/lib/character-utils";

const characterSchema = z.object({
  name: z.string().min(1, "Character name is required").max(50, "Name must be 50 characters or less"),
  description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be 200 characters or less"),
  systemPrompt: z.string().min(20, "System prompt must be at least 20 characters").max(1000, "System prompt must be 1000 characters or less"),
  category: z.string().min(1, "Please select a category"),
  isPublic: z.boolean(),
  avatar: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

const categories = [
  "Fictional",
  "Historical",
  "Educational",
  "Entertainment",
  "Helper",
  "Creative",
  "Roleplay",
  "Professional",
  "Fantasy",
  "Sci-Fi"
];

const defaultAvatars = [
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3698990d-4c49-49e2-b70b-062b492c820d.png",
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9cc916e3-f829-4e39-97e1-92158e35a714.png",
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d11a7f70-4101-4b77-9dd6-cad260e45bf5.png",
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/96c26a68-3073-4c2d-9834-9016d0d66283.png",
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3d38bad7-1e9f-447f-b609-0a32fb3cb812.png",
  "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/db9e850a-3382-4279-a847-e3c2be0fc3ff.png"
];

interface CharacterFormProps {
  character?: Character;
  onSuccess?: (character: Character) => void;
}

export function CharacterForm({ character, onSuccess }: CharacterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(character?.avatar || defaultAvatars[0]);

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: character?.name || "",
      description: character?.description || "",
      systemPrompt: character?.systemPrompt || "",
      category: character?.category || "",
      isPublic: character?.isPublic ?? true,
      avatar: character?.avatar || defaultAvatars[0],
    },
  });

  const watchedValues = form.watch();

  const onSubmit = async (data: CharacterFormData) => {
    setIsLoading(true);
    try {
      const characterData: Character = {
        id: character?.id || generateId(),
        ...data,
        avatar: selectedAvatar,
        createdAt: character?.createdAt || new Date(),
        updatedAt: new Date(),
        chatCount: character?.chatCount || 0,
      };

      saveCharacter(characterData);
      
      if (onSuccess) {
        onSuccess(characterData);
      } else {
        router.push(`/characters/${characterData.id}`);
      }
    } catch (error) {
      console.error("Error saving character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewCharacter: Character = {
    id: "preview",
    name: watchedValues.name || "Unnamed Character",
    description: watchedValues.description || "No description provided",
    systemPrompt: watchedValues.systemPrompt || "",
    category: watchedValues.category || "Uncategorized",
    isPublic: watchedValues.isPublic ?? true,
    avatar: selectedAvatar,
    createdAt: new Date(),
    updatedAt: new Date(),
    chatCount: 0,
  };

  if (previewMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Character Preview</h2>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <Save className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={previewCharacter.avatar} alt={previewCharacter.name} />
              <AvatarFallback>
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{previewCharacter.name}</CardTitle>
            <CardDescription className="text-lg">{previewCharacter.description}</CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary">{previewCharacter.category}</Badge>
              {previewCharacter.isPublic && <Badge variant="outline">Public</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personality & Behavior:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {previewCharacter.systemPrompt || "No personality defined yet."}
                </p>
              </div>
              <Separator />
              <div className="flex justify-center">
                <Button onClick={() => setPreviewMode(false)} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Continue Editing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {character ? "Edit Character" : "Create New Character"}
          </h2>
          <p className="text-muted-foreground">
            {character ? "Update your character's details" : "Bring your AI character to life"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setPreviewMode(true)}
          disabled={!watchedValues.name || !watchedValues.description}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Define your character's identity and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sherlock Holmes, Einstein, Yoda" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a memorable name for your character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brilliant detective with exceptional deductive reasoning skills..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description that users will see when browsing characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Avatar</FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedAvatar} alt="Character avatar" />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid grid-cols-6 gap-2">
                    {defaultAvatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-10 h-10 rounded-full border-2 transition-colors ${
                          selectedAvatar === avatar
                            ? "border-primary"
                            : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <Avatar className="w-full h-full">
                          <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    ))}
                  </div>
                </div>
                <FormDescription>
                  Select an avatar for your character
                </FormDescription>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Help users discover your character by category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Personality & Behavior
              </CardTitle>
              <CardDescription>
                Define how your character thinks, speaks, and behaves
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You are Sherlock Holmes, the world's greatest detective. You speak with Victorian-era eloquence, use deductive reasoning in every conversation, and often reference your cases. You are observant, logical, but also have a dry wit..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This defines your character's personality, speaking style, and behavior. Be specific about how they should respond and interact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
              <CardDescription>
                Control how your character is shared with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Character</FormLabel>
                      <FormDescription>
                        Allow other users to discover and chat with this character
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {character ? "Update Character" : "Create Character"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}