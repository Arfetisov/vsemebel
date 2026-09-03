const categories = [
  {
    title: "Кейсы",
    description: "Истории компаний, которые уже используют автоматизацию — бесплатно для всех",
  },
  {
    title: "CRM для мебельщиков",
    description: "Простая база клиентов и сделок под мебельный бизнес",
  },
  {
    title: "Партнёрские рубрики",
    description: "Проверенные сервисы партнёров — телефония, CRM-системы и другое",
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Услуги для бизнеса</h1>
      <p className="mt-2 text-gray-600">
        Витрина инструментов автоматизации для мебельных компаний. Раздел в разработке.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category.title} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{category.title}</p>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                Скоро
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
