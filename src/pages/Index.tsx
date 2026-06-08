import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type IName = Parameters<typeof Icon>[0]["name"];

const HERO_IMAGE = "https://cdn.poehali.dev/projects/138d6c46-09e6-4b3e-b285-82c943da07d1/files/b23ebb4f-4dce-4240-849b-568ee60c3ab2.jpg";
const ARCTIC_IMAGE = "https://cdn.poehali.dev/projects/138d6c46-09e6-4b3e-b285-82c943da07d1/files/58a02f2e-7b54-47ca-af7d-cebc37ba5a88.jpg";
const MACHINE_IMAGE = "https://cdn.poehali.dev/projects/138d6c46-09e6-4b3e-b285-82c943da07d1/files/b941d0df-9638-4566-91a0-f19196dd8d19.jpg";

const MODELS = [
  {
    id: "pro",
    name: "САТУРН-ПРО",
    subtitle: "Максимальная комплектация",
    badge: "ФЛАГМАН",
    badgeColor: "blue",
    desc: "Для цехов и тёплых условий. Полная автономность: встроенный аккумулятор, WiFi-пульт, ручной привод — всё в одном.",
    features: [
      { icon: "Battery", label: "Li-Ion 24В встроенный" },
      { icon: "Wifi", label: "WiFi пульт ДУ 433 МГц" },
      { icon: "Sliders", label: "Потенциометр-энкодер" },
      { icon: "Plug", label: "Сеть 220В через БП" },
      { icon: "Hand", label: "Ручной привод" },
      { icon: "Zap", label: "Реле плазменного резака" },
      { icon: "Thermometer", label: "До 0°C" },
    ],
    highlight: true,
  },
  {
    id: "titan",
    name: "САТУРН-ТИТАН",
    subtitle: "Арктическое исполнение",
    badge: "−40°C",
    badgeColor: "orange",
    desc: "Для трассовых работ на Севере, в Сибири, Арктике. Литий-титановый аккумулятор работает в экстремальный мороз.",
    features: [
      { icon: "Battery", label: "LiTi 24В для −40°C" },
      { icon: "Wifi", label: "WiFi пульт ДУ 433 МГц" },
      { icon: "Sliders", label: "Потенциометр-энкодер" },
      { icon: "Plug", label: "Сеть 220В через БП" },
      { icon: "Hand", label: "Ручной привод" },
      { icon: "Zap", label: "Реле плазменного резака" },
      { icon: "Thermometer", label: "До −40°C" },
    ],
    highlight: false,
  },
  {
    id: "enceladus",
    name: "САТУРН-ЭНЦЕЛАД",
    subtitle: "Для мобильных бригад",
    badge: "МОБИЛЬНЫЙ",
    badgeColor: "blue",
    desc: "Съёмный аккумулятор по принципу шуруповёрта — горячая замена без простоя. Стандарт: Li-Ion (до 0°C). Опция: LiTi (до −40°C) по заявке.",
    features: [
      { icon: "Battery", label: "Съёмный АКБ 24В (Li-Ion/LiTi)" },
      { icon: "Wifi", label: "WiFi пульт ДУ 433 МГц" },
      { icon: "Sliders", label: "Потенциометр-энкодер" },
      { icon: "Plug", label: "Сеть 220В через БП" },
      { icon: "X", label: "Без ручного привода" },
      { icon: "Zap", label: "Реле плазменного резака" },
      { icon: "RefreshCw", label: "Горячая замена АКБ" },
    ],
    highlight: false,
  },
  {
    id: "mimas",
    name: "САТУРН-МИМАС",
    subtitle: "Надёжный базис",
    badge: "БЮДЖЕТ",
    badgeColor: "steel",
    desc: "Только ручной привод. Идеален для резервных работ, обучения персонала и задач с ограниченным бюджетом.",
    features: [
      { icon: "X", label: "Без аккумулятора" },
      { icon: "X", label: "Без WiFi пульта" },
      { icon: "X", label: "Без энкодера" },
      { icon: "X", label: "Без БП 220В" },
      { icon: "X", label: "Без реле резака" },
      { icon: "Hand", label: "Только ручной привод" },
      { icon: "CircleDollarSign", label: "Минимальная стоимость" },
    ],
    highlight: false,
  },
];

