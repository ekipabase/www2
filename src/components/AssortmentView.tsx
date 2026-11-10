import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import {
  CHEESES,
  CHEESE_CATEGORIES,
  SEROWARSKI_GLOSSARY,
  type CheeseCategoryId,
  type CheeseProduct,
  type PortionWeight,
} from '../data/cheeses';
import { analyzeTastingBoard, formatPLN } from '../utils/shopLogic';
import { CheeseImage } from './CheeseImage';

interface AssortmentViewProps {
  onOpenTasting: (cheese: CheeseProduct) => void;
  onAddToCart: (cheese: CheeseProduct, portion: PortionWeight) => void;
  onSelectShopCategory: (category: CheeseCategoryId) => void;
}

export function AssortmentView({
  onOpenTasting,
  onAddToCart,
  onSelectShopCategory,
}: AssortmentViewProps) {
  // Interactive Tasting Board Composer seeded with 4 contrasting cheeses
  const [boardIds, setBoardIds] = useState<number[]>([8, 12, 1, 11]);

  const toggleBoardCheese = (id: number) => {
    setBoardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const boardAnalysis = analyzeTastingBoard(boardIds, CHEESES);
  const boardTotalGrosze = boardAnalysis.orderedCheeses.reduce(
    (sum, c) => sum + c.pricePer200g,
    0
  );

  const handleAddEntireBoard = () => {
    boardAnalysis.orderedCheeses.forEach((cheese) => {
      onAddToCart(cheese, 200);
    });
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E5E1D8]">
        <div>
          <p className="text-sm font-medium text-[#7A1F24] mb-2">
            Przewodnik sommelierski · 5 rodzin serowarskich
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#171614]">
            Asortyment i sztuka kompozycji
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#5C5852] max-w-[50ch]">
          Poznaj charakterystykę wszystkich pięciu grup serów z zagranicy, ułóż
          własną kolejność degustacji od najłagodniejszych nut po intensywny
          finał i kliknij dowolną pozycję, aby otworzyć jej kartę degustacyjną.
        </p>
      </div>

      {/* Interactive Sommelier Tasting Order Builder */}
      <section className="my-12 bg-[#F3F1ED] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-[#7A1F24] mb-1.5">
              Interaktywny planer deski serów
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] mb-3">
              Ułóż kolejność degustacji
            </h2>
            <p className="text-sm text-[#5C5852] leading-relaxed mb-5">
              Zaznacz dowolne sery z poniższych pięciu grup (przycisk „Na
              deskę”), a nasz planer automatycznie ułoży je od najdelikatniejszych
              do najbardziej wyrazistych, tak aby smaki nie zagłuszały się
              wzajemnie.
            </p>

            <div className="p-4 bg-white border border-[#E5E1D8] rounded-xl mb-5">
              <div className="flex items-center justify-between text-xs text-[#5C5852] mb-2 tabular-nums">
                <span>Wybrane sery: {boardAnalysis.orderedCheeses.length}</span>
                <span>Grupy: {boardAnalysis.distinctCategoriesCount}/5 · Kraje: {boardAnalysis.distinctCountriesCount}</span>
              </div>
              <p className="text-sm font-medium text-[#171614] leading-relaxed">
                {boardAnalysis.sommelierVerdict}
              </p>
            </div>

            {boardAnalysis.orderedCheeses.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-[#5C5852]">
                    Suma porcji ({boardAnalysis.orderedCheeses.length * 200} g):
                  </span>
                  <span className="font-mono tabular-nums text-lg font-semibold text-[#171614]">
                    {formatPLN(boardTotalGrosze)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddEntireBoard}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Dodaj całą deskę do koszyka
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {boardAnalysis.orderedCheeses.length === 0 ? (
              <div className="bg-white border border-[#E5E1D8] rounded-xl p-8 text-center">
                <p className="text-sm text-[#5C5852] mb-4">
                  Twoja deska degustacyjna jest pusta. Wybierz kilka serów z
                  listy poniżej lub przywróć klasyczny zestaw 4 serów.
                </p>
                <button
                  type="button"
                  onClick={() => setBoardIds([8, 12, 1, 11])}
                  className="px-4 py-2 text-xs font-semibold text-[#171614] border border-[#E5E1D8] hover:bg-[#F3F1ED] rounded-lg transition-colors cursor-pointer"
                >
                  Przywróć rekomendowaną czwórkę
                </button>
              </div>
            ) : (
              <ol className="space-y-3">
                {boardAnalysis.orderedCheeses.map((cheese, index) => {
                  const stageLabel =
                    index === 0
                      ? 'Otwarcie degustacji'
                      : index === boardAnalysis.orderedCheeses.length - 1 &&
                          boardAnalysis.orderedCheeses.length > 1
                        ? 'Wyrazisty finał'
                        : `Krok ${index + 1}`;
                  return (
                    <li
                      key={cheese.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E5E1D8] rounded-xl p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#7A1F24] font-medium mb-0.5">
                          <span className="font-mono tabular-nums font-semibold">
                            0{index + 1}.
                          </span>
                          <span>{stageLabel}</span>
                          <span aria-hidden="true" className="text-[#78736B]">·</span>
                          <span className="text-[#5C5852]">{cheese.country}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenTasting(cheese)}
                          className="font-serif text-base font-semibold text-[#171614] hover:text-[#7A1F24] transition-colors text-left cursor-pointer"
                        >
                          {cheese.name}
                        </button>
                        <p className="text-xs text-[#5C5852] mt-0.5 truncate">
                          Para: {cheese.pairing}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="font-mono tabular-nums text-xs font-medium text-[#171614]">
                          {formatPLN(cheese.pricePer200g)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleBoardCheese(cheese.id)}
                          aria-label={`Usuń z planu deski: ${cheese.name}`}
                          className="px-2.5 py-1 text-xs text-[#5C5852] hover:text-[#7A1F24] border border-[#E5E1D8] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Usuń
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </section>

      {/* 5 Cheese Groups Deep-Dive */}
      <div className="space-y-16">
        {CHEESE_CATEGORIES.map((group) => {
          const groupCheeses = CHEESES.filter((c) => c.category === group.id);
          return (
            <section
              key={group.id}
              className="pt-4 border-t border-[#E5E1D8] first:border-t-0 first:pt-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-center">
                <div className="lg:col-span-5">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden border border-[#E5E1D8]">
                    <CheeseImage
                      mediaKey={group.mediaKey}
                      alt={group.mediaAlt}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <span className="font-mono tabular-nums text-xs font-semibold text-[#7A1F24] block mb-1.5">
                    {group.indexLabel} Grupa serowarska
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] mb-3">
                    {group.title}
                  </h2>
                  <p className="text-base text-[#5C5852] leading-relaxed max-w-[58ch] mb-5">
                    {group.assortmentDesc}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectShopCategory(group.id)}
                    className="text-sm font-semibold text-[#171614] hover:text-[#7A1F24] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Otwórz tę grupę w sklepie ({groupCheeses.length} pozycje) →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupCheeses.map((cheese) => {
                  const onBoard = boardIds.includes(cheese.id);
                  return (
                    <article
                      key={cheese.id}
                      className="bg-white border border-[#E5E1D8] rounded-xl p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="text-xs text-[#5C5852] mb-1">
                              {cheese.country} · {cheese.region} · {cheese.designation}
                            </p>
                            <h3 className="font-serif text-xl font-semibold text-[#171614]">
                              <button
                                type="button"
                                onClick={() => onOpenTasting(cheese)}
                                className="text-left hover:text-[#7A1F24] transition-colors cursor-pointer"
                              >
                                {cheese.name}
                              </button>
                            </h3>
                          </div>
                          <span className="font-mono tabular-nums text-sm font-semibold text-[#171614] whitespace-nowrap">
                            {formatPLN(cheese.pricePer200g)} / 200 g
                          </span>
                        </div>

                        <p className="text-sm text-[#5C5852] leading-relaxed mb-4">
                          {cheese.shortDesc}
                        </p>

                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-3 border-y border-[#E5E1D8] mb-4">
                          <div>
                            <dt className="text-[#78736B]">Surowiec</dt>
                            <dd className="font-medium text-[#171614]">{cheese.milk}</dd>
                          </div>
                          <div>
                            <dt className="text-[#78736B]">Dojrzewanie</dt>
                            <dd className="font-medium text-[#171614]">{cheese.aging}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenTasting(cheese)}
                          className="text-xs font-semibold text-[#171614] hover:text-[#7A1F24] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Karta degustacyjna →
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-pressed={onBoard}
                            onClick={() => toggleBoardCheese(cheese.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              onBoard
                                ? 'bg-[#F3F1ED] border-[#7A1F24] text-[#7A1F24]'
                                : 'bg-white border-[#E5E1D8] text-[#5C5852] hover:text-[#171614]'
                            }`}
                          >
                            {onBoard ? (
                              <>
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Na desce</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Na deskę</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onAddToCart(cheese, 200)}
                            aria-label={`Dodaj 200 g do koszyka: ${cheese.name}`}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Do koszyka
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Serowarski Glossary */}
      <section className="mt-20 pt-14 border-t border-[#E5E1D8]">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#7A1F24] mb-1.5">
            Słownik pojęć
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614]">
            Jak czytać oznaczenia serowarskie
          </h2>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEROWARSKI_GLOSSARY.map((entry) => (
            <div
              key={entry.term}
              className="bg-white border border-[#E5E1D8] rounded-xl p-5"
            >
              <dt className="font-serif text-lg font-semibold text-[#171614] mb-2">
                {entry.term}
              </dt>
              <dd className="text-sm text-[#5C5852] leading-relaxed">
                {entry.definition}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
