import { Search, RotateCcw } from 'lucide-react';
import {
  CHEESES,
  CHEESE_CATEGORIES,
  type CheeseCategoryId,
  type CheeseProduct,
  type PortionWeight,
} from '../data/cheeses';
import {
  filterAndSortCheeses,
  getUniqueCountries,
  hasActiveFilters,
  type ShopFilters,
  type SortOption,
} from '../utils/shopLogic';
import { CheeseCard } from './CheeseCard';

interface ShopViewProps {
  filters: ShopFilters;
  onChangeFilters: (next: ShopFilters) => void;
  onOpenTasting: (cheese: CheeseProduct) => void;
  onAddToCart: (cheese: CheeseProduct, portion: PortionWeight) => void;
}

const COUNTRIES = getUniqueCountries(CHEESES);

export function ShopView({
  filters,
  onChangeFilters,
  onOpenTasting,
  onAddToCart,
}: ShopViewProps) {
  const visibleCheeses = filterAndSortCheeses(CHEESES, filters);
  const activeFilterState = hasActiveFilters(filters);

  const handleCategoryChange = (category: 'all' | CheeseCategoryId) => {
    onChangeFilters({ ...filters, category });
  };

  const handleReset = () => {
    onChangeFilters({
      category: 'all',
      query: '',
      country: '',
      milk: '',
      sort: filters.sort,
    });
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E1D8]">
        <div>
          <p className="text-sm font-medium text-[#7A1F24] mb-2">
            Sklep internetowy · Świeże cięcie z kręgu
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#171614]">
            Katalog serów europejskich
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[#5C5852] max-w-[48ch]">
          Wybierz porcję 200 g lub 400 g. Wszystkie zamówienia wysyłamy w
          opakowaniach izotermicznych z wkładami chłodzącymi (darmowa dostawa od
          180,00 zł).
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="py-6 space-y-4 border-b border-[#E5E1D8] mb-8">
        {/* Segmented Category Filter Controls */}
        <div
          role="group"
          aria-label="Filtruj według grupy serów"
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F3F1ED] rounded-xl w-fit"
        >
          <button
            type="button"
            aria-pressed={filters.category === 'all'}
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              filters.category === 'all'
                ? 'bg-white text-[#171614] shadow-xs'
                : 'text-[#5C5852] hover:text-[#171614]'
            }`}
          >
            Wszystkie ({CHEESES.length})
          </button>
          {CHEESE_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#171614] shadow-xs'
                    : 'text-[#5C5852] hover:text-[#171614]'
                }`}
              >
                {cat.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Search + Country + Milk + Sort Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-5">
            <label
              htmlFor="shop-search"
              className="block text-xs font-medium text-[#5C5852] mb-1"
            >
              Szukaj sera, regionu lub nuty smakowej
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#78736B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="shop-search"
                type="search"
                value={filters.query}
                onChange={(e) =>
                  onChangeFilters({ ...filters, query: e.target.value })
                }
                placeholder="np. Comté, Włochy, orzechowy, DOP..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#171614] placeholder:text-[#78736B] focus:outline-none focus:border-[#7A1F24]"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="shop-country"
              className="block text-xs font-medium text-[#5C5852] mb-1"
            >
              Kraj pochodzenia
            </label>
            <select
              id="shop-country"
              value={filters.country}
              onChange={(e) =>
                onChangeFilters({ ...filters, country: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
            >
              <option value="">Wszystkie kraje</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="shop-milk"
              className="block text-xs font-medium text-[#5C5852] mb-1"
            >
              Rodzaj mleka
            </label>
            <select
              id="shop-milk"
              value={filters.milk}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  milk: e.target.value as ShopFilters['milk'],
                })
              }
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
            >
              <option value="">Każde mleko</option>
              <option value="krowie">Mleko krowie</option>
              <option value="owcze">Mleko owcze</option>
              <option value="kozie">Mleko kozie</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor="shop-sort"
              className="block text-xs font-medium text-[#5C5852] mb-1"
            >
              Sortowanie
            </label>
            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  sort: e.target.value as SortOption,
                })
              }
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
            >
              <option value="default">Rekomendowane</option>
              <option value="name-asc">Nazwa A–Z</option>
              <option value="country-asc">Kraj pochodzenia A–Z</option>
              <option value="price-asc">Cena: od najniższej</option>
              <option value="price-desc">Cena: od najwyższej</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p
            aria-live="polite"
            className="text-xs sm:text-sm text-[#5C5852] tabular-nums"
          >
            Pokazano <strong className="font-semibold text-[#171614]">{visibleCheeses.length}</strong> z {CHEESES.length} serów
          </p>

          {activeFilterState && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1F24] hover:text-[#5E161A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Wyczyść wszystkie filtry</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {visibleCheeses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleCheeses.map((cheese) => (
            <CheeseCard
              key={cheese.id}
              cheese={cheese}
              onOpenTasting={onOpenTasting}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#F3F1ED] border border-[#E5E1D8] rounded-2xl p-12 text-center max-w-xl mx-auto my-8">
          <h2 className="font-serif text-2xl font-semibold text-[#171614] mb-2">
            Brak serów spełniających kryteria
          </h2>
          <p className="text-sm text-[#5C5852] mb-6">
            Nie znaleźliśmy pozycji pasujących do wybranych filtrów. Zresetuj
            wyszukiwanie, aby zobaczyć pełną kolekcję 19 serów z Europy.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Pokaż wszystkie sery
          </button>
        </div>
      )}
    </div>
  );
}
