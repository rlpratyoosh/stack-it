import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma-db";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  // Check if user is admin
  const isAdmin = await db.isUserAdmin(userId);
  if (!isAdmin) {
    redirect("/");
  }

  // Fetch all data for admin dashboard
  const [questions, answers, comments, users] = await Promise.all([
    db.getAllQuestionsForAdmin(),
    db.getAllAnswersForAdmin(),
    db.getAllCommentsForAdmin(),
    db.getAllUsersForAdmin(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage questions, answers, comments, and users</p>
      </div>
      
      <AdminDashboard 
        initialQuestions={questions}
        initialAnswers={answers}
        initialComments={comments}
        initialUsers={users}
      />
    </div>
  );
}
