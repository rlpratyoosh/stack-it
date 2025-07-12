'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { MessageCircle, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addComment, deleteComment } from '@/lib/action';

type Comment = {
  id: string;
  content: string;
  user: { username: string };
  createdAt: Date;
  userId: string;
};

type CommentSectionProps = {
  answerId: string;
  initialComments: Comment[];
  currentUserId?: string;
  isLoggedIn: boolean;
};

export default function CommentSection({
  answerId,
  initialComments,
  currentUserId,
  isLoggedIn,
}: CommentSectionProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [...state, newComment]
  );

  const [optimisticDeletedComments, deleteOptimisticComment] = useOptimistic(
    optimisticComments,
    (state, deletedCommentId: string) => 
      state.filter(comment => comment.id !== deletedCommentId)
  );

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Create optimistic comment
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: commentText,
      user: { username: 'You' },
      createdAt: new Date(),
      userId: currentUserId || '',
    };
    
    addOptimisticComment(optimisticComment);
    setCommentText('');
    setShowCommentForm(false);

    try {
      const formData = new FormData();
      formData.append('answerId', answerId);
      formData.append('content', commentText);
      
      await addComment(formData);
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Note: The page will revalidate and show the real state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    deleteOptimisticComment(commentId);
    
    startTransition(async () => {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    });
  };

  const renderCommentText = (text: string) => {
    // Convert @mentions to styled spans
    return text.replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>');
  };

  return (
    <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 mt-3">
      {/* Comments List */}
      {optimisticDeletedComments.length > 0 && (
        <div className="space-y-3 mb-3">
          {optimisticDeletedComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 text-sm">
              <div className="flex-1">
                <span 
                  className="text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ 
                    __html: renderCommentText(comment.content) 
                  }}
                />
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  – {comment.user.username} {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              {currentUserId === comment.userId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                  disabled={isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Button/Form */}
      {isLoggedIn && (
        <div>
          {!showCommentForm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommentForm(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Add comment
            </Button>
          ) : (
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment... Use @username to mention someone"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 text-sm resize-none"
                rows={2}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {commentText.length}/500 characters
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentText('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentText.trim() || isSubmitting}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
