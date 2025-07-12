import { SiBetterstack } from "react-icons/si";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { db } from "@/lib/prisma-db";
import NotificationBell from "./NotificationBell";

export default async function Header() {
  const { userId } = await auth();
  let notifications: Array<{
    id: string;
    message: string;
    isRead: boolean;
    link: string | null;
    createdAt: Date;
    userId: string;
  }> = [];
  let user = null;

  if (userId) {
    user = await db.getOrCreateUser(userId);
    if (user) {
      notifications = await db.getNotificationsByUser(user.id);
    }
  }

  return (
    <header className="w-full h-16 bg-card border-border border-b flex items-center justify-between p-5">
      <div className="h-full flex items-center justify-center gap-2 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-3xl">
            <SiBetterstack />
          </div>
          <h1 className="text-2xl font-bold">
            StackIt
          </h1>
        </Link>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <SignedIn>
          <Link href='/'>
            <Button variant='ghost' className="cursor-pointer">
              Home
            </Button>
          </Link>
          <Link href='/my-questions'>
            <Button variant='ghost' className="cursor-pointer">
              Your Questions
            </Button>
          </Link>
          <Link href='/ask'>
            <Button variant="default" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-1" />
              Ask Question
            </Button>
          </Link>
          {user && (
            <NotificationBell 
              initialNotifications={notifications} 
            />
          )}
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="cursor-pointer">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}