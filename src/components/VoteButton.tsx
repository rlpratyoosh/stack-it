'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { voteOnAnswer } from '@/lib/action';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface VoteButtonProps {
  answerId: string;
  currentUserVote?: number; // 1, -1, or undefined
  totalScore: number;
}

export default function VoteButton({
  answerId,
  currentUserVote,
  totalScore,
}: VoteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticVote, setOptimisticVote] = useState(currentUserVote);
  const [optimisticScore, setOptimisticScore] = useState(totalScore);

  const handleVote = (value: number) => {
    if (isPending) return;

    // Optimistic update
    let newVote: number | undefined;
    let scoreDelta = 0;

    if (optimisticVote === value) {
      // Remove vote if clicking the same button
      newVote = undefined;
      scoreDelta = -value;
    } else {
      // Add new vote or change existing vote
      newVote = value;
      if (optimisticVote) {
        // Changing from one vote to another
        scoreDelta = value - optimisticVote;
      } else {
        // Adding new vote
        scoreDelta = value;
      }
    }

    setOptimisticVote(newVote);
    setOptimisticScore(optimisticScore + scoreDelta);

    // Submit the actual vote
    startTransition(async () => {
      try {
        await voteOnAnswer(answerId, newVote || 0);
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticVote(currentUserVote);
        setOptimisticScore(totalScore);
        console.error('Error voting:', error);
      }
    });
  };

  return (
    <div className="flex flex-row sm:flex-col items-center space-x-1 sm:space-x-0 sm:space-y-1">
      {/* Upvote button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={clsx(
          'p-1 h-7 w-7 sm:h-8 sm:w-8',
          optimisticVote === 1 
            ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
            : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
        )}
      >
        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Score display */}
      <span 
        className={clsx(
          'text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[2rem] text-center',
          optimisticScore > 0 
            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
            : optimisticScore < 0
            ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
            : 'text-gray-600 dark:text-gray-400'
        )}
      >
        {optimisticScore}
      </span>

      {/* Downvote button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={clsx(
          'p-1 h-7 w-7 sm:h-8 sm:w-8',
          optimisticVote === -1 
            ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
            : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
        )}
      >
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
}
