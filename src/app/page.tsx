import { db } from '@/lib/prisma-db';
import QuestionCard from '@/components/Question-Card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function HomePage() {
  const questions = await db.getAllQuestions(); // from prisma-db.ts

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Questions</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {questions.length} questions in our community
            </p>
          </div>
          <Link href="/ask">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </Link>
        </div>

        {/* Questions list */}
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-4">
              No questions posted yet.
            </p>
            <Link href="/ask">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Be the first to ask a question
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                id={q.id}
                title={q.title}
                description={q.description}
                createdAt={q.createdAt.toISOString()}
                author={q.user}
                tags={q.tags}
                answersCount={q.answers.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
