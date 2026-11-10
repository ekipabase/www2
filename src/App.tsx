import { useCallback, useEffect, useState } from 'react';
import {
  CHEESES,
  CURATED_SETS,
  type CheeseCategoryId,
  type CheeseProduct,
  type CuratedSet,
  type PortionWeight,
} from './data/cheeses';
import {
  addCheeseToCart,
  addCuratedSetToCart,
  calculateCartTotals,
  removeCartEntry,
  updateCartQuantity,
  type CartRecord,
  type ShopFilters,
} from './utils/shopLogic';
import { AboutView } from './components/AboutView';
import { AssortmentView } from './components/AssortmentView';
import { CartDrawer } from './components/CartDrawer';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar, type RouteId } from './components/Navbar';
import { ShopView } from './components/ShopView';
import { TastingModal } from './components/TastingModal';

const VALID_ROUTES: RouteId[] = ['start', 'oferta', 'sklep', 'o-nas', 'kontakt'];

const ROUTE_TITLES: Record<RouteId, string> = {
  start: 'GOODcheese — Rzemieślnicze Sery z Europy',
  oferta: 'Asortyment i przewodnik | GOODcheese',
  sklep: 'Sklep internetowy | GOODcheese',
  'o-nas': 'O dojrzewalni | GOODcheese',
  kontakt: 'Kontakt i współpraca | GOODcheese',
};

const CART_STORAGE_KEY = 'goodcheese-cart-v1';

function readRouteFromHash(): RouteId {
  const raw = window.location.hash.replace(/^#/, '') as RouteId;
  return VALID_ROUTES.includes(raw) ? raw : 'start';
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<RouteId>(() =>
    typeof window !== 'undefined' ? readRouteFromHash() : 'start'
  );

  const [shopFilters, setShopFilters] = useState<ShopFilters>({
    category: 'all',
    query: '',
    country: '',
    milk: '',
    sort: 'default',
  });

  const [cartRecords, setCartRecords] = useState<CartRecord[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage access errors in restricted iframes
    }
    return [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [tastingCheese, setTastingCheese] = useState<CheeseProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartRecords));
    } catch {
      // Ignore storage write errors
    }
  }, [cartRecords]);

  useEffect(() => {
    const onHashChange = () => {
      const next = readRouteFromHash();
      setActiveRoute(next);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[activeRoute];
  }, [activeRoute]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const navigateTo = useCallback((route: RouteId) => {
    setActiveRoute(route);
    if (window.location.hash !== `#${route}`) {
      window.history.pushState(null, '', `#${route}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectShopCategory = useCallback(
    (category: CheeseCategoryId) => {
      setShopFilters((prev) => ({ ...prev, category }));
      navigateTo('sklep');
    },
    [navigateTo]
  );

  const handleAddCheese = useCallback(
    (cheese: CheeseProduct, portion: PortionWeight) => {
      setCartRecords((prev) => addCheeseToCart(prev, cheese.id, portion, 1));
      setToastMessage(`Dodano do koszyka: ${cheese.name} (${portion} g)`);
    },
    []
  );

  const handleAddSet = useCallback((set: CuratedSet) => {
    setCartRecords((prev) => addCuratedSetToCart(prev, set.id, 1));
    setToastMessage(`Dodano zestaw: ${set.title}`);
  }, []);

  const handleUpdateQty = useCallback((key: string, delta: number) => {
    setCartRecords((prev) => updateCartQuantity(prev, key, delta));
  }, []);

  const handleRemoveEntry = useCallback((key: string) => {
    setCartRecords((prev) => removeCartEntry(prev, key));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartRecords([]);
  }, []);

  const cartSummary = calculateCartTotals(cartRecords, CHEESES, CURATED_SETS);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBFA] text-[#171614]">
      <Navbar
        activeRoute={activeRoute}
        onNavigate={navigateTo}
        cartCount={cartSummary.itemCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="main-content" className="flex-1">
        {activeRoute === 'start' && (
          <HomeView
            onNavigate={navigateTo}
            onSelectCategory={handleSelectShopCategory}
            onOpenTasting={setTastingCheese}
            onAddToCart={handleAddCheese}
            onAddSetToCart={handleAddSet}
          />
        )}

        {activeRoute === 'oferta' && (
          <AssortmentView
            onOpenTasting={setTastingCheese}
            onAddToCart={handleAddCheese}
            onSelectShopCategory={handleSelectShopCategory}
          />
        )}

        {activeRoute === 'sklep' && (
          <ShopView
            filters={shopFilters}
            onChangeFilters={setShopFilters}
            onOpenTasting={setTastingCheese}
            onAddToCart={handleAddCheese}
          />
        )}

        {activeRoute === 'o-nas' && <AboutView onNavigate={navigateTo} />}

        {activeRoute === 'kontakt' && <ContactView onNavigate={navigateTo} />}
      </main>

      <Footer
        onNavigate={navigateTo}
        onSelectShopCategory={handleSelectShopCategory}
      />

      <TastingModal
        cheese={tastingCheese}
        onClose={() => setTastingCheese(null)}
        onAddToCart={handleAddCheese}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        records={cartRecords}
        onUpdateQty={handleUpdateQty}
        onRemoveEntry={handleRemoveEntry}
        onClearCart={handleClearCart}
        onNavigate={navigateTo}
      />

      {/* Non-blocking Cart Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm bg-[#171614] text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 text-xs sm:text-sm"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="font-semibold text-[#F3EFEA] underline underline-offset-2 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pokaż koszyk
          </button>
        </div>
      )}
    </div>
  );
}
