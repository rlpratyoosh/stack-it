'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AdminQuestions from "./AdminQuestions";
import AdminAnswers from "./AdminAnswers";
import AdminComments from "./AdminComments";
import AdminUsers from "./AdminUsers";

interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  answers: Array<{
    id: string;
  }>;
}

interface Answer {
  id: string;
  content: string;
  createdAt: Date;
  questionId: string;
  user: {
    id: string;
    username: string;
  };
  question: {
    id: string;
    title: string;
    user: {
      id: string;
      username: string;
    };
  };
  votes: Array<{
    id: string;
    value: number;
  }>;
  comments: Array<{
    id: string;
  }>;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  answer: {
    id: string;
    questionId: string;
    user: {
      id: string;
      username: string;
    };
    question: {
      id: string;
      title: string;
    };
  };
}

interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  _count: {
    questions: number;
    answers: number;
    comments: number;
    votes: number;
  };
}

interface AdminDashboardProps {
  initialQuestions: Question[];
  initialAnswers: Answer[];
  initialComments: Comment[];
  initialUsers: UserData[];
}

export default function AdminDashboard({ 
  initialQuestions, 
  initialAnswers, 
  initialComments, 
  initialUsers 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    questions: initialQuestions.length,
    answers: initialAnswers.length,
    comments: initialComments.length,
    users: initialUsers.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.questions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Answers</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.answers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.comments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="mt-6">
          <AdminQuestions questions={initialQuestions} />
        </TabsContent>
        
        <TabsContent value="answers" className="mt-6">
          <AdminAnswers answers={initialAnswers} />
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <AdminComments comments={initialComments} />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <AdminUsers users={initialUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
