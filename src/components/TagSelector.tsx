'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
  maxTags?: number;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags = [],
  maxTags = 5,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(
        tag => 
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  }, [inputValue, availableTags, selectedTags]);

  const addTag = (tag: string) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && selectedTags.length < maxTags && !selectedTags.includes(newTag)) {
        addTag(newTag);
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add tags (${selectedTags.length}/${maxTags})`}
          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
          disabled={selectedTags.length >= maxTags}
        />

        {/* Suggestion Dropdown */}
        {filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md shadow-lg max-h-32 overflow-y-auto">
            {filteredTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick add button for new tag */}
      {inputValue.trim() && 
       !availableTags.includes(inputValue.trim()) && 
       selectedTags.length < maxTags && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(inputValue.trim())}
          className="text-xs"
        >
          Add &quot;{inputValue.trim()}&quot; as new tag
        </Button>
      )}
    </div>
  );
}
