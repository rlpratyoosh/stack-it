import { prisma } from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

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

  getOrCreateUser: async (clerkId: string) => {
    // First try to get existing user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist, create them using Clerk data
    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error("No authenticated user found");
      }

      user = await prisma.user.create({
        data: {
          clerkId,
          username: clerkUser.username || clerkUser.firstName || "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
        },
      });
    }

    return user;
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
            comments: {
              include: {
                user: true,
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
  },

  getQuestionsByUser: async (userId: string) => {
    return prisma.question.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
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

  getAnswerById: async (answerId: string) => {
    return prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        user: true,
        question: true,
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

  markNotificationAsRead: async (notificationId: string) => {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  // 🏷️ TAGS
  getAllTags: async () => {
    return prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
  },

  createTag: async (name: string) => {
    return prisma.tag.create({
      data: { name },
    });
  },

  findOrCreateTags: async (tagNames: string[]) => {
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        return prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      })
    );
    return tags;
  },

  updateQuestionAcceptedAnswer: async (
    questionId: string,
    answerId: string
  ) => {
    return prisma.question.update({
      where: { id: questionId },
      data: { acceptedAnswerId: answerId },
    });
  },

  deleteQuestion: async (questionId: string) => {
    // Delete in order due to foreign key constraints
    // 1. Delete question tags
    await prisma.questionTag.deleteMany({
      where: { questionId },
    });

    // 2. Delete votes on answers for this question
    await prisma.vote.deleteMany({
      where: {
        answer: {
          questionId,
        },
      },
    });

    // 3. Delete answers
    await prisma.answer.deleteMany({
      where: { questionId },
    });

    // 4. Delete notifications related to this question
    await prisma.notification.deleteMany({
      where: {
        link: `/question/${questionId}`,
      },
    });

    // 5. Finally delete the question
    return prisma.question.delete({
      where: { id: questionId },
    });
  },

  // 💬 COMMENTS
  createComment: async ({
    content,
    userId,
    answerId,
  }: {
    content: string;
    userId: string;
    answerId: string;
  }) => {
    return prisma.comment.create({
      data: { content, userId, answerId },
      include: {
        user: true,
      },
    });
  },

  getCommentsByAnswer: async (answerId: string) => {
    return prisma.comment.findMany({
      where: { answerId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  deleteComment: async (commentId: string) => {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  },
};
