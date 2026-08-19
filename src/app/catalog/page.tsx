import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const companies = await prisma.company.findMany({
    where: {
      AND: [
        category ? { category } : {},
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { name: "asc" },
  });

  const categories = await prisma.company.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Каталог компаний</h1>

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          placeholder="Поиск по названию или описанию"
          defaultValue={q}
          className="flex-1 rounded border px-3 py-2"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded border px-3 py-2"
        >
          <option value="">Все категории</option>
          {categories
            .filter((c) => c.category)
            .map((c) => (
              <option key={c.category} value={c.category!}>
                {c.category}
              </option>
            ))}
        </select>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Найти
        </button>
      </form>

      {companies.length === 0 && (
        <p className="text-gray-500">Ничего не найдено.</p>
      )}

      <ul className="flex flex-col gap-3">
        {companies.map((company) => (
          <li key={company.id} className="rounded border p-4">
            <Link href={`/catalog/${company.slug}`} className="text-lg font-medium hover:underline">
              {company.name}
            </Link>
            {company.category && (
              <span className="ml-2 text-sm text-gray-500">{company.category}</span>
            )}
            {company.description && (
              <p className="mt-1 text-sm text-gray-600">{company.description}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