const SPECS_ROWS = [
  { param: "Диаметр трубы", value: "от 219 мм" },
  { param: "Толщина стенки", value: "3 – 45 мм" },
  { param: "Скорость резки", value: "10 – 70 см/мин" },
  { param: "Типы резки", value: "Газовая (сталь), Плазменная (сталь, нержавейка)" },
  { param: "Автономность (АКБ)", value: "2 – 3 часа" },
  { param: "Пульт ДУ", value: "433 МГц (WiFi)" },
  { param: "Питание от сети", value: "220В через блок питания" },
  { param: "Реле для резака", value: "Встроенное" },
  { param: "Переключение привода", value: "Без демонтажа (PRO, ТИТАН)" },
  { param: "Персонализация", value: "Имя заказчика в прошивке / на дисплее" },
  { param: "Гарантия", value: "12 месяцев" },
  { param: "Срок изготовления", value: "От наличия до 2 месяцев" },
];

const COMPARE_COLS = [
  { key: "battery", label: "АКБ", pro: "Li-Ion\nвстроенный", titan: "LiTi\n−40°C", enc: "Съёмный\nLi-Ion/LiTi", mimas: "—" },
  { key: "wifi", label: "WiFi пульт", pro: "✓", titan: "✓", enc: "✓", mimas: "—" },
  { key: "encoder", label: "Энкодер", pro: "✓", titan: "✓", enc: "✓", mimas: "—" },
  { key: "power", label: "220В сеть", pro: "✓", titan: "✓", enc: "✓", mimas: "—" },
  { key: "manual", label: "Ручной привод", pro: "✓", titan: "✓", enc: "—", mimas: "✓" },
  { key: "relay", label: "Реле резака", pro: "✓", titan: "✓", enc: "✓", mimas: "—" },
  { key: "temp", label: "Мин. температура", pro: "0°C", titan: "−40°C", enc: "0°C / −40°C*", mimas: "—" },
];

const BELTS = [
  { range: "400 – 600 мм", dn: "DN 400–600" },
  { range: "600 – 1000 мм", dn: "DN 600–1000" },
  { range: "800 – 1200 мм", dn: "DN 800–1200" },
  { range: "800 – 1300 мм", dn: "DN 800–1300" },
  { range: "1200 – 1500 мм", dn: "DN 1200–1500" },
  { range: "Под заказ", dn: "Любой размер" },
];

const COMPATIBLE = ["Zinser RSV-4", "GLOOR TuboCut IV", "Орбита", "Комета", "Собственные машины САТУРН"];

const INDUSTRIES = [
  {
    icon: "Flame",
    title: "Нефтегаз",
    desc: "Строительство и ремонт магистральных трубопроводов. Работа в полевых условиях, вахтовый режим, экстремальные климатические условия.",
    tags: ["Магистральные трубопроводы", "Полевые работы", "Арктика"],
  },
  {
    icon: "Atom",
    title: "Атомная энергетика",
    desc: "Монтаж трубопроводных систем АЭС. Высокие требования к точности реза, возможность плазменной резки нержавеющей стали.",
    tags: ["АЭС", "Нержавейка", "Точность реза"],
  },
  {
    icon: "Building2",
    title: "ЖКХ и теплоснабжение",
    desc: "Капитальный ремонт тепловых сетей, водоснабжения и канализации. Работа в стеснённых условиях подземных и наземных прокладок.",
    tags: ["Теплосети", "Ремонт", "Городская инфраструктура"],
  },
  {
    icon: "HardHat",
    title: "Строительство",
    desc: "Монтаж промышленных трубопроводов при возведении предприятий, портов, НПЗ. Ускорение строительства за счёт высокой скорости резки.",
    tags: ["Промышленные объекты", "НПЗ", "Порты"],
  },
];

