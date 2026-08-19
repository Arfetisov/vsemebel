import { NextResponse } from "next/server";
import { handleMaxWebhook } from "@/lib/max-bot";

// Webhook-адрес для MAX: https://ваш-домен/api/bots/max
// Точный формат тела запроса нужно свести к реальной схеме MAX Bot API
// после получения токена и документации.
export async function POST(request: Request) {
  const payload = await request.json();
  await handleMaxWebhook(payload);
  return NextResponse.json({ ok: true });
}
