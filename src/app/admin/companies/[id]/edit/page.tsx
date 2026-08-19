import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";
import { CompanyForm } from "../../company-form";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Редактирование компании</h1>
      <CompanyForm
        company={{
          id: company.id,
          name: company.name,
          category: company.category ?? "",
          description: company.description ?? "",
          address: company.address ?? "",
          phone: company.phone ?? "",
          website: company.website ?? "",
          isTrustedPublisher: company.isTrustedPublisher,
        }}
      />
    </main>
  );
}