const STATS = [
  { value: "219+", label: "мм диаметр труб", icon: "Circle" },
  { value: "45", label: "мм толщина стенки", icon: "Layers" },
  { value: "−40°C", label: "мороз не проблема", icon: "Snowflake" },
  { value: "70", label: "см/мин скорость", icon: "Zap" },
];

function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Navbar({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "products", label: "Продукция" },
    { id: "belts", label: "Пояса" },
    { id: "technologies", label: "Технологии" },
    { id: "industries", label: "Отрасли" },
    { id: "about", label: "О компании" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: "rgba(5,12,26,0.92)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a5ce8, #3b82f6)",
              boxShadow: "0 0 16px rgba(59,130,246,0.5)",
            }}
          >
            <Icon name="CircleDot" size={16} className="text-white" />
          </div>
          <div>
            <div className="font-oswald text-white font-semibold text-base leading-none tracking-wider">
              САТУРН
            </div>
            <div className="text-xs text-slate-500 font-mono leading-none mt-0.5">
              МАЛАЯ МЕХАНИЗАЦИЯ
            </div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav-link ${activeSection === l.id ? "text-white" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contacts"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #1a5ce8, #2563eb)",
            boxShadow: "0 0 16px rgba(26,92,232,0.4)",
          }}
        >
          <Icon name="MessageSquare" size={14} />
          Заявка
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          <Icon name={open ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {open && (
        <div
          className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-3"
          style={{ background: "rgba(5,12,26,0.98)" }}
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="nav-link py-2 text-base"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacts"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #1a5ce8, #2563eb)" }}
          >
            <Icon name="MessageSquare" size={14} />
            Оставить заявку
          </a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "64px" }}
    >
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Орбитальная резка труб"
          className="w-full h-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,12,26,0.92) 0%, rgba(10,22,40,0.85) 50%, rgba(5,12,26,0.92) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #1a5ce8 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-8 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div
            className={`orange-tag mb-6 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Icon name="MapPin" size={11} />
            Производство · Санкт-Петербург
          </div>

          <h1
            className={`font-oswald font-bold leading-none mb-6 transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "#f0f6ff" }}
          >
            ОРБИТАЛЬНАЯ
            <br />
            <span className="glow-text-blue" style={{ color: "#3b82f6" }}>
              РЕЗКА ТРУБ
            </span>
            <br />
            НОВОГО УРОВНЯ
          </h1>

          <p
            className={`text-slate-300 text-lg mb-8 leading-relaxed max-w-lg transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Линейка орбитальных машин{" "}
            <strong className="text-white">«САТУРН»</strong> — российское
            оборудование для газовой и плазменной резки труб от 219 мм. Работает
            в мороз до −40°C.
          </p>

          <div
            className={`flex flex-wrap gap-3 mb-10 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <span className="feature-tag">
              <Icon name="Shield" size={11} />
              Российское производство
            </span>
            <span className="feature-tag">
              <Icon name="Snowflake" size={11} />
              До −40°C
            </span>
            <span className="feature-tag">
              <Icon name="Settings" size={11} />4 комплектации
            </span>
            <span className="feature-tag">
              <Icon name="Award" size={11} />
              Гарантия 12 мес.
            </span>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <a
              href="#contacts"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded text-white font-oswald font-semibold text-lg tracking-wider transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 30px rgba(249,115,22,0.4)",
              }}
            >
              <Icon name="FileText" size={18} />
              Заявка на расчёт
            </a>
            <a
              href="#products"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded font-semibold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(59,130,246,0.4)" }}
            >
              <Icon name="ChevronDown" size={18} />
              Смотреть продукцию
            </a>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="gradient-border card-hover rounded-xl p-6 text-center"
              style={{ background: "rgba(10,22,40,0.8)" }}
            >
              <Icon
                name={s.icon as IName}
                size={24}
                className="mx-auto mb-3"
                style={{ color: "#3b82f6" }}
              />
              <div
                className="font-oswald font-bold glow-text-blue mb-1"
                style={{ fontSize: "2.2rem", color: "#3b82f6" }}
              >
                {s.value}
              </div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">
          Прокрутите
        </div>
        <Icon name="ChevronDown" size={16} className="text-slate-500 animate-bounce" />
      </div>
    </section>
  );
}

