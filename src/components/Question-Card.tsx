'use client';

import Link from "next/link";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteQuestion } from "@/lib/action";

type QuestionCardProps = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: { username: string };
  tags: { tag: { id: string; name: string } }[];
  answersCount: number;
  canDelete?: boolean; // New prop to control delete visibility
};

export default function QuestionCard({
  id,
  title,
  description,
  createdAt,
  author,
  tags,
  answersCount,
  canDelete = false,
}: QuestionCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        const result = await deleteQuestion(id, false);
        if (result?.success) {
          // Optionally show success message or just let the page revalidate
          console.log("Question deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete question:", error);
        alert("Failed to delete question. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-2">
      <Link href={`/question/${id}`}>
        <h2 className="text-xl font-semibold text-blue-600 hover:underline line-clamp-2">
          {title}
        </h2>
      </Link>

      <div
        className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map(({ tag }) => (
          <span
            key={tag.id}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500 flex justify-between items-center mt-2">
        <span>By {author.username}</span>
        <div className="flex items-center gap-2">
          <span>
            {answersCount} answers • {timeAgo}
          </span>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Delete question"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
