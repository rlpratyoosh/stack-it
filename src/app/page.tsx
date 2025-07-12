import { db } from '@/lib/prisma-db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import QuestionsWithSearch from '@/components/QuestionsWithSearch';

export default async function HomePage() {
  const { userId } = await auth();
  const questions = await db.getAllQuestions(); // from prisma-db.ts
  
  let currentUser = null;
  if (userId) {
    currentUser = await db.getOrCreateUser(userId);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="w-full text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">All Questions</h1>
          </div>
          <Link href="/ask" className="w-full sm:w-auto">
            <Button className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus className="h-4 w-4" />
              <span className="sm:hidden">Ask a Question</span>
              <span className="hidden sm:inline">Ask Question</span>
            </Button>
          </Link>
        </div>

        {/* Questions with Search and Filters */}
        <QuestionsWithSearch 
          questions={questions} 
          currentUserId={currentUser?.id}
        />
      </div>
    </div>
  );
}
