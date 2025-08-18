import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  characterName?: string;
  characterAvatar?: string;
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  showActions?: boolean;
}

export function MessageBubble({
  message,
  characterName,
  characterAvatar,
  onCopy,
  onRegenerate,
  showActions = true
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };

  return (
    <div className={cn(
      "flex gap-3 p-4 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarImage src={characterAvatar} alt={characterName} />
            <AvatarFallback>
              {characterName?.charAt(0) || 'AI'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-2 rounded-2xl break-words",
          isUser 
            ? "bg-blue-500 text-white rounded-br-md" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>

        {/* Message Actions */}
        {showActions && (
          <div className={cn(
            "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser ? "flex-row-reverse" : "flex-row"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            {isAssistant && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}