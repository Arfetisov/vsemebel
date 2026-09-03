import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/require-staff";

export default async function AdminHomePage() {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Панель управления</h1>
      <nav className="flex flex-col gap-3">
        <Link href="/admin/companies" className="rounded border p-4 hover:bg-gray-50">
          <p className="font-medium">Компании</p>
          <p className="text-sm text-gray-500">Добавление и редактирование карточек каталога</p>
        </Link>
        <Link href="/admin/moderation" className="rounded border p-4 hover:bg-gray-50">
          <p className="font-medium">Модерация ленты</p>
          <p className="text-sm text-gray-500">Сообщения из Telegram/MAX, ожидающие проверки</p>
        </Link>
        <Link href="/admin/homepage" className="rounded border p-4 hover:bg-gray-50">
          <p className="font-medium">Главная страница</p>
          <p className="text-sm text-gray-500">Анонс-полоса, ближайшее событие, новость, рекламный баннер</p>
        </Link>
      </nav>
    </main>
  );
}
