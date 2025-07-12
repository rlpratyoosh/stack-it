'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientQuestionSchema, type ClientQuestionFormData } from '@/lib/validations';
import { askQuestion } from '@/lib/action';
import { Button } from '@/components/ui/button';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

interface AskQuestionFormProps {
  availableTags?: string[];
}

export default function AskQuestionForm({ availableTags = [] }: AskQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [tagsError, setTagsError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ClientQuestionFormData>({
    resolver: zodResolver(clientQuestionSchema),
  });

  const onSubmit = async (data: ClientQuestionFormData) => {
    try {
      setIsSubmitting(true);
      setDescriptionError('');
      setTagsError('');
      
      // Debug logging
      console.log('Form submission data:', data);
      console.log('Description content:', description);
      console.log('Selected tags:', selectedTags);
      
      // Validate description (strip HTML for length check)
      const textContent = description.replace(/<[^>]*>/g, '').trim();
      console.log('Text content length:', textContent.length);
      
      if (textContent.length < 20) {
        console.log('Description too short');
        setDescriptionError('Description must be at least 20 characters');
        return;
      }
      
      // Validate tags
      if (selectedTags.length === 0) {
        console.log('No tags selected');
        setTagsError('At least one tag is required');
        return;
      }

      // Create FormData for server action
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(selectedTags));

      console.log('Submitting form...');
      await askQuestion(formData);
    } catch (error) {
      console.error('Error submitting question:', error);
      
      // Show more specific error message if it's a validation error
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          setError('root', { message: `Validation error: ${error.message}` });
        } else {
          setError('root', { message: `Error: ${error.message}` });
        }
      } else {
        setError('root', { message: 'Failed to submit question. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    if (tags.length > 0) {
      setTagsError('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Question Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            placeholder="What's your programming question? Be specific."
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Question Description <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={description}
            onChange={(value) => {
              setDescription(value);
              if (descriptionError) {
                const textContent = value.replace(/<[^>]*>/g, '').trim();
                if (textContent.length >= 20) {
                  setDescriptionError('');
                }
              }
            }}
            placeholder="Provide details about your question. Include what you've tried and what specific help you need."
          />
          {descriptionError && (
            <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags <span className="text-red-500">*</span>
          </label>
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={handleTagsChange}
            availableTags={availableTags}
            maxTags={5}
          />
          {tagsError && (
            <p className="text-red-500 text-sm mt-1">{tagsError}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add up to 5 tags to describe what your question is about
          </p>
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
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'Submitting...' : 'Post Your Question'}
          </Button>
        </div>
      </form>
    </div>
  );
}

