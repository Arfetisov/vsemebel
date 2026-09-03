import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";
import { HomepageForm } from "./homepage-form";

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function AdminHomepagePage() {
  const { session, isStaff } = await requireStaffSession();

  if (!session) redirect("/login");
  if (!isStaff) redirect("/feed");

  const settings = await prisma.homepageSettings.findUnique({ where: { id: "singleton" } });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        ← Панель управления
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Главная страница</h1>

      <HomepageForm
        settings={{
          announcementMessage: settings?.announcementMessage ?? "",
          announcementCtaLabel: settings?.announcementCtaLabel ?? "",
          announcementCtaUrl: settings?.announcementCtaUrl ?? "",
          announcementActive: settings?.announcementActive ?? false,

          eventTitle: settings?.eventTitle ?? "",
          eventStartsAt: toDatetimeLocal(settings?.eventStartsAt ?? null),
          eventLocation: settings?.eventLocation ?? "",
          eventRegisterUrl: settings?.eventRegisterUrl ?? "",

          newsTitle: settings?.newsTitle ?? "",
          newsSourceLabel: settings?.newsSourceLabel ?? "",
          newsSourceUrl: settings?.newsSourceUrl ?? "",

          sponsorTitle: settings?.sponsorTitle ?? "",
          sponsorSubtitle: settings?.sponsorSubtitle ?? "",
          sponsorCtaUrl: settings?.sponsorCtaUrl ?? "",
          sponsorActive: settings?.sponsorActive ?? false,
        }}
      />
    </main>
  );
}
