'use client';

import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminDeleteAnswer } from "@/lib/action";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Trash2, Eye, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  content: string;
  createdAt: Date;
  questionId: string;
  user: {
    id: string;
    username: string;
  };
  question: {
    id: string;
    title: string;
    user: {
      id: string;
      username: string;
    };
  };
  votes: Array<{
    id: string;
    value: number;
  }>;
  comments: Array<{
    id: string;
  }>;
}

interface AdminAnswersProps {
  answers: Answer[];
}

export default function AdminAnswers({ answers }: AdminAnswersProps) {
  const [optimisticAnswers, setOptimisticAnswers] = useOptimistic(
    answers,
    (state, deletedAnswerId: string) =>
      state.filter((a) => a.id !== deletedAnswerId)
  );

  const handleDelete = async (answerId: string) => {
    if (!confirm("Are you sure you want to delete this answer? This action cannot be undone.")) {
      return;
    }

    setOptimisticAnswers(answerId);

    try {
      await adminDeleteAnswer(answerId);
    } catch (error) {
      console.error("Failed to delete answer:", error);
      // Revert optimistic update on error
      window.location.reload();
    }
  };

  const getVoteScore = (votes: Array<{ value: number }>) => {
    return votes.reduce((sum, vote) => sum + vote.value, 0);
  };

  if (optimisticAnswers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No answers found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">All Answers</h2>
        <p className="text-sm text-gray-600">Manage answers from all users</p>
      </div>
      
      <div className="divide-y">
        {optimisticAnswers.map((answer) => (
          <div key={answer.id} className="p-4 hover:bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Answer to: {answer.question.title.substring(0, 50)}...
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>by {answer.user.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(answer.createdAt))} ago</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {answer.comments.length} comments
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">{getVoteScore(answer.votes)}</span>
                  </div>
                </div>

                <div 
                  className="text-sm text-gray-600 line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: answer.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/question/${answer.questionId}#answer-${answer.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(answer.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
