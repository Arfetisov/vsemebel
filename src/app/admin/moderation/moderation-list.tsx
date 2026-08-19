"use client";

import { useRouter } from "next/navigation";

type PendingMessage = {
  id: string;
  source: string;
  authorName: string | null;
  content: string;
  company: { name: string } | null;
};

export function ModerationList({ messages }: { messages: PendingMessage[] }) {
  const router = useRouter();

  async function moderate(id: string, action: "publish" | "reject") {
    await fetch(`/api/admin/moderation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
  }

  if (messages.length === 0) {
    return <p className="text-gray-500">Очередь на модерацию пуста.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {messages.map((message) => (
        <li key={message.id} className="rounded border p-4">
          <div className="text-sm text-gray-500">
            {message.source}
            {message.company && ` · ${message.company.name}`}
            {message.authorName && ` · ${message.authorName}`}
          </div>
          <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => moderate(message.id, "publish")}
              className="rounded bg-green-600 px-3 py-1.5 text-sm text-white"
            >
              Опубликовать
            </button>
            <button
              onClick={() => moderate(message.id, "reject")}
              className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
            >
              Отклонить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
