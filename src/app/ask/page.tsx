import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma-db";
import AskQuestionForm from "@/components/AskQuestionForm";

export default async function AskQuestion() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user exists in database (creates if doesn't exist)
  await db.getOrCreateUser(userId);

  const tags = await db.getAllTags();
  const availableTags = tags.map(tag => tag.name);

  return <AskQuestionForm availableTags={availableTags} />;
}