import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CheeseProduct, PortionWeight } from '../data/cheeses';
import { calculatePortionPrice, formatPLN } from '../utils/shopLogic';
import { CheeseImage } from './CheeseImage';

interface TastingModalProps {
  cheese: CheeseProduct | null;
  onClose: () => void;
  onAddToCart: (cheese: CheeseProduct, portion: PortionWeight) => void;
}

export function TastingModal({
  cheese,
  onClose,
  onAddToCart,
}: TastingModalProps) {
  const [portion, setPortion] = useState<PortionWeight>(200);

  useEffect(() => {
    if (!cheese) return;
    setPortion(200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cheese, onClose]);

  if (!cheese) return null;

  const price = calculatePortionPrice(cheese.pricePer200g, portion);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tasting-modal-title"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FCFBFA] border border-[#E5E1D8] rounded-2xl shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij kartę degustacyjną"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 border border-[#E5E1D8] text-[#171614] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 min-h-[240px] md:min-h-full">
            <CheeseImage
              mediaKey={cheese.mediaKey}
              alt={`${cheese.name} — ${cheese.country}`}
              className="w-full h-full"
            />
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs text-[#7A1F24] font-semibold mb-1.5">
                Karta degustacyjna · {cheese.country} ({cheese.region})
              </p>
              <h2
                id="tasting-modal-title"
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#171614] mb-2 pr-8"
              >
                {cheese.name}
              </h2>
              <p className="text-xs text-[#5C5852] mb-5">
                {cheese.typeLabel} · {cheese.milk} · Dojrzewanie: {cheese.aging} · {cheese.designation}
              </p>

              <div className="space-y-4 py-4 border-y border-[#E5E1D8] mb-6 text-sm">
                <div>
                  <h3 className="font-sans text-xs font-semibold text-[#171614] mb-1">
                    Nuty sensoryczne
                  </h3>
                  <p className="text-[#5C5852] leading-relaxed">
                    {cheese.tastingNotes}
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-xs font-semibold text-[#171614] mb-1">
                    Rekomendowane wino i dodatki
                  </h3>
                  <p className="text-[#5C5852] leading-relaxed">
                    {cheese.pairing}
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-xs font-semibold text-[#171614] mb-1">
                    Wskazówka affineura
                  </h3>
                  <p className="text-[#5C5852] leading-relaxed">
                    {cheese.servingTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-[#5C5852] mb-1">
                    Waga świeżo krojonego klina
                  </span>
                  <div
                    role="group"
                    aria-label="Wybór wagi porcji"
                    className="inline-flex items-center p-1 bg-[#F3F1ED] rounded-lg"
                  >
                    {([200, 400] as PortionWeight[]).map((w) => {
                      const active = portion === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setPortion(w)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer tabular-nums whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-white text-[#171614] shadow-xs'
                              : 'text-[#5C5852] hover:text-[#171614]'
                          }`}
                        >
                          {w} g
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs text-[#5C5852]">Cena porcji</span>
                  <span className="font-serif tabular-nums text-2xl font-semibold text-[#171614]">
                    {formatPLN(price)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(cheese, portion);
                  onClose();
                }}
                className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Dodaj porcję ({portion} g) do koszyka
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
