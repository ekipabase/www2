import { useState } from 'react';
import type { CheeseProduct, PortionWeight } from '../data/cheeses';
import { calculatePortionPrice, formatPLN } from '../utils/shopLogic';
import { CheeseImage } from './CheeseImage';

interface CheeseCardProps {
  cheese: CheeseProduct;
  onOpenTasting: (cheese: CheeseProduct) => void;
  onAddToCart: (cheese: CheeseProduct, portion: PortionWeight) => void;
}

export function CheeseCard({
  cheese,
  onOpenTasting,
  onAddToCart,
}: CheeseCardProps) {
  const [portion, setPortion] = useState<PortionWeight>(200);
  const currentPrice = calculatePortionPrice(cheese.pricePer200g, portion);

  return (
    <article className="group flex flex-col bg-white border border-[#E5E1D8] rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      {/* Product photography leading 65% of visual weight */}
      <button
        type="button"
        onClick={() => onOpenTasting(cheese)}
        aria-label={`Otwórz kartę degustacyjną: ${cheese.name}`}
        className="relative block w-full aspect-[4/3] text-left overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7A1F24]"
      >
        <CheeseImage
          mediaKey={cheese.mediaKey}
          alt={`${cheese.name} — ${cheese.country}, ${cheese.typeLabel}`}
          className="w-full h-full"
          imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-4 py-3 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs font-medium text-white">
            Karta degustacyjna →
          </span>
        </div>
      </button>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#5C5852] mb-1.5">
          <span>{cheese.country}</span>
          <span aria-hidden="true">·</span>
          <span>Mleko {cheese.milkFilter}</span>
          <span aria-hidden="true">·</span>
          <span>{cheese.aging}</span>
        </div>

        <h3 className="font-serif text-lg font-semibold text-[#171614] leading-snug mb-1.5">
          <button
            type="button"
            onClick={() => onOpenTasting(cheese)}
            className="text-left hover:text-[#7A1F24] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
          >
            {cheese.name}
          </button>
        </h3>

        <p className="text-sm text-[#5C5852] leading-relaxed line-clamp-2 mb-4 flex-1">
          {cheese.shortDesc}
        </p>

        {/* Functional Portion Selector + Price & Add CTA */}
        <div className="pt-3.5 border-t border-[#E5E1D8] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div
              role="group"
              aria-label={`Wybierz wagę porcji dla ${cheese.name}`}
              className="inline-flex items-center p-0.5 bg-[#F3F1ED] rounded-lg"
            >
              {([200, 400] as PortionWeight[]).map((weight) => {
                const active = portion === weight;
                return (
                  <button
                    key={weight}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPortion(weight)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      active
                        ? 'bg-white text-[#171614] shadow-xs'
                        : 'text-[#5C5852] hover:text-[#171614]'
                    }`}
                  >
                    {weight} g
                  </button>
                );
              })}
            </div>

            <div className="text-right">
              <span className="font-serif tabular-nums text-lg font-semibold text-[#171614] whitespace-nowrap">
                {formatPLN(currentPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddToCart(cheese, portion)}
              aria-label={`Dodaj do koszyka: ${cheese.name}, porcja ${portion} g`}
              className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
            >
              Do koszyka
            </button>
            <button
              type="button"
              onClick={() => onOpenTasting(cheese)}
              aria-label={`Profil smakowy: ${cheese.name}`}
              className="px-3 py-2 text-xs font-medium text-[#5C5852] hover:text-[#171614] border border-[#E5E1D8] hover:border-[#171614]/30 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Profil
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
