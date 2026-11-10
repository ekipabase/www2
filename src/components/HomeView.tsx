import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  CHEESES,
  CHEESE_CATEGORIES,
  CURATED_SETS,
  HERO_HOTSPOTS,
  SERVING_RITUALS,
  type CheeseCategoryId,
  type CheeseProduct,
  type CuratedSet,
  type PortionWeight,
} from '../data/cheeses';
import { calculateSetPricing, formatPLN } from '../utils/shopLogic';
import { CheeseCard } from './CheeseCard';
import { CheeseImage } from './CheeseImage';
import type { RouteId } from './Navbar';

interface HomeViewProps {
  onNavigate: (route: RouteId) => void;
  onSelectCategory: (category: CheeseCategoryId) => void;
  onOpenTasting: (cheese: CheeseProduct) => void;
  onAddToCart: (cheese: CheeseProduct, portion: PortionWeight) => void;
  onAddSetToCart: (set: CuratedSet) => void;
}

export function HomeView({
  onNavigate,
  onSelectCategory,
  onOpenTasting,
  onAddToCart,
  onAddSetToCart,
}: HomeViewProps) {
  const [hoveredPinId, setHoveredPinId] = useState<number>(0);

  const featuredCheeses = CHEESES.filter((c) => c.featured);
  const activeHotspotCheese =
    CHEESES.find((c) => c.id === hoveredPinId) ?? CHEESES[0];

  return (
    <div>
      {/* SECTION 1: Editorial Storefront Hero + Full-Width Provenance Strip */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-6">
            <div>
              <p className="text-sm font-medium text-[#7A1F24] mb-4">
                Europejska selekcja rzemieślnicza · ChNP i AOP
              </p>
              <h1
                className="font-serif font-semibold text-[#171614] leading-[1.08] mb-6 max-w-[18ch]"
                style={{ fontSize: 'clamp(2.35rem, 4vw, 3.75rem)' }}
              >
                Szlachetne sery prosto z dojrzewalni <em className="font-normal italic text-[#7A1F24]">starej Europy</em>
              </h1>
              <p className="text-base sm:text-lg text-[#5C5852] leading-relaxed max-w-[54ch] mb-8">
                Od dwuletniego Parmigiano Reggiano z Emilii-Romanii po kremowe
                Brie de Meaux i owcze Manchego. Każdą porcję odkrawamy ze
                świeżego kręgu w dniu wysyłki i pakujemy w oddychający papier
                serowarski.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 mb-10">
                <button
                  type="button"
                  onClick={() => onNavigate('sklep')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
                >
                  <span>Przejdź do sklepu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('oferta')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#171614] bg-white hover:bg-[#F3F1ED] border border-[#E5E1D8] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Przewodnik po 5 grupach</span>
                </button>
              </div>
            </div>

            {/* Quiet inline provenance summary */}
            <div className="pt-6 border-t border-[#E5E1D8] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C5852]">
              <span>Włochy</span>
              <span aria-hidden="true">·</span>
              <span>Francja</span>
              <span aria-hidden="true">·</span>
              <span>Szwajcaria</span>
              <span aria-hidden="true">·</span>
              <span>Hiszpania</span>
              <span aria-hidden="true">·</span>
              <span>Holandia</span>
              <span aria-hidden="true">·</span>
              <span>Grecja</span>
              <span aria-hidden="true">·</span>
              <span>Wielka Brytania</span>
              <span aria-hidden="true">·</span>
              <span>Cypr</span>
            </div>
          </div>

          {/* Right Interactive Board Stage */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[360px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-[#E5E1D8] bg-[#EFECE6]">
              <CheeseImage
                mediaKey="hero"
                alt="Rzemieślnicza deska serów: Parmigiano Reggiano, kremowe Brie de Meaux oraz owczy Roquefort na kamiennym łupku"
                className="w-full h-full lg:absolute lg:inset-0"
                imgClassName="lg:h-full object-cover"
              />
              {/* Measured contrast scrim at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Architectural Numbered Tasting Pins (Zero pulsing dots) */}
              {HERO_HOTSPOTS.map((spot) => {
                const cheese = CHEESES.find((c) => c.id === spot.cheeseId);
                if (!cheese) return null;
                const isSelected = hoveredPinId === cheese.id;
                return (
                  <button
                    key={spot.pinNumber}
                    type="button"
                    onMouseEnter={() => setHoveredPinId(cheese.id)}
                    onFocus={() => setHoveredPinId(cheese.id)}
                    onClick={() => onOpenTasting(cheese)}
                    aria-label={`Punkt ${spot.pinNumber} na desce: ${cheese.name}`}
                    style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-transform duration-150 cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isSelected
                        ? 'bg-[#7A1F24] text-white scale-105'
                        : 'bg-[#FCFBFA]/95 text-[#171614] hover:bg-white'
                    }`}
                  >
                    <span className="tabular-nums font-semibold">
                      {spot.pinNumber}
                    </span>
                    <span className="hidden sm:inline whitespace-nowrap">
                      {cheese.name}
                    </span>
                  </button>
                );
              })}

              {/* Interactive Caption Bar */}
              <div className="absolute inset-x-0 bottom-0 px-5 py-4 flex items-center justify-between gap-4 text-white">
                <div className="min-w-0">
                  <p className="text-xs text-white/80">
                    Na desce · kliknij numer, aby otworzyć kartę sera
                  </p>
                  <p className="font-serif text-base font-medium truncate">
                    {activeHotspotCheese.name} — {activeHotspotCheese.country} ({activeHotspotCheese.aging})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenTasting(activeHotspotCheese)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-white text-[#171614] hover:bg-[#F3F1ED] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Karta sera →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Provenance Strip below Hero Split */}
        <div className="mt-10 pt-8 border-t border-[#E5E1D8] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] tabular-nums mb-1">
              19 klasyków
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852]">
              Oryginalne sery z certyfikatami ChNP, DOP oraz AOP w stałej ofercie
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] tabular-nums mb-1">
              5 rodzin smaku
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852]">
              Od krystalicznych twardych kręgów po kremowe pleśniowe i sery na ruszt
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] tabular-nums mb-1">
              2°C – 6°C
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852]">
              Gwarantowany łańcuch chłodniczy z wkładami żelowymi do samych drzwi
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] tabular-nums mb-1">
              Od 180,00 zł
            </p>
            <p className="text-xs sm:text-sm text-[#5C5852]">
              Bezpłatna dostawa chłodnicza na terenie całej Polski dla zamówień online
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Pięć grup serowarskich + Polecane klasyki */}
      <section className="bg-[#F3F1ED] border-y border-[#E5E1D8] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-medium text-[#7A1F24] mb-2">
                Architektura smaku
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171614]">
                Pięć grup serowarskich
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#5C5852] max-w-[48ch]">
              Wybierz interesującą Cię grupę, aby od razu otworzyć przefiltrowany
              katalog w sklepie internetowym.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
            {CHEESE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                aria-label={`Filtruj sklep: ${cat.title}`}
                className="group flex flex-col text-left bg-white border border-[#E5E1D8] rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <CheeseImage
                    mediaKey={cat.mediaKey}
                    alt={cat.mediaAlt}
                    className="w-full h-full"
                    imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="tabular-nums text-xs text-[#7A1F24] font-semibold mb-1">
                    {cat.indexLabel}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-[#171614] mb-1.5 group-hover:text-[#7A1F24] transition-colors">
                    {cat.shortTitle}
                  </h3>
                  <p className="text-xs text-[#5C5852] leading-relaxed mb-4 flex-1">
                    {cat.lead}
                  </p>
                  <span className="text-xs font-semibold text-[#171614] group-hover:text-[#7A1F24] transition-colors">
                    Filtruj w sklepie →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Featured 4 Signature Cheeses */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pt-6 border-t border-[#E5E1D8]">
            <div>
              <p className="text-sm font-medium text-[#7A1F24] mb-1.5">
                Rekomendacje affineura
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614]">
                Cztery wizytówki naszej lady
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('sklep')}
              className="text-sm font-semibold text-[#171614] hover:text-[#7A1F24] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Zobacz wszystkie 19 serów →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCheeses.map((cheese) => (
              <CheeseCard
                key={cheese.id}
                cheese={cheese}
                onOpenTasting={onOpenTasting}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Gotowe deski degustacyjne (Curated Sets) */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-[#7A1F24] mb-2">
              Skomponowane zestawy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171614]">
              Gotowe deski serów na stół
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5852] max-w-[50ch]">
            Zbalansowane zestawy z rabatem dla koneserów — od kameralnego
            wieczoru z winem po rozgrzany ruszt. Kliknij nazwę sera w zestawie,
            aby poznać jego profil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {CURATED_SETS.map((set) => {
            const pricing = calculateSetPricing(set, CHEESES);
            return (
              <article
                key={set.id}
                className="flex flex-col bg-white border border-[#E5E1D8] rounded-xl overflow-hidden"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <CheeseImage
                    mediaKey={set.mediaKey}
                    alt={set.title}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-[#5C5852] mb-1.5">
                    {set.occasion} · Rabat zestawu -{set.discountPercent}%
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-[#171614] mb-2">
                    {set.title}
                  </h3>
                  <p className="text-sm text-[#5C5852] leading-relaxed mb-5">
                    {set.description}
                  </p>

                  {/* Included Cheeses list (clickable to preview Tasting Modal) */}
                  <div className="py-3.5 border-y border-[#E5E1D8] mb-4">
                    <p className="text-xs font-medium text-[#78736B] mb-2">
                      W składzie zestawu ({set.portionGrams} g każdego sera):
                    </p>
                    <ul className="space-y-1.5">
                      {pricing.cheeses.map((item, idx) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <button
                            type="button"
                            onClick={() => onOpenTasting(item)}
                            className="text-left font-medium text-[#171614] hover:text-[#7A1F24] transition-colors cursor-pointer"
                          >
                            <span className="tabular-nums text-xs text-[#78736B] mr-1.5">
                              0{idx + 1}.
                            </span>
                            {item.name}
                          </button>
                          <span className="text-xs text-[#5C5852] whitespace-nowrap">
                            {item.country}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs text-[#5C5852] leading-relaxed mb-5 flex-1">
                    {set.accompaniments}
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div>
                      <span className="block text-xs text-[#78736B] line-through tabular-nums">
                        {formatPLN(pricing.regularGrosze)}
                      </span>
                      <span className="font-serif tabular-nums text-xl font-semibold text-[#171614]">
                        {formatPLN(pricing.discountedGrosze)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddSetToCart(set)}
                      aria-label={`Dodaj zestaw do koszyka: ${set.title}`}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
                    >
                      Dodaj zestaw
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Rytuał serwowania i rzemiosło dojrzewania */}
      <section className="border-t border-[#E5E1D8] bg-white py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden border border-[#E5E1D8]">
                <CheeseImage
                  mediaKey="cellar"
                  alt="Kamienna piwnica dojrzewalnicza z dębowymi półkami pełnymi kręgów sera"
                  className="w-full h-full lg:absolute lg:inset-0"
                  imgClassName="lg:h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-medium text-[#7A1F24] mb-2">
                Sztuka degustacji w domu
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#171614] mb-4">
                Jak podawać i przechowywać szlachetne sery
              </h2>
              <p className="text-base text-[#5C5852] leading-relaxed max-w-[60ch] mb-8">
                Rzemieślniczy ser żyje i dojrzewa także po opuszczeniu piwnicy
                affineura. Cztery proste zasady sprawią, że każdy klin zachowa
                idealną wilgotność i rozwinie pełnię aromatów na stole.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-[#E5E1D8]">
                {SERVING_RITUALS.map((ritual) => (
                  <div key={ritual.step}>
                    <span className="tabular-nums text-xs font-semibold text-[#7A1F24] block mb-1">
                      {ritual.step}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#171614] mb-1.5">
                      {ritual.title}
                    </h3>
                    <p className="text-sm text-[#5C5852] leading-relaxed">
                      {ritual.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
