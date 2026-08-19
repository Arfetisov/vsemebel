import { prisma } from "@/lib/prisma";

const sourceLabels: Record<string, string> = {
  TELEGRAM: "Telegram",
  MAX: "MAX",
  WHATSAPP: "WhatsApp",
  WEB: "Сайт",
};

export default async function FeedPage() {
  const messages = await prisma.feedMessage.findMany({
    where: { status: "PUBLISHED" },
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Лента сообщества</h1>

      {messages.length === 0 && (
        <p className="text-gray-500">Сообщений пока нет.</p>
      )}

      <ul className="flex flex-col gap-4">
        {messages.map((message) => (
          <li key={message.id} className="rounded border p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{sourceLabels[message.source] ?? message.source}</span>
              {message.company && <span>· {message.company.name}</span>}
              {message.authorName && <span>· {message.authorName}</span>}
            </div>
            <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
