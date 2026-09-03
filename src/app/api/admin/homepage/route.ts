import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";

const homepageSchema = z.object({
  announcementMessage: z.string().optional(),
  announcementCtaLabel: z.string().optional(),
  announcementCtaUrl: z.string().optional(),
  announcementActive: z.boolean().optional(),

  eventTitle: z.string().optional(),
  eventStartsAt: z.string().optional(),
  eventLocation: z.string().optional(),
  eventCapacity: z.number().int().optional().nullable(),
  eventRegisterUrl: z.string().optional(),

  newsTitle: z.string().optional(),
  newsSourceLabel: z.string().optional(),
  newsSourceUrl: z.string().optional(),

  sponsorTitle: z.string().optional(),
  sponsorSubtitle: z.string().optional(),
  sponsorCtaUrl: z.string().optional(),
  sponsorActive: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const { isStaff } = await requireStaffSession();
  if (!isStaff) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = homepageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const { eventStartsAt, ...rest } = parsed.data;

  const settings = await prisma.homepageSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...rest,
      eventStartsAt: eventStartsAt ? new Date(eventStartsAt) : null,
    },
    create: {
      id: "singleton",
      ...rest,
      eventStartsAt: eventStartsAt ? new Date(eventStartsAt) : null,
    },
  });

  return NextResponse.json(settings);
}
