import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";
import { ModerationList } from "./moderation-list";

export default async function ModerationPage() {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  const messages = await prisma.feedMessage.findMany({
    where: { status: "PENDING" },
    include: { company: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        ← Панель управления
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Модерация ленты</h1>
      <ModerationList messages={messages} />
    </main>
  );
}
