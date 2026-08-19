import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  contactName: z.string().optional(),
  contactInfo: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные заявки" },
      { status: 400 },
    );
  }

  const created = await prisma.request.create({ data: parsed.data });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
