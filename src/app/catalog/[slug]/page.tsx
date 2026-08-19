import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "./request-form";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      offers: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{company.name}</h1>
      {company.category && (
        <p className="mt-1 text-sm text-gray-500">{company.category}</p>
      )}
      {company.description && <p className="mt-4">{company.description}</p>}

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
        {company.address && (
          <>
            <dt className="font-medium">Адрес</dt>
            <dd>{company.address}</dd>
          </>
        )}
        {company.phone && (
          <>
            <dt className="font-medium">Телефон</dt>
            <dd>{company.phone}</dd>
          </>
        )}
        {company.website && (
          <>
            <dt className="font-medium">Сайт</dt>
            <dd>{company.website}</dd>
          </>
        )}
      </dl>

      {company.offers.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium">Предложения для вас</h2>
          <ul className="flex flex-col gap-3">
            {company.offers.map((offer) => (
              <li key={offer.id} className="rounded border p-3">
                <p className="font-medium">{offer.title}</p>
                {offer.description && (
                  <p className="text-sm text-gray-600">{offer.description}</p>
                )}
                {offer.ctaUrl && offer.ctaLabel && (
                  <a
                    href={offer.ctaUrl}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {offer.ctaLabel}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium">Оставить заявку</h2>
        <RequestForm companyId={company.id} />
      </section>
    </main>
  );
}
