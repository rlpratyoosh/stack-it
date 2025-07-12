import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma-db";
import QuestionsList from "@/components/QuestionsList";

export default async function EachUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { userId } = await auth();
  const profileUserId = id;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.getOrCreateUser(userId);

  // Get the profile user's questions
  const profileUser = await db.getUserByClerkId(profileUserId);
  if (!profileUser) {
    redirect("/");
  }

  // Get user's questions
  const userQuestions = await db.getAllQuestions();
  const questions = userQuestions.filter(q => q.userId === profileUser.id);

  const isOwnProfile = user.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">
          {isOwnProfile ? "Your Profile" : `${profileUser.username}'s Profile`}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {profileUser.username} • {profileUser.email}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {questions.length} questions asked
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {isOwnProfile ? "Your Questions" : "Questions"}
        </h2>
        
        {questions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            {isOwnProfile ? "You haven't asked any questions yet." : "No questions asked yet."}
          </p>
        ) : (
          <div className="space-y-4">
            <QuestionsList 
              questions={questions}
              currentUserId={isOwnProfile ? user.id : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}