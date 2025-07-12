'use client';

import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "./VoteButton";
import { markAnswerAccepted } from "@/lib/action";
import clsx from "clsx";
import { useOptimistic, useTransition } from "react";
import CommentSection from "./CommentSection";

type AnswerCardProps = {
  id: string;
  content: string;
  createdAt: string;
  author: { username: string };
  votes: { userId: string; value: number }[];
  isAccepted: boolean;
  canAccept: boolean;
  currentUserId?: string;
  questionId: string;
  comments?: {
    id: string;
    content: string;
    user: { username: string };
    createdAt: Date;
    userId: string;
  }[];
};

export default function AnswerCard({
  id,
  content,
  createdAt,
  author,
  votes,
  isAccepted,
  canAccept,
  currentUserId,
  questionId,
  comments = [],
}: AnswerCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const [isPending, startTransition] = useTransition();
  const [optimisticAccepted, setOptimisticAccepted] = useOptimistic(isAccepted);
  
  // Calculate vote score and current user's vote
  const totalScore = votes.reduce((sum, vote) => sum + vote.value, 0);
  const currentUserVote = currentUserId 
    ? votes.find(vote => vote.userId === currentUserId)?.value 
    : undefined;

  const handleAcceptAnswer = () => {
    if (isPending) return;
    
    setOptimisticAccepted(true);
    
    startTransition(async () => {
      try {
        await markAnswerAccepted(questionId, id);
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticAccepted(isAccepted);
        console.error('Error accepting answer:', error);
      }
    });
  };

  return (
    <div 
      className={clsx(
        "bg-white dark:bg-zinc-900 border rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm hover:shadow-md transition-all",
        optimisticAccepted 
          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-zinc-700"
      )}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Vote buttons */}
        <div className="flex-shrink-0 order-2 sm:order-1">
          <VoteButton
            answerId={id}
            currentUserVote={currentUserVote}
            totalScore={totalScore}
          />
        </div>

        {/* Answer content */}
        <div className="flex-1 space-y-2 sm:space-y-3 order-1 sm:order-2">
          {/* Accepted badge */}
          {optimisticAccepted && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check className="h-4 w-4" />
              Accepted Answer
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              answered {timeAgo} by <span className="font-medium">{author.username}</span>
            </div>

            {/* Accept answer button (only for question owner) */}
            {canAccept && !optimisticAccepted && (
              <Button
                onClick={handleAcceptAnswer}
                disabled={isPending}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm w-full sm:w-auto"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {isPending ? 'Accepting...' : 'Accept Answer'}
              </Button>
            )}
          </div>

          {/* Comments Section */}
          <div className="pt-2 sm:pt-3">
            <CommentSection
              answerId={id}
              initialComments={comments}
              currentUserId={currentUserId}
              isLoggedIn={!!currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
