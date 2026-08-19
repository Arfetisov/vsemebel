import { ingestFeedMessage } from "@/lib/feed";

// Токен появится после регистрации бота в MAX (аналог Telegram BotFather).
// Точный формат webhook-пейлоада и метод отправки ответа уточняется
// по официальной документации MAX Bot API на момент подключения —
// ниже общий каркас, который нужно будет свести к реальной схеме.
const token = process.env.MAX_BOT_TOKEN;

type MaxIncomingMessage = {
  message_id: string;
  chat_id: string;
  from_name?: string;
  text: string;
};

export async function handleMaxWebhook(payload: MaxIncomingMessage) {
  await ingestFeedMessage({
    source: "MAX",
    sourceMsgId: payload.message_id,
    authorName: payload.from_name,
    content: payload.text,
  });

  await sendMaxMessage(payload.chat_id, "Сообщение получено и отправлено на модерацию.");
}

export async function sendMaxMessage(chatId: string, text: string) {
  if (!token) return;

  // TODO: заменить на реальный endpoint MAX Bot API, когда будут получены
  // токен и документация от MAX.
  await fetch("https://botapi.max.ru/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
