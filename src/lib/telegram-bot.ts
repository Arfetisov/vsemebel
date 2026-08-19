import { Bot } from "grammy";
import { ingestFeedMessage } from "@/lib/feed";

// Токен появится, когда вы создадите бота через @BotFather в Telegram
// и добавите TELEGRAM_BOT_TOKEN в .env
const token = process.env.TELEGRAM_BOT_TOKEN;

export const telegramBot = token ? new Bot(token) : null;

telegramBot?.on("message:text", async (ctx) => {
  await ingestFeedMessage({
    source: "TELEGRAM",
    sourceMsgId: String(ctx.message.message_id),
    authorName: ctx.from?.first_name,
    content: ctx.message.text,
  });

  await ctx.reply("Сообщение получено и отправлено на модерацию.");
});
