import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.contentPage.findUnique({ where: { slug } });
  if (!page) notFound();

  if (page.accessLevel === "MEMBERS") {
    const session = await auth();
    if (!session) {
      return (
        <main className="mx-auto max-w-2xl p-6">
          <h1 className="text-2xl font-semibold">{page.title}</h1>
          <p className="mt-4 rounded border bg-gray-50 p-4">
            Этот материал доступен только зарегистрированным участникам
            сообщества.{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>{" "}
            или{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              зарегистрироваться
            </Link>
            .
          </p>
        </main>
      );
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{page.title}</h1>
      <div className="mt-4 whitespace-pre-wrap">{page.body}</div>
    </main>
  );
}
