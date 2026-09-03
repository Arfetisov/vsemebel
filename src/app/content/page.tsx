import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContentIndexPage() {
  const pages = await prisma.contentPage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Контент</h1>

      {pages.length === 0 ? (
        <p className="text-gray-500">Материалов пока нет.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pages.map((page) => (
            <li key={page.id} className="rounded border p-4">
              <Link href={`/content/${page.slug}`} className="font-medium hover:underline">
                {page.title}
              </Link>
              {page.accessLevel === "MEMBERS" && (
                <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  Только для участников
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
