import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

export type RouteId = 'start' | 'oferta' | 'sklep' | 'o-nas' | 'kontakt';

interface NavbarProps {
  activeRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { id: RouteId; label: string }[] = [
  { id: 'start', label: 'Start' },
  { id: 'oferta', label: 'Asortyment' },
  { id: 'sklep', label: 'Sklep' },
  { id: 'o-nas', label: 'O nas' },
  { id: 'kontakt', label: 'Kontakt' },
];

export function Navbar({
  activeRoute,
  onNavigate,
  cartCount,
  onOpenCart,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (route: RouteId, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBFA]/95 backdrop-blur-md border-b border-[#E5E1D8]">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-8 px-5 sm:px-8 h-16">
        {/* Zone 1: Single wordmark element */}
        <a
          href="#start"
          onClick={(e) => handleLinkClick('start', e)}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#171614] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A1F24]"
        >
          GOODcheese
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="Nawigacja główna"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5852]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleLinkClick(item.id, e)}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A1F24] ${
                  isActive
                    ? 'text-[#171614] font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[1.5px] after:bg-[#7A1F24]'
                    : 'hover:text-[#171614]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (+ mobile menu toggle on small screens) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Otwórz koszyk, liczba produktów: ${cartCount}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F24]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Koszyk</span>
            <span className="tabular-nums text-xs opacity-90">
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileMenuOpen ? 'Zamknij menu nawigacji' : 'Otwórz menu nawigacji'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E1D8] text-[#171614] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Nawigacja mobilna"
          className="md:hidden border-t border-[#E5E1D8] bg-[#FCFBFA] px-5 py-4"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(item.id, e)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F3F1ED] text-[#7A1F24] font-semibold'
                        : 'text-[#171614] hover:bg-[#F3F1ED]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
