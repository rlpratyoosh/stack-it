'use client';

import { useOptimistic } from 'react';
import QuestionCard from './Question-Card';

type Question = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  user: { username: string };
  tags: { tag: { id: string; name: string } }[];
  answers: { id: string }[]; // More specific type
  userId: string;
};

type QuestionsListProps = {
  questions: Question[];
  currentUserId?: string;
};

export default function QuestionsList({ questions, currentUserId }: QuestionsListProps) {
  const [optimisticQuestions, deleteOptimisticQuestion] = useOptimistic(
    questions,
    (state, deletedQuestionId: string) => 
      state.filter(q => q.id !== deletedQuestionId)
  );

  const handleOptimisticDelete = (questionId: string) => {
    deleteOptimisticQuestion(questionId);
  };

  return (
    <div className="space-y-4">
      {optimisticQuestions.map((q) => (
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
  );
}
