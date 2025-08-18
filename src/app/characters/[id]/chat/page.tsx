'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Bot, Copy, RotateCcw, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Character {
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
}

interface ChatMessage {
  id: string;
  characterId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  characterId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadCharacter();
    loadChatHistory();
  }, [characterId]);

  const loadCharacter = () => {
    try {
      const characters = JSON.parse(localStorage.getItem('characters') || '[]');
      const foundCharacter = characters.find((c: Character) => c.id === characterId);
      
      if (!foundCharacter) {
        // Try loading from default characters
        const defaultCharacters = getDefaultCharacters();
        const defaultCharacter = defaultCharacters.find(c => c.id === characterId);
        
        if (!defaultCharacter) {
          toast({
            title: "Character not found",
            description: "The character you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push('/characters');
          return;
        }
        setCharacter(defaultCharacter);
      } else {
        setCharacter(foundCharacter);
      }
    } catch (error) {
      console.error('Error loading character:', error);
      toast({
        title: "Error",
        description: "Failed to load character data.",
        variant: "destructive",
      });
    }
  };

  const loadChatHistory = () => {
    try {
      const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const session = chatSessions.find((s: ChatSession) => s.characterId === characterId);
      
      if (session) {
        setMessages(session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = (newMessages: ChatMessage[]) => {
    try {
      const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const sessionIndex = chatSessions.findIndex((s: ChatSession) => s.characterId === characterId);
      
      const session: ChatSession = {
        id: sessionIndex >= 0 ? chatSessions[sessionIndex].id : generateId(),
        characterId,
        messages: newMessages,
        createdAt: sessionIndex >= 0 ? new Date(chatSessions[sessionIndex].createdAt) : new Date(),
        updatedAt: new Date()
      };

      if (sessionIndex >= 0) {
        chatSessions[sessionIndex] = session;
      } else {
        chatSessions.push(session);
      }

      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !character) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      characterId,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: character.systemPrompt
            },
            ...newMessages.slice(-10).map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        characterId,
        content: data.content || 'I apologize, but I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard.",
    });
  };

  const regenerateResponse = async () => {
    if (messages.length === 0 || isLoading) return;

    const lastUserMessageIndex = messages.findLastIndex(msg => msg.role === 'user');
    if (lastUserMessageIndex === -1) return;

    const messagesUpToLastUser = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesUpToLastUser);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: character?.systemPrompt || ''
            },
            ...messagesUpToLastUser.slice(-10).map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        characterId,
        content: data.content || 'I apologize, but I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...messagesUpToLastUser, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    try {
      const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const filteredSessions = chatSessions.filter((s: ChatSession) => s.characterId !== characterId);
      localStorage.setItem('chatSessions', JSON.stringify(filteredSessions));
      
      toast({
        title: "Chat cleared",
        description: "Chat history has been cleared.",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading character...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback>
                  {character.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-lg truncate">{character.name}</h1>
                <p className="text-sm text-muted-foreground truncate">{character.description}</p>
              </div>
              
              <Badge variant="secondary">{character.category}</Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                <p className="text-muted-foreground mb-4">
                  Say hello to {character.name} and start chatting!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Hello! How are you today?")}
                  >
                    Say Hello
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Tell me about yourself")}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("What can you help me with?")}
                  >
                    Get Help
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={character.avatar} alt={character.name} />
                        <AvatarFallback>
                          {character.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col gap-1 max-w-[80%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}>
                      <Card className={`${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <CardContent className="p-3">
                          <p className="whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {message.role === 'assistant' && index === messages.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={regenerateResponse}
                            disabled={isLoading}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={character.avatar} alt={character.name} />
                      <AvatarFallback>
                        {character.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Card className="bg-muted">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          </div>
                          <span className="text-sm text-muted-foreground ml-2">
                            {character.name} is typing...
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message ${character.name}...`}
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="lg"
              className="h-[60px] px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getDefaultCharacters(): Character[] {
  return [
    {
      id: 'einstein',
      name: 'Albert Einstein',
      description: 'Brilliant physicist and philosopher, ready to discuss science, mathematics, and the mysteries of the universe.',
      systemPrompt: 'You are Albert Einstein, the renowned theoretical physicist. You are curious, thoughtful, and passionate about understanding the universe. You speak with wisdom and often use analogies to explain complex concepts. You value imagination over knowledge and believe in the power of questioning everything. You are humble despite your genius and often express wonder at the beauty of nature and physics.',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cc330872-6c97-48a0-9bdf-1cd28d787d9d.png',
      category: 'Historical',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0
    },
    {
      id: 'sherlock',
      name: 'Sherlock Holmes',
      description: 'The world\'s greatest detective, master of deduction and logical reasoning.',
      systemPrompt: 'You are Sherlock Holmes, the brilliant consulting detective from Victorian London. You are highly observant, logical, and possess extraordinary deductive abilities. You speak in a refined, articulate manner and often notice details others miss. You enjoy intellectual challenges and solving mysteries. You can be somewhat aloof but are passionate about justice and truth. You often explain your reasoning process and encourage others to observe more carefully.',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/48f81c37-1ae1-4c9c-8cd1-4a81f756fdd2.png',
      category: 'Fictional',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0
    },
    {
      id: 'shakespeare',
      name: 'William Shakespeare',
      description: 'The Bard himself, master of language, poetry, and human nature.',
      systemPrompt: 'You are William Shakespeare, the greatest playwright and poet in the English language. You speak with eloquence and creativity, often using metaphors and poetic language. You have deep insights into human nature and can discuss love, ambition, tragedy, and comedy with equal skill. You are passionate about storytelling and the power of words. While you can speak in modern English, you occasionally use Elizabethan phrases and have a theatrical flair.',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d8006132-e406-460a-acf4-43338b57ad9f.png',
      category: 'Historical',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0
    },
    {
      id: 'yoda',
      name: 'Master Yoda',
      description: 'Wise Jedi Master, teacher of the Force and ancient wisdom.',
      systemPrompt: 'You are Master Yoda, the wise and ancient Jedi Master. You speak in your characteristic inverted syntax and offer profound wisdom about the Force, life, and the balance between light and dark. You are patient, compassionate, and deeply spiritual. You often teach through riddles and encourage others to look within themselves for answers. You have lived for centuries and possess great knowledge of the galaxy and the ways of the Force.',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7870f15f-ea41-479d-8ae1-775e83789198.png',
      category: 'Fictional',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0
    },
    {
      id: 'assistant',
      name: 'Friendly Assistant',
      description: 'A helpful, knowledgeable, and friendly AI assistant ready to help with any questions or tasks.',
      systemPrompt: 'You are a friendly, helpful, and knowledgeable AI assistant. You are patient, understanding, and always eager to help. You can assist with a wide variety of topics including answering questions, providing explanations, helping with creative tasks, offering advice, and engaging in meaningful conversations. You are respectful, honest, and maintain a positive attitude while being genuinely helpful.',
      avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d4869910-5296-4c60-8fc3-5893b2df4509.png',
      category: 'Assistant',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0
    }
  ];
}