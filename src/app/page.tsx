import Link from "next/link";
import {
  Warehouse,
  MessagesSquare,
  Newspaper,
  Briefcase,
  Send,
  ImageIcon,
  ExternalLink,
  CalendarClock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AnnouncementBar } from "@/components/announcement-bar";

const sections = [
  {
    href: "/catalog",
    title: "Каталог",
    description: "Фабрики, дизайн-студии, поставщики, распил и монтаж",
    icon: Warehouse,
    className: "bg-teal-50 text-teal-700",
  },
  {
    href: "/feed",
    title: "Сообщество",
    description: "Обсуждения по темам, мост в Telegram и MAX",
    icon: MessagesSquare,
    className: "bg-rose-50 text-rose-700",
  },
  {
    href: "/content",
    title: "Контент",
    description: "Новости, календарь, тендеры, база знаний",
    icon: Newspaper,
    className: "bg-pink-50 text-pink-700",
  },
  {
    href: "/services",
    title: "Услуги для бизнеса",
    description: "Кейсы, CRM для мебельщиков, партнёрские рубрики",
    icon: Briefcase,
    className: "bg-violet-50 text-violet-700",
  },
];

function formatEventDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export default async function Home() {
  const [recentMessages, homepage] = await Promise.all([
    prisma.feedMessage.findMany({
      where: { status: "PUBLISHED" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.homepageSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const hasNews = Boolean(homepage?.newsTitle);
  const hasEvent = Boolean(homepage?.eventTitle);

  return (
    <main className="flex-1">
      {homepage?.announcementActive && homepage.announcementMessage && (
        <AnnouncementBar
          message={homepage.announcementMessage}
          ctaLabel={homepage.announcementCtaLabel ?? ""}
          ctaUrl={homepage.announcementCtaUrl ?? ""}
        />
      )}

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

      {homepage?.sponsorActive && homepage.sponsorTitle && (
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <a
            href={homepage.sponsorCtaUrl ?? "#"}
            className="flex items-center gap-4 rounded-xl border bg-gray-50 p-4 hover:bg-gray-100"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white">
              <ImageIcon size={22} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Реклама</p>
              <p className="font-medium">{homepage.sponsorTitle}</p>
              {homepage.sponsorSubtitle && (
                <p className="text-sm text-gray-500">{homepage.sponsorSubtitle}</p>
              )}
            </div>
            <ExternalLink size={16} className="shrink-0 text-gray-400" />
          </a>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl border p-5 hover:bg-gray-50"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.className}`}
              >
                <section.icon size={18} />
              </span>
              <p className="mt-3 font-medium">{section.title}</p>
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500">Свежее в сообществе</h2>
          <Link href="/feed" className="text-sm text-blue-600 hover:underline">
            Вся лента →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-sm text-gray-500">Сообщений пока нет.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            {recentMessages.map((message, i) => (
              <div
                key={message.id}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t" : ""}`}
              >
                <Send size={16} className="shrink-0 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.content}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {message.company?.name ?? message.authorName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {(hasNews || hasEvent) && (
        <section className="mx-auto max-w-5xl px-6 pb-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {hasNews && (
              <div className="rounded-xl border p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Newspaper size={14} /> Новости отрасли
                </p>
                <p className="text-sm">{homepage!.newsTitle}</p>
                {homepage?.newsSourceLabel && (
                  <p className="mt-1 text-xs text-gray-400">по данным {homepage.newsSourceLabel}</p>
                )}
              </div>
            )}
            {hasEvent && (
              <div className="rounded-xl border p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CalendarClock size={14} /> Ближайшее событие
                </p>
                <p className="text-sm">{homepage!.eventTitle}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {homepage?.eventStartsAt && formatEventDate(homepage.eventStartsAt)}
                  {homepage?.eventLocation && ` · ${homepage.eventLocation}`}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Link
          href="/services"
          className="flex items-center justify-between gap-4 rounded-xl border p-4 hover:bg-gray-50"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">Автоматизация для мебельного бизнеса</p>
            <p className="mt-1">Кейсы, CRM и инструменты для мебельных компаний</p>
          </div>
          <span className="shrink-0 rounded border px-3 py-1.5 text-sm">Смотреть</span>
        </Link>
      </section>
    </main>
  );
}
