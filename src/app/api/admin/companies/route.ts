import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/require-staff";
import { slugify } from "@/lib/slug";

const companySchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  isTrustedPublisher: z.boolean().optional(),
});

export async function POST(request: Request) {
  const { isStaff } = await requireStaffSession();
  if (!isStaff) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = companySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name) || "company";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const company = await prisma.company.create({
    data: { ...parsed.data, slug },
  });

  return NextResponse.json(company, { status: 201 });
}
