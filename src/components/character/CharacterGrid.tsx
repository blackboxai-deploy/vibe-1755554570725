"use client";

import { Character } from "@/types";
import { CharacterCard } from "./CharacterCard";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CharacterGridProps {
  characters: Character[];
  showSearch?: boolean;
  maxItems?: number;
  className?: string;
}

function CharacterGrid({ 
  characters, 
  showSearch = true, 
  maxItems,
  className = "" 
}: CharacterGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(characters.map(char => char.category)));
    return ["all", ...cats];
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    let filtered = characters;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(char => char.category === selectedCategory);
    }

    // Limit items if maxItems is specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [characters, searchTerm, selectedCategory, maxItems]);

  return (
    <div className={`space-y-6 ${className}`}>
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchTerm || selectedCategory !== "all" 
              ? "No characters found matching your criteria." 
              : "No characters available yet."}
          </p>
          {(searchTerm || selectedCategory !== "all") && (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filter settings.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}

      {maxItems && characters.length > maxItems && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(maxItems, filteredCharacters.length)} of {characters.length} characters
          </p>
        </div>
      )}
    </div>
  );
}

// Named export
export { CharacterGrid };

// Default export for compatibility
export default CharacterGrid;