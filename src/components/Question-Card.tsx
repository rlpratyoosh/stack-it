import Link from "next/link";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

type QuestionCardProps = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: { username: string };
  tags: { tag: { id: string; name: string } }[];
  answersCount: number;
};

export default function QuestionCard({
  id,
  title,
  description,
  createdAt,
  author,
  tags,
  answersCount,
}: QuestionCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

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
        <span>
          {answersCount} answers • {timeAgo}
        </span>
      </div>
    </div>
  );
}
