"use client";

import { useState } from "react";
import { CalendarClock, X } from "lucide-react";

export function AnnouncementBar({
  message,
  ctaLabel,
  ctaUrl,
}: {
  message: string;
  ctaLabel: string;
  ctaUrl: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-50 px-5 py-2 text-amber-900">
      <div className="flex items-center gap-2 text-sm">
        <CalendarClock size={15} className="shrink-0" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-4">
        {ctaUrl && ctaLabel && (
          <a href={ctaUrl} className="text-sm font-medium underline underline-offset-2">
            {ctaLabel}
          </a>
        )}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Скрыть"
          className="text-amber-700 hover:text-amber-900"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
