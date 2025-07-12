'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from './prisma-db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { questionSchema, answerSchema, voteSchema } from './validations';

// ✅ Ask a question
export async function askQuestion(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.getOrCreateUser(userId);

    // Parse and validate form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagNames = JSON.parse(formData.get('tags') as string) as string[];

    console.log('Form data:', { title, description, tagNames }); // Debug log

    const validatedData = questionSchema.parse({
      title,
      description,
      tags: tagNames,
    });

    // Create or find tags
    const tags = await db.findOrCreateTags(validatedData.tags);
    const tagIds = tags.map(tag => tag.id);

    const question = await db.createQuestion({
      title: validatedData.title,
      description: validatedData.description,
      tagIds,
      userId: user.id,
    });

    revalidatePath('/'); 
    redirect(`/question/${question.id}`); 
  } catch (error) {
    console.error('Question submission error:', error);
    throw error;
  }
}

// ✅ Answer a question
export async function submitAnswer(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.getOrCreateUser(userId);

    const questionId = formData.get('questionId') as string;
    const content = formData.get('content') as string;

    console.log('Answer form data:', { questionId, content }); // Debug log

    const validatedData = answerSchema.parse({ content });

    await db.createAnswer({
      questionId,
      content: validatedData.content,
      userId: user.id,
    });

    // Create notification for question owner
    const question = await db.getQuestionById(questionId);
    if (question && question.userId !== user.id) {
      await db.createNotification({
        userId: question.userId,
        message: `${user.username} answered your question: ${question.title}`,
        link: `/question/${questionId}`,
      });
    }

    revalidatePath(`/question/${questionId}`);
  } catch (error) {
    console.error('Answer submission error:', error);
    throw error;
  }
}

export async function voteOnAnswer(answerId: string, value: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await db.getOrCreateUser(userId);

  const validatedData = voteSchema.parse({ value });

  await db.voteAnswer({
    answerId,
    userId: user.id,
    value: validatedData.value,
  });
  
  revalidatePath('/question/[id]', 'page');
}

export async function markAnswerAccepted(questionId: string, answerId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const question = await db.getQuestionById(questionId);
  if (question?.userId !== userId) throw new Error('Only the question owner can mark accepted');

  await db.updateQuestionAcceptedAnswer(questionId, answerId);
  revalidatePath(`/question/${questionId}`);
}
