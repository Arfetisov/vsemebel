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
