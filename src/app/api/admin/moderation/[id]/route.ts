import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || (role !== "ADMIN" && role !== "MODERATOR")) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await request.json();

  if (action !== "publish" && action !== "reject") {
    return NextResponse.json({ error: "Некорректное действие" }, { status: 400 });
  }

  const userId = (session.user as { id?: string }).id;

  const updated = await prisma.feedMessage.update({
    where: { id },
    data: {
      status: action === "publish" ? "PUBLISHED" : "REJECTED",
      moderatorId: userId,
      moderatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
