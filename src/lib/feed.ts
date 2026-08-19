import { prisma } from "@/lib/prisma";
import type { MessageSource } from "@prisma/client";

/**
 * Точка входа для сообщений, приходящих из Telegram/MAX/WhatsApp-ботов.
 * Компании с флагом isTrustedPublisher публикуются в ленте сразу,
 * остальные попадают в очередь модерации ("PENDING").
 */
export async function ingestFeedMessage(params: {
  source: MessageSource;
  sourceMsgId?: string;
  companyId?: string;
  authorName?: string;
  content: string;
  attachmentUrl?: string;
}) {
  const company = params.companyId
    ? await prisma.company.findUnique({ where: { id: params.companyId } })
    : null;

  const status = company?.isTrustedPublisher ? "PUBLISHED" : "PENDING";

  return prisma.feedMessage.create({
    data: {
      source: params.source,
      sourceMsgId: params.sourceMsgId,
      companyId: params.companyId,
      authorName: params.authorName,
      content: params.content,
      attachmentUrl: params.attachmentUrl,
      status,
    },
  });
}
