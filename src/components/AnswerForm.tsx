'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientAnswerSchema, type ClientAnswerFormData } from '@/lib/validations';
import { submitAnswer } from '@/lib/action';
import { Button } from '@/components/ui/button';
import RichTextEditor from './RichTextEditor';

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState<string>('');

  const {
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ClientAnswerFormData>({
    resolver: zodResolver(clientAnswerSchema),
  });

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setContentError('');

      // Debug logging
      console.log('Answer submission data:', { questionId, content });
      
      // Validate content (strip HTML for length check)
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      console.log('Answer text content length:', textContent.length);
      
      if (textContent.length < 10) {
        console.log('Answer too short');
        setContentError('Answer must be at least 10 characters');
        return;
      }

      // Create FormData for server action
      const formData = new FormData();
      formData.append('questionId', questionId);
      formData.append('content', content);

      console.log('Submitting answer...');
      await submitAnswer(formData);
      
      // Reset form
      setContent('');
      setContentError('');
      reset();
    } catch (error) {
      console.error('Error submitting answer:', error);
      
      // Show more specific error message if it's a validation error
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          setError('root', { message: `Validation error: ${error.message}` });
        } else {
          setError('root', { message: `Error: ${error.message}` });
        }
      } else {
        setError('root', { message: 'Failed to submit answer. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rich text editor */}
        <div>
          <RichTextEditor
            value={content}
            onChange={(value) => {
              setContent(value);
              if (contentError) {
                const textContent = value.replace(/<[^>]*>/g, '').trim();
                if (textContent.length >= 10) {
                  setContentError('');
                }
              }
            }}
            placeholder="Write your answer here. Be clear and provide helpful details."
          />
          {contentError && (
            <p className="text-red-500 text-sm mt-1">{contentError}</p>
          )}
        </div>

        {/* Error message */}
        {errors.root && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-red-700 dark:text-red-400 text-sm">{errors.root.message}</p>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || content.replace(/<[^>]*>/g, '').trim().length < 10}
            className="px-6"
          >
            {isSubmitting ? 'Submitting...' : 'Post Your Answer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
