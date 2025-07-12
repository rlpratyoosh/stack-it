import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "./VoteButton";
import { markAnswerAccepted } from "@/lib/action";
import clsx from "clsx";

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
};

export default async function AnswerCard({
  id,
  content,
  createdAt,
  author,
  votes,
  isAccepted,
  canAccept,
  currentUserId,
  questionId,
}: AnswerCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Calculate vote score and current user's vote
  const totalScore = votes.reduce((sum, vote) => sum + vote.value, 0);
  const currentUserVote = currentUserId 
    ? votes.find(vote => vote.userId === currentUserId)?.value 
    : undefined;

  const handleAcceptAnswer = async () => {
    'use server';
    await markAnswerAccepted(questionId, id);
  };

  return (
    <div 
      className={clsx(
        "bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all",
        isAccepted 
          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
          : "border-gray-300 dark:border-zinc-700"
      )}
    >
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex-shrink-0">
          <VoteButton
            answerId={id}
            currentUserVote={currentUserVote}
            totalScore={totalScore}
          />
        </div>

        {/* Answer content */}
        <div className="flex-1 space-y-3">
          {/* Accepted badge */}
          {isAccepted && (
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
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              answered {timeAgo} by <span className="font-medium">{author.username}</span>
            </div>

            {/* Accept answer button (only for question owner) */}
            {canAccept && !isAccepted && (
              <form action={handleAcceptAnswer}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept Answer
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
