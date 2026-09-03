import Link from "next/link";
import { prisma } from "@/lib/prisma";

const sections = [
  {
    href: "/catalog",
    title: "Каталог",
    description: "Фабрики, дизайн-студии, поставщики, распил и монтаж",
  },
  {
    href: "/feed",
    title: "Сообщество",
    description: "Обсуждения по темам, мост в Telegram и MAX",
  },
  {
    href: "/content",
    title: "Контент",
    description: "Новости, календарь, тендеры, база знаний",
  },
  {
    href: "/services",
    title: "Услуги для бизнеса",
    description: "Кейсы, CRM для мебельщиков, партнёрские рубрики",
  },
];

export default async function Home() {
  const recentMessages = await prisma.feedMessage.findMany({
    where: { status: "PUBLISHED" },
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Сообщество мебельщиков Санкт-Петербурга
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Фабрики, дизайнеры и поставщики — каталог, обсуждения и новости отрасли в одном месте
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="rounded bg-black px-5 py-2.5 text-white hover:bg-gray-800"
          >
            Смотреть каталог
          </Link>
          <Link
            href="/register"
            className="rounded border px-5 py-2.5 hover:bg-gray-50"
          >
            Присоединиться
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded border p-5 hover:bg-gray-50"
            >
              <p className="font-medium">{section.title}</p>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Свежее в сообществе</h2>
          <Link href="/feed" className="text-sm text-blue-600 hover:underline">
            Вся лента →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-sm text-gray-500">Сообщений пока нет.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recentMessages.map((message) => (
              <li key={message.id} className="rounded border p-4">
                <div className="text-sm text-gray-500">
                  {message.company?.name ?? message.authorName}
                </div>
                <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
