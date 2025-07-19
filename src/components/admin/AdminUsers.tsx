'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminUpdateUserRole } from "@/lib/action";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { User, Crown, MessageSquare, HelpCircle, MessageCircle, Star } from "lucide-react";
import Link from "next/link";

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

interface AdminUsersProps {
  users: UserData[];
}

export default function AdminUsers({ users }: AdminUsersProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setLoadingUserId(userId);

    try {
      await adminUpdateUserRole(userId, newRole);
    } catch (error) {
      console.error("Failed to update user role:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage user roles and view user statistics</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                  </div>
                  
                  <Badge 
                    variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {user.role === 'ADMIN' && <Crown className="h-3 w-3" />}
                    {user.role}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <p>{user.email}</p>
                  <p>Joined {formatDistanceToNow(new Date(user.createdAt))} ago</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{user._count.questions}</span> questions
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{user._count.answers}</span> answers
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{user._count.comments}</span> comments
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{user._count.votes}</span> votes
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/user/${user.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
                
                {user.role === 'USER' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRoleChange(user.id, 'ADMIN')}
                    disabled={loadingUserId === user.id}
                    className="flex items-center gap-1"
                  >
                    <Crown className="h-3 w-3" />
                    Make Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleChange(user.id, 'USER')}
                    disabled={loadingUserId === user.id}
                    className="flex items-center gap-1"
                  >
                    Remove Admin
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
