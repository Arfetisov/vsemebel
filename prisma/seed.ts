import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@vse-mebel.ru" },
    update: {},
    create: {
      email: "admin@vse-mebel.ru",
      passwordHash,
      name: "Администратор",
      role: "ADMIN",
    },
  });

  const company = await prisma.company.upsert({
    where: { slug: "mebel-plus" },
    update: {},
    create: {
      name: "МебельПлюс",
      slug: "mebel-plus",
      category: "Корпусная мебель",
      description: "Производство корпусной мебели на заказ",
      address: "СПб, ул. Примерная, 1",
      phone: "+7 900 000-00-00",
      isTrustedPublisher: true,
    },
  });

  await prisma.offer.create({
    data: {
      companyId: company.id,
      title: "2 недели ИИ-бота бесплатно",
      description: "Попробуйте автоматизацию обработки заявок без оплаты",
      status: "ACTIVE",
    },
  });

  await prisma.feedMessage.create({
    data: {
      source: "WEB",
      companyId: company.id,
      authorName: "МебельПлюс",
      content: "Открыли новую линию по производству кухонных фасадов",
      status: "PUBLISHED",
    },
  });

  await prisma.contentPage.upsert({
    where: { slug: "analytics-2026" },
    update: {},
    create: {
      slug: "analytics-2026",
      title: "Аналитика рынка мебели СПб — 2026",
      body: "Демо-материал, доступный только зарегистрированным участникам.",
      accessLevel: "MEMBERS",
    },
  });

  await prisma.homepageSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      announcementMessage: "Бизнес-завтрак для мебельщиков СПб · 12 сентября · осталось 8 мест",
      announcementCtaLabel: "Записаться",
      announcementCtaUrl: "https://t.me/vsemebel",
      announcementActive: true,
      eventTitle: "Мебельный бизнес-форум СПб ТПП",
      eventStartsAt: new Date("2026-09-12T10:00:00+03:00"),
      eventLocation: "Санкт-Петербург",
      eventRegisterUrl: "https://t.me/vsemebel",
      newsTitle: "ЛДСП подорожает на 6% с сентября",
      newsSourceLabel: "Mebel-news.pro",
      newsSourceUrl: "https://mebel-news.pro",
      sponsorTitle: "Поставщик кромки «ЭджЛайн» — скидка 15% на первый заказ",
      sponsorSubtitle: "Доставка по СПб от 500 п.м.",
      sponsorCtaUrl: "https://example.com",
      sponsorActive: true,
    },
  });

  console.log("Сиды загружены. Админ: admin@vse-mebel.ru / admin12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
