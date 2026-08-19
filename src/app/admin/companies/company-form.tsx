"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CompanyData = {
  id?: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  isTrustedPublisher: boolean;
};

export function CompanyForm({ company }: { company?: CompanyData }) {
  const router = useRouter();
  const [form, setForm] = useState<CompanyData>(
    company ?? {
      name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      isTrustedPublisher: false,
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(company?.id);

  function update<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEdit ? `/api/admin/companies/${company!.id}` : "/api/admin/companies";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не удалось сохранить компанию");
      return;
    }

    router.push("/admin/companies");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Название</span>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Категория</span>
        <input
          type="text"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          placeholder="Например: Корпусная мебель"
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Описание</span>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Адрес</span>
        <input
          type="text"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Телефон</span>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Сайт</span>
        <input
          type="text"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isTrustedPublisher}
          onChange={(e) => update("isTrustedPublisher", e.target.checked)}
        />
        <span className="text-sm text-gray-600">
          Публиковать сообщения этой компании в ленте сразу, без модерации
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Сохраняем..." : "Сохранить"}
      </button>
    </form>
  );
}
