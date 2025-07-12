'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SortOption = 'newest' | 'oldest' | 'most-answers' | 'least-answers';
export type FilterOption = 'all' | 'unanswered' | 'answered' | 'accepted';

interface QuestionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  totalCount: number;
  filteredCount: number;
}

export default function QuestionSearch({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  totalCount,
  filteredCount,
}: QuestionSearchProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-answers', label: 'Most Answers' },
    { value: 'least-answers', label: 'Least Answers' },
  ];

  const filterOptions: { value: FilterOption; label: string; description: string }[] = [
    { value: 'all', label: 'All Questions', description: 'Show all questions' },
    { value: 'unanswered', label: 'Unanswered', description: 'Questions with no answers' },
    { value: 'answered', label: 'Answered', description: 'Questions with at least one answer' },
    { value: 'accepted', label: 'Solved', description: 'Questions with accepted answers' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm space-y-3 sm:space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        {/* Results Count */}
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          {searchQuery || filterBy !== 'all' ? (
            <>
              Showing {filteredCount} of {totalCount} questions
              {searchQuery && (
                <span className="ml-1">
                  for &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </>
          ) : (
            `${totalCount} questions in our community`
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center order-1 sm:order-2">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filter</span>
            <span className="sm:hidden">Filter</span>
            {filterBy !== 'all' && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-2 sm:px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 sm:pt-4">
          <h3 className="text-sm font-medium mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
            Filter by Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`p-2 sm:p-3 rounded-lg border text-left transition-colors ${
                  filterBy === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="font-medium text-xs sm:text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
