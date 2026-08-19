import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/require-staff";
import { CompanyForm } from "../company-form";

export default async function NewCompanyPage() {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Новая компания</h1>
      <CompanyForm />
    </main>
  );
}
