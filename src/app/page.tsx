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
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Questions</h1>
          </div>
          <Link href="/ask">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ask Question
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
