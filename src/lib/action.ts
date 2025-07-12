'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from './prisma-db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ✅ Ask a question
export async function askQuestion(title: string, description: string, tagIds: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.getUserByClerkId(userId);
  if (!user) throw new Error('User not found');

  await db.createQuestion({
    title,
    description,
    tagIds,
    userId: user.id,
  });

  revalidatePath('/'); 
  redirect('/'); 
}

// ✅ Answer a question
export async function submitAnswer(questionId: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.getUserByClerkId(userId);
  if (!user) throw new Error('User not found');

  await db.createAnswer({
    questionId,
    content,
    userId: user.id,
  });

  revalidatePath(`/question/${questionId}`);
}

export async function voteOnAnswer(answerId: string, value: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.getUserByClerkId(userId);
  if (!user) throw new Error('User not found');

  await db.voteAnswer({
    answerId,
    userId: user.id,
    value,
  });
}

export async function markAnswerAccepted(questionId: string, answerId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const question = await db.getQuestionById(questionId);
  if (question?.userId !== userId) throw new Error('Only the question owner can mark accepted');

  await db.updateQuestionAcceptedAnswer(questionId, answerId);
  revalidatePath(`/question/${questionId}`);
}
