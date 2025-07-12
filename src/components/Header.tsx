import { SiBetterstack } from "react-icons/si";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { db } from "@/lib/prisma-db";
import NotificationBell from "./NotificationBell";
import { MdHomeFilled } from "react-icons/md";
import { TbMessageQuestion } from "react-icons/tb";

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
    <header className="w-full h-16 bg-card border-border border-b flex items-center justify-between p-2 sm:p-5">
      <div className="h-full flex items-center justify-center px-2 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl">
            <SiBetterstack />
          </div>
          <h1 className="text-xl font-bold">
            StackIt
          </h1>
        </Link>
      </div>
      
      <div className="flex items-center justify-center gap-3">
        <SignedIn>
          <Link href='/'>
            <Button variant='ghost' className="cursor-pointer flex items-center gap-1 text-sm">
              <MdHomeFilled />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link href='/my-questions'>
            <Button variant='ghost' className="cursor-pointer flex items-center gap-1 text-sm">
              <TbMessageQuestion />
              <span className="hidden sm:inline">Your Questions</span>
            </Button>
          </Link>
          <Link href='/ask'>
            <Button variant="default" className="cursor-pointer flex items-center text-sm">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Ask Question</span>
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
            <Button className="cursor-pointer text-sm">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}