function ProductsSection() {
  const { ref, visible } = useIntersection();

  return (
    <section
      id="products"
      ref={ref}
      className="py-24 relative"
      style={{ background: "linear-gradient(180deg, #050c1a 0%, #070e1f 100%)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="feature-tag mb-4 inline-flex">
            <Icon name="Package" size={11} />
            Линейка САТУРН
          </div>
          <h2
            className="font-oswald font-bold text-white section-title"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            ПРОДУКЦИЯ
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl text-lg">
            Четыре модели под любые условия работы: от арктических трасс до
            учебных классов. Единая платформа — разная комплектация.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {MODELS.map((m, i) => (
            <div
              key={m.id}
              className={`gradient-border card-hover rounded-xl overflow-hidden flex flex-col transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{
                background: m.highlight
                  ? "linear-gradient(135deg, rgba(26,92,232,0.15), rgba(10,22,40,0.9))"
                  : "rgba(10,22,40,0.9)",
                transitionDelay: `${i * 0.1}s`,
                boxShadow: m.highlight
                  ? "0 0 40px rgba(59,130,246,0.15)"
                  : undefined,
              }}
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      m.badgeColor === "orange"
                        ? "orange-tag"
                        : m.badgeColor === "steel"
                          ? "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                          : "feature-tag"
                    }`}
                  >
                    {m.badge}
                  </span>
                  {m.highlight && (
                    <Icon name="Star" size={16} style={{ color: "#3b82f6" }} />
                  )}
                </div>
                <h3 className="font-oswald font-bold text-white text-2xl mb-1">
                  {m.name}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{m.subtitle}</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {m.desc}
                </p>

                <ul className="flex flex-col gap-2">
                  {m.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Icon
                        name={f.icon as IName}
                        size={13}
                        className={
                          f.icon === "X" ? "text-slate-600" : "text-blue-400"
                        }
                      />
                      <span
                        className={
                          f.icon === "X"
                            ? "text-slate-600 line-through"
                            : "text-slate-300"
                        }
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-6">
                <a
                  href="#contacts"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: m.highlight
                      ? "linear-gradient(135deg, #1a5ce8, #2563eb)"
                      : "rgba(26,92,232,0.2)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <Icon name="MessageSquare" size={14} />
                  Запросить цену
                </a>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h3 className="font-oswald text-white text-2xl font-bold mb-6">
            Сравнение комплектаций
          </h3>
          <div
            className="overflow-x-auto rounded-xl gradient-border"
            style={{ background: "rgba(7,14,31,0.9)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(59,130,246,0.15)" }}
                >
                  <th className="text-left px-5 py-4 text-slate-500 font-mono text-xs uppercase tracking-wider">
                    Характеристика
                  </th>
                  {[
                    "САТУРН-ПРО",
                    "САТУРН-ТИТАН",
                    "САТУРН-ЭНЦЕЛАД",
                    "САТУРН-МИМАС",
                  ].map((n) => (
                    <th
                      key={n}
                      className="px-4 py-4 font-oswald text-white text-sm font-semibold text-center whitespace-nowrap"
                    >
                      {n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_COLS.map((row, i) => (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom:
                        "1px solid rgba(255,255,255,0.04)",
                      background:
                        i % 2 === 0
                          ? "transparent"
                          : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td className="px-5 py-3 text-slate-400">{row.label}</td>
                    {[row.pro, row.titan, row.enc, row.mimas].map((v, j) => (
                      <td key={j} className="px-4 py-3 text-center whitespace-pre-line">
                        <span
                          className={
                            v === "✓"
                              ? "text-blue-400 font-bold text-lg"
                              : v === "—"
                                ? "text-slate-700"
                                : "text-slate-300 text-xs"
                          }
                        >
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-600 text-xs mt-3 font-mono">
            * САТУРН-ЭНЦЕЛАД: стандартная комплектация до 0°C (Li-Ion АКБ). Работа до −40°C — при заказе LiTi аккумулятора.
          </p>
        </div>
      </div>
    </section>
  );
}

function SpecsSection() {
  const { ref, visible } = useIntersection();

  return (
    <section
      id="belts"
      ref={ref}
      className="py-24 relative"
      style={{ background: "linear-gradient(180deg, #070e1f 0%, #050c1a 100%)" }}
    >
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right, #1a5ce8 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-start">
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
        >
          <div className="feature-tag mb-4 inline-flex">
            <Icon name="Cpu" size={11} />
            Технические данные
          </div>
          <h2
            className="font-oswald font-bold text-white section-title mb-8"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
          >
            ХАРАКТЕРИСТИКИ
          </h2>

          <div
            className="rounded-xl overflow-hidden gradient-border"
            style={{ background: "rgba(10,22,40,0.8)" }}
          >
            {SPECS_ROWS.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3.5"
                style={{
                  borderBottom:
                    i < SPECS_ROWS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : undefined,
                  background:
                    i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <span className="text-slate-400 text-sm">{row.param}</span>
                <span className="text-white text-sm font-medium text-right ml-4">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <div className="orange-tag mb-4 inline-flex">
            <Icon name="Link" size={11} />
            Направляющие пояса
          </div>
          <h2
            className="font-oswald font-bold text-white section-title mb-4"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
          >
            БАНДАЖИ
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Направляющие пояса для собственных машин серии САТУРН, а также для
            совместимых зарубежных и отечественных орбитальных машин.
            Изготовление нестандартных типоразмеров под заказ.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {BELTS.map((b, i) => (
              <div
                key={i}
                className={`gradient-border rounded-lg p-4 text-center transition-all duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                style={{
                  background: "rgba(10,22,40,0.8)",
                  transitionDelay: `${i * 0.05 + 0.3}s`,
                  border:
                    b.range === "Под заказ"
                      ? "1px solid rgba(249,115,22,0.3)"
                      : undefined,
                }}
              >
                <div
                  className={`font-oswald font-bold text-sm mb-1 ${b.range === "Под заказ" ? "text-orange-400" : "text-white"}`}
                >
                  {b.range}
                </div>
                <div className="text-slate-500 text-xs font-mono">{b.dn}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-3">
              Совместимость с оборудованием:
            </div>
            <div className="flex flex-wrap gap-2">
              {COMPATIBLE.map((c, i) => (
                <span key={i} className="feature-tag text-xs">
                  <Icon name="CheckCircle" size={10} />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologiesSection() {
  const { ref, visible } = useIntersection();

  const techs = [
    {
      icon: "Code2",
      title: "Персонализация ПО",
      desc: "Имя заказчика прошивается в микроконтроллер и отображается на дисплее машины. Ваш бренд — на каждом инструменте.",
    },
    {
      icon: "Wifi",
      title: "WiFi-пульт ДУ",
      desc: "Управление на частоте 433 МГц с расстояния. Оператор контролирует скорость и направление без прямого контакта с машиной.",
    },
    {
      icon: "Sliders",
      title: "Потенциометр-энкодер",
      desc: "Точная регулировка скорости резки непосредственно с корпуса машины. Плавно, без люфта, в любых перчатках.",
    },
    {
      icon: "Battery",
      title: "Литий-титановый АКБ",
      desc: "Уникальная химия LiTi сохраняет ёмкость при −40°C. 2–3 часа автономной работы на одном заряде. Горячая замена (ЭНЦЕЛАД).",
    },
    {
      icon: "Wrench",
      title: "Двойной привод",
      desc: "Переключение с электрического на ручной привод без демонтажа (модели ПРО и ТИТАН). Незаменимо при отказе питания.",
    },
    {
      icon: "Zap",
      title: "Реле плазменного резака",
      desc: "Встроенное реле для прямого подключения плазменного резака. Синхронизированный старт — максимальная точность реза.",
    },
  ];

  return (
    <section
      id="technologies"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "#050c1a" }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-3/4 opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at left, #f97316 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="feature-tag mb-4 inline-flex">
            <Icon name="Cpu" size={11} />
            Технологии
          </div>
          <h2
            className="font-oswald font-bold text-white section-title"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            ИНЖЕНЕРНЫЕ РЕШЕНИЯ
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techs.map((t, i) => (
            <div
              key={i}
              className={`gradient-border card-hover rounded-xl p-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                background: "rgba(10,22,40,0.8)",
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{
                  background: "rgba(26,92,232,0.15)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <Icon
                  name={t.icon as IName}
                  size={18}
                  style={{ color: "#3b82f6" }}
                />
              </div>
              <h3 className="font-oswald text-white font-semibold text-lg mb-3">
                {t.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 rounded-2xl overflow-hidden gradient-border relative transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <img
            src={ARCTIC_IMAGE}
            alt="САТУРН-ТИТАН в арктических условиях"
            className="w-full h-64 md:h-80 object-cover opacity-70"
          />
          <div
            className="absolute inset-0 flex items-end p-8"
            style={{
              background:
                "linear-gradient(to top, rgba(5,12,26,0.95) 0%, transparent 50%)",
            }}
          >
            <div>
              <div className="orange-tag mb-3 inline-flex">
                <Icon name="Snowflake" size={11} />
                САТУРН-ТИТАН
              </div>
              <h3 className="font-oswald text-white font-bold text-2xl md:text-3xl">
                Работает там, где другие отказывают
              </h3>
              <p className="text-slate-300 mt-2 text-sm max-w-lg">
                Трассовые работы при −40°C в Арктике и Сибири — штатный режим
                для САТУРН-ТИТАН.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const { ref, visible } = useIntersection();

  return (
    <section
      id="industries"
      ref={ref}
      className="py-24 relative"
      style={{ background: "linear-gradient(180deg, #050c1a 0%, #070e1f 100%)" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="feature-tag mb-4 inline-flex">
            <Icon name="Globe" size={11} />
            Применение
          </div>
          <h2
            className="font-oswald font-bold text-white section-title"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            ОТРАСЛИ
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl text-lg">
            Оборудование САТУРН применяется в ключевых отраслях российской
            промышленности.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {INDUSTRIES.map((ind, i) => (
            <div
              key={i}
              className={`gradient-border card-hover rounded-xl p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                background: "rgba(10,22,40,0.8)",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }}
                >
                  <Icon
                    name={ind.icon as IName}
                    size={22}
                    style={{ color: "#f97316" }}
                  />
                </div>
                <div>
                  <h3 className="font-oswald text-white font-semibold text-xl mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {ind.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ind.tags.map((tag, j) => (
                      <span key={j} className="feature-tag text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { ref, visible } = useIntersection();

  const advantages = [
    { icon: "Factory", value: "СПб", label: "производство" },
    { icon: "Shield", value: "12 мес.", label: "гарантия" },
    { icon: "Clock", value: "2 мес.", label: "срок изготовления" },
    { icon: "Wrench", value: "100%", label: "российское" },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: "#050c1a" }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-8 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right top, #1a5ce8 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div className="feature-tag mb-4 inline-flex">
              <Icon name="Building2" size={11} />О компании
            </div>
            <h2
              className="font-oswald font-bold text-white section-title mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              ООО «МАЛАЯ МЕХАНИЗАЦИЯ»
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Петербургское предприятие, специализирующееся на разработке и
              производстве орбитального оборудования для резки и сварки труб.
              Проектируем, производим и обслуживаем технику собственными силами.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Серия САТУРН — результат многолетнего опыта работы с
              нефтегазовыми компаниями, атомной энергетикой и предприятиями ЖКХ.
              Каждая машина проходит контроль качества перед отправкой.
            </p>

            <div className="flex flex-col gap-3">
              {[
                "Проектирование и производство в Санкт-Петербурге",
                "Собственная техподдержка и сервисное обслуживание",
                "Персонализация ПО под требования заказчика",
                "Изготовление нестандартных поясов-бандажей под заказ",
                "Возможность поставки от единицы оборудования",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon
                    name="CheckCircle"
                    size={16}
                    style={{ color: "#3b82f6" }}
                  />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="grid grid-cols-2 gap-4 mb-8">
              {advantages.map((a, i) => (
                <div
                  key={i}
                  className="gradient-border rounded-xl p-6 text-center"
                  style={{ background: "rgba(10,22,40,0.8)" }}
                >
                  <Icon
                    name={a.icon as IName}
                    size={22}
                    className="mx-auto mb-3"
                    style={{ color: "#f97316" }}
                  />
                  <div className="font-oswald font-bold text-white text-2xl mb-1">
                    {a.value}
                  </div>
                  <div className="text-slate-500 text-xs">{a.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden gradient-border">
              <img
                src={MACHINE_IMAGE}
                alt="Производство оборудования САТУРН"
                className="w-full h-48 object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  const { ref, visible } = useIntersection();
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    industry: "",
    diameter: "",
    task: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const industries = [
    "Нефтегаз",
    "Атомная энергетика",
    "ЖКХ / Теплоснабжение",
    "Строительство",
    "Другое",
  ];

  return (
    <section
      id="contacts"
      ref={ref}
      className="py-24 relative"
      style={{ background: "linear-gradient(180deg, #070e1f 0%, #050c1a 100%)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a5ce8 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="feature-tag mb-4 inline-flex">
            <Icon name="MessageSquare" size={11} />
            Связаться с нами
          </div>
          <h2
            className="font-oswald font-bold text-white section-title mx-auto"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            ЗАЯВКА НА РАСЧЁТ
          </h2>
          <p className="text-slate-400 mt-6 max-w-xl mx-auto">
            Опишите вашу задачу — подберём оптимальную комплектацию и рассчитаем
            стоимость.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div
            className={`md:col-span-3 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {sent ? (
              <div
                className="gradient-border rounded-2xl p-12 text-center"
                style={{ background: "rgba(10,22,40,0.9)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <Icon
                    name="CheckCircle"
                    size={32}
                    style={{ color: "#3b82f6" }}
                  />
                </div>
                <h3 className="font-oswald text-white text-2xl font-bold mb-3">
                  Заявка отправлена!
                </h3>
                <p className="text-slate-400">
                  Мы свяжемся с вами в ближайшее время.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="gradient-border rounded-2xl p-8"
                style={{ background: "rgba(10,22,40,0.9)" }}
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                      Ваше имя *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                      style={{
                        background: "rgba(5,12,26,0.8)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        color: "#f0f6ff",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                      Компания
                    </label>
                    <input
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      placeholder="ООО «Трубопровод»"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{
                        background: "rgba(5,12,26,0.8)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        color: "#f0f6ff",
                      }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                      Телефон *
                    </label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+7 (___) ___-__-__"
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{
                        background: "rgba(5,12,26,0.8)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        color: "#f0f6ff",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                      Диаметр труб
                    </label>
                    <input
                      value={form.diameter}
                      onChange={(e) =>
                        setForm({ ...form, diameter: e.target.value })
                      }
                      placeholder="например: 530 мм"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{
                        background: "rgba(5,12,26,0.8)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        color: "#f0f6ff",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                    Отрасль
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{
                      background: "rgba(5,12,26,0.8)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      color: form.industry ? "#f0f6ff" : "#64748b",
                    }}
                  >
                    <option value="">Выберите отрасль</option>
                    {industries.map((ind) => (
                      <option
                        key={ind}
                        value={ind}
                        style={{ background: "#0a1628" }}
                      >
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2 block">
                    Описание задачи
                  </label>
                  <textarea
                    value={form.task}
                    onChange={(e) => setForm({ ...form, task: e.target.value })}
                    rows={4}
                    placeholder="Опишите объект, условия работы, объём..."
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                    style={{
                      background: "rgba(5,12,26,0.8)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      color: "#f0f6ff",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-lg text-white font-oswald font-semibold text-lg tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    boxShadow: "0 0 30px rgba(249,115,22,0.35)",
                  }}
                >
                  <Icon name="Send" size={18} />
                  Отправить заявку
                </button>

                <p className="text-slate-600 text-xs text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных
                  данных
                </p>
              </form>
            )}
          </div>

          <div
            className={`md:col-span-2 flex flex-col gap-5 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            {[
              {
                icon: "MapPin",
                label: "Адрес",
                value: "г. Санкт-Петербург",
                sub: "Производственное предприятие",
              },
              {
                icon: "Phone",
                label: "Телефон",
                value: "+7 (812) XXX-XX-XX",
                sub: "Пн–Пт, 9:00–18:00",
              },
              {
                icon: "Mail",
                label: "E-mail",
                value: "info@mala-mex.ru",
                sub: "Ответ в течение 24 часов",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="gradient-border rounded-xl p-5 flex items-start gap-4"
                style={{ background: "rgba(10,22,40,0.8)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(26,92,232,0.15)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <Icon
                    name={c.icon as IName}
                    size={18}
                    style={{ color: "#3b82f6" }}
                  />
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">
                    {c.label}
                  </div>
                  <div className="text-white font-semibold">{c.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{c.sub}</div>
                </div>
              </div>
            ))}

            <div
              className="gradient-border rounded-xl p-5"
              style={{ background: "rgba(10,22,40,0.8)" }}
            >
              <div className="orange-tag mb-4 inline-flex">
                <Icon name="Clock" size={11} />
                Сроки изготовления
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "При наличии на складе",
                    val: "Сразу",
                    cls: "text-green-400",
                  },
                  {
                    label: "Стандартный заказ",
                    val: "4–6 недель",
                    cls: "text-white",
                  },
                  {
                    label: "Под заказ (нестандарт)",
                    val: "до 2 месяцев",
                    cls: "text-orange-400",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-semibold ${row.cls}`}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="py-10 border-t"
      style={{ borderColor: "rgba(59,130,246,0.1)", background: "#040a16" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a5ce8, #3b82f6)",
            }}
          >
            <Icon name="CircleDot" size={14} className="text-white" />
          </div>
          <div>
            <span className="font-oswald text-white font-semibold text-sm tracking-wider">
              САТУРН
            </span>
            <span className="text-slate-600 text-xs ml-2">
              / ООО «Малая механизация»
            </span>
          </div>
        </div>
        <div className="text-slate-600 text-xs text-center">
          © 2024 ООО «Малая механизация» · г. Санкт-Петербург · Орбитальное
          оборудование для резки и сварки труб
        </div>
        <div className="flex gap-4">
          <a
            href="#products"
            className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
          >
            Продукция
          </a>
          <a
            href="#contacts"
            className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
          >
            Контакты
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = [
      "hero",
      "products",
      "belts",
      "technologies",
      "industries",
      "about",
      "contacts",
    ];
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#050c1a" }}>
      <Navbar activeSection={activeSection} />
      <HeroSection />
      <ProductsSection />
      <SpecsSection />
      <TechnologiesSection />
      <IndustriesSection />
      <AboutSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}