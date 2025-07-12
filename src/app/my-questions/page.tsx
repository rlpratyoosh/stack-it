import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma-db";
import QuestionsWithSearch from "@/components/QuestionsWithSearch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function MyQuestionsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get or create user
  const user = await db.getOrCreateUser(userId);

  // Get user's questions
  const questions = await db.getQuestionsByUser(user.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-center sm:text-left text-3xl font-bold">
            Your Questions
          </h1>
          <p className="text-center sm:text-left text-gray-600 dark:text-gray-400 mt-2">
            Manage and track all the questions you&apos;ve asked
          </p>
        </div>
        <Link href="/ask" className="w-full sm:w-auto">
          <Button className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            Ask New Question
          </Button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No questions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven&apos;t asked any questions yet. Start by asking your first
            question!
          </p>
          <Link href="/ask">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ask Your First Question
            </Button>
          </Link>
        </div>
      ) : (
        <QuestionsWithSearch questions={questions} currentUserId={user.id} />
      )}
    </div>
  );
}
