import { NextResponse } from "next/server";
import { webhookCallback } from "grammy";
import { telegramBot } from "@/lib/telegram-bot";

// Webhook-адрес для Telegram: https://ваш-домен/api/bots/telegram
// Регистрируется один раз через Bot API setWebhook, когда появится
// боевой домен и TELEGRAM_BOT_TOKEN.
export async function POST(request: Request) {
  if (!telegramBot) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN не настроен" },
      { status: 503 },
    );
  }

  const handler = webhookCallback(telegramBot, "std/http");
  return handler(request);
}
