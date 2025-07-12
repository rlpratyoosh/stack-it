'use client';

import { useState, useMemo } from 'react';
import { useOptimistic } from 'react';
import QuestionCard from './Question-Card';
import QuestionSearch, { SortOption, FilterOption } from './QuestionSearch';

type Question = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  user: { username: string };
  tags: { tag: { id: string; name: string } }[];
  answers: unknown[];
  userId: string;
  acceptedAnswerId?: string | null;
};

type QuestionsWithSearchProps = {
  questions: Question[];
  currentUserId?: string;
};

export default function QuestionsWithSearch({ questions, currentUserId }: QuestionsWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  
  const [optimisticQuestions, deleteOptimisticQuestion] = useOptimistic(
    questions,
    (state, deletedQuestionId: string) => 
      state.filter(q => q.id !== deletedQuestionId)
  );

  const handleOptimisticDelete = (questionId: string) => {
    deleteOptimisticQuestion(questionId);
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = optimisticQuestions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.user.username.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.tag.name.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'unanswered':
        filtered = filtered.filter(q => q.answers.length === 0);
        break;
      case 'answered':
        filtered = filtered.filter(q => q.answers.length > 0);
        break;
      case 'accepted':
        filtered = filtered.filter(q => q.acceptedAnswerId);
        break;
      // 'all' shows everything, no additional filtering needed
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-answers':
        filtered.sort((a, b) => b.answers.length - a.answers.length);
        break;
      case 'least-answers':
        filtered.sort((a, b) => a.answers.length - b.answers.length);
        break;
    }

    return filtered;
  }, [optimisticQuestions, searchQuery, sortBy, filterBy]);

  return (
    <div className="space-y-6">
      <QuestionSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        totalCount={optimisticQuestions.length}
        filteredCount={filteredAndSortedQuestions.length}
      />
      
      {filteredAndSortedQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-4">
            {searchQuery || filterBy !== 'all' 
              ? "No questions match your search criteria."
              : "No questions posted yet."
            }
          </p>
          {searchQuery && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              title={q.title}
              description={q.description}
              createdAt={q.createdAt.toISOString()}
              author={q.user}
              tags={q.tags}
              answersCount={q.answers.length}
              canDelete={currentUserId === q.userId}
              onOptimisticDelete={handleOptimisticDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
