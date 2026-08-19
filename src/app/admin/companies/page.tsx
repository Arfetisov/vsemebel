import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";

export default async function AdminCompaniesPage() {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        ← Панель управления
      </Link>
      <div className="mb-6 mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Компании</h1>
        <Link
          href="/admin/companies/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          + Добавить компанию
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {companies.map((company) => (
          <li key={company.id} className="flex items-center justify-between rounded border p-4">
            <div>
              <p className="font-medium">{company.name}</p>
              {company.category && (
                <p className="text-sm text-gray-500">{company.category}</p>
              )}
            </div>
            <Link
              href={`/admin/companies/${company.id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Редактировать
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
