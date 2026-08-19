import Link from "next/link";

const links = [
  { href: "/catalog", label: "Каталог компаний" },
  { href: "/feed", label: "Лента сообщества" },
  { href: "/login", label: "Вход" },
  { href: "/register", label: "Регистрация" },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">Мебельное B2B-сообщество СПб</h1>
      <p className="text-gray-600">
        Каталог компаний, заявки и общая лента сообщества.
      </p>
      <nav className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded border px-4 py-2 hover:bg-gray-50"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
