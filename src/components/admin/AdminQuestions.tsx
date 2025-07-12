'use client';

import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminDeleteQuestion } from "@/lib/action";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Trash2, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  answers: Array<{
    id: string;
  }>;
}

interface AdminQuestionsProps {
  questions: Question[];
}

export default function AdminQuestions({ questions }: AdminQuestionsProps) {
  const [optimisticQuestions, setOptimisticQuestions] = useOptimistic(
    questions,
    (state, deletedQuestionId: string) =>
      state.filter((q) => q.id !== deletedQuestionId)
  );

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    setOptimisticQuestions(questionId);

    try {
      await adminDeleteQuestion(questionId);
    } catch (error) {
      console.error("Failed to delete question:", error);
      // Revert optimistic update on error
      window.location.reload();
    }
  };

  if (optimisticQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Questions</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage questions from all users</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {optimisticQuestions.map((question) => (
          <div key={question.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                    {question.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>by {question.user.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(question.createdAt))} ago</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {question.answers.length} answers
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {question.tags.map((tagRelation) => (
                    <Badge key={tagRelation.tag.id} variant="secondary" className="text-xs">
                      {tagRelation.tag.name}
                    </Badge>
                  ))}
                </div>

                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{ 
                    __html: question.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/question/${question.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(question.id)}
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
