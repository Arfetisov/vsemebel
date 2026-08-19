import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ModerationList } from "./moderation-list";

export default async function ModerationPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session) redirect("/login");
  if (role !== "ADMIN" && role !== "MODERATOR") redirect("/feed");

  const messages = await prisma.feedMessage.findMany({
    where: { status: "PENDING" },
    include: { company: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Модерация ленты</h1>
      <ModerationList messages={messages} />
    </main>
  );
}
