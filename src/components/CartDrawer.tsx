import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { CHEESES, CURATED_SETS, FREE_SHIPPING_THRESHOLD_GROSZE } from '../data/cheeses';
import {
  calculateCartTotals,
  formatPLN,
  validateCheckoutForm,
  type CartRecord,
  type CheckoutFormInput,
} from '../utils/shopLogic';
import { CheeseImage } from './CheeseImage';
import type { RouteId } from './Navbar';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  records: CartRecord[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveEntry: (key: string) => void;
  onClearCart: () => void;
  onNavigate: (route: RouteId) => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  email: string;
  deliveryLabel: string;
  paymentLabel: string;
  totalGrosze: number;
  itemCount: number;
}

export function CartDrawer({
  open,
  onClose,
  records,
  onUpdateQty,
  onRemoveEntry,
  onClearCart,
  onNavigate,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormInput>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    deliveryMethod: 'kurier-chlodniczy',
    paymentMethod: 'przelew-online',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormInput, string>>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const totals = calculateCartTotals(
    records,
    CHEESES,
    CURATED_SETS,
    checkoutForm.deliveryMethod
  );

  useEffect(() => {
    if (!open) return;
    if (records.length > 0 && step === 'confirmed') {
      setStep('cart');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, records.length, step]);

  if (!open) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(checkoutForm);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const orderNum = `GC-${Math.floor(1000 + (totals.totalGrosze % 8900))}`;
    setConfirmedOrder({
      orderNumber: orderNum,
      customerName: checkoutForm.fullName.trim(),
      email: checkoutForm.email.trim(),
      deliveryLabel:
        checkoutForm.deliveryMethod === 'kurier-chlodniczy'
          ? `Kurier chłodniczy 2–6°C (${checkoutForm.postalCode} ${checkoutForm.city})`
          : 'Odbiór osobisty (Warszawa, ul. Mokotowska 48)',
      paymentLabel:
        checkoutForm.paymentMethod === 'przelew-online'
          ? 'Szybki przelew online / BLIK'
          : 'Płatność przy odbiorze (za pobraniem)',
      totalGrosze: totals.totalGrosze,
      itemCount: totals.itemCount,
    });
    onClearCart();
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="w-full max-w-md bg-[#FCFBFA] h-full flex flex-col border-l border-[#E5E1D8] shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E1D8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Wróć do listy produktów w koszyku"
                className="p-1.5 rounded-lg hover:bg-[#F3F1ED] text-[#171614] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <h2
              id="cart-drawer-title"
              className="font-serif text-xl font-semibold text-[#171614]"
            >
              {step === 'cart' && `Koszyk (${totals.itemCount})`}
              {step === 'checkout' && 'Dane dostawy chłodniczej'}
              {step === 'confirmed' && 'Potwierdzenie zamówienia'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij koszyk"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#E5E1D8] text-[#171614] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Free Cold-Shipping Progress Bar (when cart has items) */}
        {step !== 'confirmed' && totals.entries.length > 0 && (
          <div className="px-6 py-3 bg-[#F3F1ED] border-b border-[#E5E1D8]">
            <p className="text-xs text-[#171614] mb-1.5 tabular-nums">
              {totals.hasFreeShipping ? (
                <span>
                  Masz <strong>bezpłatną dostawę chłodniczą</strong> (próg{' '}
                  {formatPLN(FREE_SHIPPING_THRESHOLD_GROSZE)})
                </span>
              ) : (
                <span>
                  Brakuje{' '}
                  <strong className="font-mono font-semibold text-[#7A1F24]">
                    {formatPLN(totals.freeShippingRemainingGrosze)}
                  </strong>{' '}
                  do bezpłatnej paczki izotermicznej
                </span>
              )}
            </p>
            <div className="w-full h-1.5 bg-[#E5E1D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7A1F24] transition-transform duration-200 origin-left"
                style={{
                  transform: `scaleX(${totals.freeShippingProgressPercent / 100})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A1F24]">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>Zamówienie {confirmedOrder.orderNumber} przyjęte</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#171614]">
                Dziękujemy, {confirmedOrder.customerName}!
              </h3>
              <p className="text-sm text-[#5C5852] leading-relaxed">
                Twoje sery zostaną świeżo odkrojone z kręgu w dniu wysyłki i
                zapakowane w papier woskowany. Podsumowanie wysłaliśmy na adres{' '}
                <strong className="text-[#171614]">{confirmedOrder.email}</strong>.
              </p>

              <dl className="bg-[#F3F1ED] border border-[#E5E1D8] rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C5852]">Numer zamówienia</dt>
                  <dd className="font-mono tabular-nums font-semibold text-[#171614]">
                    {confirmedOrder.orderNumber}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C5852]">Liczba pozycji</dt>
                  <dd className="font-mono tabular-nums text-[#171614]">
                    {confirmedOrder.itemCount}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C5852]">Sposób dostawy</dt>
                  <dd className="text-right text-[#171614] font-medium">
                    {confirmedOrder.deliveryLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C5852]">Płatność</dt>
                  <dd className="text-right text-[#171614]">
                    {confirmedOrder.paymentLabel}
                  </dd>
                </div>
                <div className="pt-2 border-t border-[#E5E1D8] flex justify-between gap-2 text-sm font-semibold">
                  <dt className="text-[#171614]">Kwota zamówienia</dt>
                  <dd className="font-mono tabular-nums text-[#7A1F24]">
                    {formatPLN(confirmedOrder.totalGrosze)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer"
              >
                Wróć do sklepu
              </button>
            </div>
          ) : totals.entries.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-xl font-semibold text-[#171614] mb-2">
                Twój koszyk jest pusty
              </p>
              <p className="text-sm text-[#5C5852] mb-6">
                Wybierz pojedyncze kliny serów (200 g lub 400 g) albo gotową
                deskę degustacyjną w zakładce Sklep.
              </p>
              <button
                type="button"
                onClick={() => {
                  onNavigate('sklep');
                  onClose();
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Otwórz katalog serów
              </button>
            </div>
          ) : step === 'cart' ? (
            <ul className="divide-y divide-[#E5E1D8]">
              {totals.entries.map((entry) => (
                <li key={entry.key} className="py-4 first:pt-0 flex gap-3.5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E5E1D8] shrink-0">
                    <CheeseImage
                      mediaKey={entry.mediaKey}
                      alt={entry.title}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base font-semibold text-[#171614] leading-snug">
                        {entry.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveEntry(entry.key)}
                        aria-label={`Usuń z koszyka: ${entry.title}`}
                        className="text-[#78736B] hover:text-[#7A1F24] p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-[#5C5852] mb-2.5">
                      {entry.subtitle}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-[#E5E1D8] rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.key, -1)}
                          aria-label={`Zmniejsz ilość: ${entry.title}`}
                          className="p-1.5 text-[#171614] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums font-semibold text-[#171614]">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.key, 1)}
                          aria-label={`Zwiększ ilość: ${entry.title}`}
                          className="p-1.5 text-[#171614] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-semibold text-[#171614]">
                        {formatPLN(entry.lineTotalGrosze)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            /* Step 2: Checkout Form */
            <form id="checkout-form" noValidate onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#171614] mb-1.5">
                  Sposób dostawy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={checkoutForm.deliveryMethod === 'kurier-chlodniczy'}
                    onClick={() =>
                      setCheckoutForm({
                        ...checkoutForm,
                        deliveryMethod: 'kurier-chlodniczy',
                      })
                    }
                    className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                      checkoutForm.deliveryMethod === 'kurier-chlodniczy'
                        ? 'border-[#7A1F24] bg-[#F3F1ED] text-[#171614] font-semibold'
                        : 'border-[#E5E1D8] bg-white text-[#5C5852]'
                    }`}
                  >
                    <span className="block">Kurier chłodniczy</span>
                    <span className="font-mono tabular-nums text-[11px] text-[#78736B]">
                      2–6°C · {totals.subtotalGrosze >= FREE_SHIPPING_THRESHOLD_GROSZE ? '0,00 zł' : '19,90 zł'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={checkoutForm.deliveryMethod === 'odbior-osobisty'}
                    onClick={() =>
                      setCheckoutForm({
                        ...checkoutForm,
                        deliveryMethod: 'odbior-osobisty',
                      })
                    }
                    className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                      checkoutForm.deliveryMethod === 'odbior-osobisty'
                        ? 'border-[#7A1F24] bg-[#F3F1ED] text-[#171614] font-semibold'
                        : 'border-[#E5E1D8] bg-white text-[#5C5852]'
                    }`}
                  >
                    <span className="block">Odbiór w Warszawie</span>
                    <span className="font-mono tabular-nums text-[11px] text-[#78736B]">
                      Mokotowska 48 · 0,00 zł
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="co-name" className="block text-xs font-medium text-[#171614] mb-1">
                  Imię i nazwisko odbiorcy *
                </label>
                <input
                  id="co-name"
                  type="text"
                  value={checkoutForm.fullName}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, fullName: e.target.value })
                  }
                  placeholder="Jan Kowalski"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                />
                {errors.fullName && (
                  <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="co-email" className="block text-xs font-medium text-[#171614] mb-1">
                    E-mail *
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, email: e.target.value })
                    }
                    placeholder="jan@domena.pl"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                  />
                  {errors.email && (
                    <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="co-phone" className="block text-xs font-medium text-[#171614] mb-1">
                    Telefon dla kuriera *
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                    }
                    placeholder="600 700 800"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                  />
                  {errors.phone && (
                    <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {checkoutForm.deliveryMethod === 'kurier-chlodniczy' && (
                <>
                  <div>
                    <label htmlFor="co-street" className="block text-xs font-medium text-[#171614] mb-1">
                      Ulica i numer domu / lokalu *
                    </label>
                    <input
                      id="co-street"
                      type="text"
                      value={checkoutForm.street}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, street: e.target.value })
                      }
                      placeholder="ul. Ogrodowa 12/4"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                    />
                    {errors.street && (
                      <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="co-postal" className="block text-xs font-medium text-[#171614] mb-1">
                        Kod pocztowy *
                      </label>
                      <input
                        id="co-postal"
                        type="text"
                        value={checkoutForm.postalCode}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="00-543"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg font-mono tabular-nums focus:outline-none focus:border-[#7A1F24]"
                      />
                      {errors.postalCode && (
                        <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                    <div className="col-span-3">
                      <label htmlFor="co-city" className="block text-xs font-medium text-[#171614] mb-1">
                        Miejscowość *
                      </label>
                      <input
                        id="co-city"
                        type="text"
                        value={checkoutForm.city}
                        onChange={(e) =>
                          setCheckoutForm({ ...checkoutForm, city: e.target.value })
                        }
                        placeholder="Warszawa"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                      />
                      {errors.city && (
                        <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="co-payment" className="block text-xs font-medium text-[#171614] mb-1">
                  Metoda płatności
                </label>
                <select
                  id="co-payment"
                  value={checkoutForm.paymentMethod}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      paymentMethod: e.target.value as CheckoutFormInput['paymentMethod'],
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg focus:outline-none focus:border-[#7A1F24]"
                >
                  <option value="przelew-online">Szybki przelew online / BLIK</option>
                  <option value="pobranie">Płatność przy odbiorze (za pobraniem)</option>
                </select>
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals */}
        {step !== 'confirmed' && totals.entries.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-[#E5E1D8] space-y-3">
            <div className="space-y-1.5 text-xs text-[#5C5852]">
              <div className="flex justify-between">
                <span>Łączna waga serów</span>
                <span className="font-mono tabular-nums text-[#171614]">
                  {totals.totalWeightGrams} g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wartość produktów</span>
                <span className="font-mono tabular-nums text-[#171614]">
                  {formatPLN(totals.subtotalGrosze)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Opakowanie chłodnicze i dostawa</span>
                <span className="font-mono tabular-nums text-[#171614]">
                  {totals.shippingGrosze === 0
                    ? '0,00 zł (bezpłatnie)'
                    : formatPLN(totals.shippingGrosze)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E5E1D8] flex justify-between text-base font-semibold text-[#171614]">
                <span>Do zapłaty</span>
                <span className="font-mono tabular-nums text-[#7A1F24]">
                  {formatPLN(totals.totalGrosze)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-3.5 py-2.5 text-xs font-medium text-[#5C5852] hover:text-[#171614] border border-[#E5E1D8] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Wyczyść
                </button>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Przejdź do dostawy →
                </button>
              </div>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Zamawiam z dostawą ({formatPLN(totals.totalGrosze)})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
