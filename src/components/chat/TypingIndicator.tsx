"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  characterName: string;
  characterAvatar?: string;
  isVisible: boolean;
}

export function TypingIndicator({ characterName, characterAvatar, isVisible }: TypingIndicatorProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in-0 slide-in-from-left-2 duration-300">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={characterAvatar} alt={characterName} />
        <AvatarFallback className="text-xs bg-primary/10">
          {characterName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{characterName} is typing</span>
          <div className="flex gap-1 ml-2">
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}