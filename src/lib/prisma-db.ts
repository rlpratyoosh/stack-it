import { prisma } from "./prisma";

export const db = {
  // 👤 USERS
  getUserByClerkId: async (clerkId: string) => {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  },

  createUser: async ({
    clerkId,
    username,
    email,
  }: {
    clerkId: string;
    username: string;
    email: string;
  }) => {
    return prisma.user.create({
      data: { clerkId, username, email },
    });
  },

  // ❓ QUESTIONS
  createQuestion: async ({
    title,
    description,
    userId,
    tagIds,
  }: {
    title: string;
    description: string;
    userId: string;
    tagIds: string[];
  }) => {
    return prisma.question.create({
      data: {
        title,
        description,
        userId,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });
  },

  getAllQuestions: async () => {
    return prisma.question.findMany({
      include: {
        user: true,
        tags: { include: { tag: true } },
        answers: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getQuestionById: async (id: string) => {
    return prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        tags: { include: { tag: true } },
        answers: {
          include: {
            user: true,
            votes: true,
          },
        },
      },
    });
  },

  // 💬 ANSWERS
  createAnswer: async ({
    questionId,
    userId,
    content,
  }: {
    questionId: string;
    userId: string;
    content: string;
  }) => {
    return prisma.answer.create({
      data: {
        questionId,
        userId,
        content,
      },
    });
  },

  // 🔺 VOTES
  voteAnswer: async ({
    answerId,
    userId,
    value,
  }: {
    answerId: string;
    userId: string;
    value: number;
  }) => {
    return prisma.vote.upsert({
      where: {
        userId_answerId: {
          userId: userId,
          answerId: answerId,
        },
      },
      update: { value },
      create: { userId, answerId, value },
    });
  },

  // 🔔 NOTIFICATIONS
  createNotification: async ({
    userId,
    message,
    link,
  }: {
    userId: string;
    message: string;
    link?: string;
  }) => {
    return prisma.notification.create({
      data: { userId, message, link },
    });
  },

  getNotificationsByUser: async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
