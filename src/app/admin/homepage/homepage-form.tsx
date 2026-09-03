"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  announcementMessage: string;
  announcementCtaLabel: string;
  announcementCtaUrl: string;
  announcementActive: boolean;

  eventTitle: string;
  eventStartsAt: string;
  eventLocation: string;
  eventRegisterUrl: string;

  newsTitle: string;
  newsSourceLabel: string;
  newsSourceUrl: string;

  sponsorTitle: string;
  sponsorSubtitle: string;
  sponsorCtaUrl: string;
  sponsorActive: boolean;
};

export function HomepageForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Не удалось сохранить");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="rounded border p-4">
        <legend className="px-1 text-sm font-medium">Анонс-полоса вверху сайта</legend>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.announcementActive}
              onChange={(e) => update("announcementActive", e.target.checked)}
            />
            Показывать анонс
          </label>
          <input
            type="text"
            placeholder="Текст анонса"
            value={form.announcementMessage}
            onChange={(e) => update("announcementMessage", e.target.value)}
            className="rounded border px-3 py-2"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Текст кнопки, напр. Записаться"
              value={form.announcementCtaLabel}
              onChange={(e) => update("announcementCtaLabel", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ссылка"
              value={form.announcementCtaUrl}
              onChange={(e) => update("announcementCtaUrl", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded border p-4">
        <legend className="px-1 text-sm font-medium">Ближайшее событие</legend>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Название события"
            value={form.eventTitle}
            onChange={(e) => update("eventTitle", e.target.value)}
            className="rounded border px-3 py-2"
          />
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={form.eventStartsAt}
              onChange={(e) => update("eventStartsAt", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Место проведения"
              value={form.eventLocation}
              onChange={(e) => update("eventLocation", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
          </div>
          <input
            type="text"
            placeholder="Ссылка на регистрацию"
            value={form.eventRegisterUrl}
            onChange={(e) => update("eventRegisterUrl", e.target.value)}
            className="rounded border px-3 py-2"
          />
        </div>
      </fieldset>

      <fieldset className="rounded border p-4">
        <legend className="px-1 text-sm font-medium">Новость отрасли</legend>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Заголовок новости"
            value={form.newsTitle}
            onChange={(e) => update("newsTitle", e.target.value)}
            className="rounded border px-3 py-2"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Источник, напр. Mebel-news.pro"
              value={form.newsSourceLabel}
              onChange={(e) => update("newsSourceLabel", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ссылка на источник"
              value={form.newsSourceUrl}
              onChange={(e) => update("newsSourceUrl", e.target.value)}
              className="flex-1 rounded border px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded border p-4">
        <legend className="px-1 text-sm font-medium">Рекламный баннер</legend>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.sponsorActive}
              onChange={(e) => update("sponsorActive", e.target.checked)}
            />
            Показывать баннер
          </label>
          <input
            type="text"
            placeholder="Заголовок"
            value={form.sponsorTitle}
            onChange={(e) => update("sponsorTitle", e.target.value)}
            className="rounded border px-3 py-2"
          />
          <input
            type="text"
            placeholder="Подзаголовок"
            value={form.sponsorSubtitle}
            onChange={(e) => update("sponsorSubtitle", e.target.value)}
            className="rounded border px-3 py-2"
          />
          <input
            type="text"
            placeholder="Ссылка"
            value={form.sponsorCtaUrl}
            onChange={(e) => update("sponsorCtaUrl", e.target.value)}
            className="rounded border px-3 py-2"
          />
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Сохранено</p>}

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
