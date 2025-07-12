'use client';

import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminDeleteComment } from "@/lib/action";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Trash2, Eye, User } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  answer: {
    id: string;
    questionId: string;
    user: {
      id: string;
      username: string;
    };
    question: {
      id: string;
      title: string;
    };
  };
}

interface AdminCommentsProps {
  comments: Comment[];
}

export default function AdminComments({ comments }: AdminCommentsProps) {
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, deletedCommentId: string) =>
      state.filter((c) => c.id !== deletedCommentId)
  );

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    setOptimisticComments(commentId);

    try {
      await adminDeleteComment(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Revert optimistic update on error
      window.location.reload();
    }
  };

  if (optimisticComments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No comments found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Comments</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage comments from all users</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {optimisticComments.map((comment) => (
          <div key={comment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Comment on Answer
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Question: {comment.answer.question.title.substring(0, 30)}...
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{comment.user.username}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                  <span>•</span>
                  <span>Answer by {comment.answer.user.username}</span>
                </div>

                <div className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-200 dark:border-blue-400">
                  {comment.content}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/question/${comment.answer.questionId}#comment-${comment.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
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
