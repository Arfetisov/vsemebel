import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "./sign-out-button";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/feed", label: "Сообщество" },
  { href: "/content", label: "Контент" },
  { href: "/services", label: "Услуги для бизнеса" },
];

export async function SiteHeader() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = role === "ADMIN" || role === "MODERATOR";

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-black text-xs font-bold text-white">
            ВМ
          </span>
          <span className="font-semibold tracking-tight">ВСЕ | МЕБЕЛЬ</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-6 text-sm sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 hover:text-black">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              {isStaff && (
                <Link href="/admin" className="text-gray-600 hover:underline">
                  Панель управления
                </Link>
              )}
              <span className="text-gray-500">{session.user.name ?? session.user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:underline">
                Войти
              </Link>
              <Link
                href="/register"
                className="rounded bg-black px-3 py-1.5 text-white hover:bg-gray-800"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t px-6 py-2 text-sm sm:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap text-gray-700">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
