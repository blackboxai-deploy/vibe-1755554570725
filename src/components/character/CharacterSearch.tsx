"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
  tags: string[];
}

interface CharacterSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults?: number;
}

const CATEGORIES = [
  "All Categories",
  "Fictional",
  "Historical",
  "Educational",
  "Entertainment",
  "Anime/Manga",
  "Movies/TV",
  "Games",
  "Books",
  "Original",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

const AVAILABLE_TAGS = [
  "Friendly",
  "Wise",
  "Funny",
  "Mysterious",
  "Romantic",
  "Adventure",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Comedy",
  "Drama",
  "Action",
];

export default function CharacterSearch({
  onFiltersChange,
  totalResults = 0,
}: CharacterSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "All Categories",
    sortBy: "newest",
    tags: [],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ query: value });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const removeTag = (tag: string) => {
    const newTags = filters.tags.filter((t) => t !== tag);
    updateFilters({ tags: newTags });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      query: "",
      category: "All Categories",
      sortBy: "newest",
      tags: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.query ||
    filters.category !== "All Categories" ||
    filters.tags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search characters by name or description..."
          value={filters.query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Category Filter */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Filter by Tags</h4>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label
                        htmlFor={tag}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Tags */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalResults > 0 ? (
          <>
            Showing {totalResults} character{totalResults !== 1 ? "s" : ""}
            {filters.query && ` for "${filters.query}"`}
            {filters.category !== "All Categories" &&
              ` in ${filters.category}`}
          </>
        ) : (
          "No characters found"
        )}
      </div>
    </div>
  );
}