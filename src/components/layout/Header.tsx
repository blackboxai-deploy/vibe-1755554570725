"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MessageCircle, Users, Home } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/characters?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              CharacterAI
            </span>
          </Link>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/characters"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/characters") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Characters</span>
          </Link>
          <Link
            href="/characters/create"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/characters/create") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Link>
        </nav>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search characters..."
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Mobile Menu Button and Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/characters">
              <Users className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/characters/create">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Desktop Create Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/characters/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Character
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search characters..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}