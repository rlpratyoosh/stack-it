import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { db } from "@/lib/prisma-db";
import AnswerCard from "@/components/AnswerCard";
import AnswerForm from "@/components/AnswerForm";

export default async function EachQuestion({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { userId } = await auth();

  const question = await db.getQuestionById(id);
  if (!question) {
    notFound();
  }

  let currentUser = null;
  if (userId) {
    currentUser = await db.getOrCreateUser(userId);
  }

  const timeAgo = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true });
  const isQuestionOwner = currentUser?.id === question.userId;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Question */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
        
        <div
          className="prose prose-sm dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* Meta info */}
        <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-700 pt-4">
          Asked {timeAgo} by <span className="font-medium">{question.user.username}</span>
        </div>
      </div>

      {/* Answers section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        
        {question.answers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No answers yet. Be the first to help!
          </p>
        ) : (
          <div className="space-y-4">
            {question.answers
              .sort((a, b) => {
                // Sort accepted answer first, then by vote score, then by date
                if (a.id === question.acceptedAnswerId) return -1;
                if (b.id === question.acceptedAnswerId) return 1;
                
                const aScore = a.votes.reduce((sum, vote) => sum + vote.value, 0);
                const bScore = b.votes.reduce((sum, vote) => sum + vote.value, 0);
                
                if (aScore !== bScore) return bScore - aScore;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              })
              .map((answer) => (
                <AnswerCard
                  key={answer.id}
                  id={answer.id}
                  content={answer.content}
                  createdAt={answer.createdAt.toISOString()}
                  author={answer.user}
                  votes={answer.votes}
                  isAccepted={answer.id === question.acceptedAnswerId}
                  canAccept={isQuestionOwner}
                  currentUserId={currentUser?.id}
                  questionId={question.id}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* Answer form (only for authenticated users) */}
      {currentUser && (
        <AnswerForm questionId={question.id} />
      )}
    </div>
  );
}