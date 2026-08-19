"use client";

import { useState } from "react";

export function RequestForm({ companyId }: { companyId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        title,
        description,
        contactName,
        contactInfo,
      }),
    });

    if (!res.ok) {
      setError("Не удалось отправить заявку, попробуйте ещё раз");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded border border-green-300 bg-green-50 p-3 text-green-700">
        Заявка отправлена, с вами свяжутся.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Тема заявки"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <input
        type="text"
        placeholder="Ваше имя"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <input
        type="text"
        placeholder="Телефон или email для связи"
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
        className="rounded border px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Отправить заявку
      </button>
    </form>
  );
}
