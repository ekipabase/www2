import {
  COLD_SHIPPING_COST_GROSZE,
  FREE_SHIPPING_THRESHOLD_GROSZE,
  type CheeseCategoryId,
  type CheeseProduct,
  type CuratedSet,
  type PortionWeight,
} from '../data/cheeses';
import type { MediaKey } from '../data/media';

export type SortOption = 'default' | 'name-asc' | 'country-asc' | 'price-asc' | 'price-desc';

export interface ShopFilters {
  category: 'all' | CheeseCategoryId;
  query: string;
  country: string;
  milk: '' | 'krowie' | 'owcze' | 'kozie';
  sort: SortOption;
}

export interface CartRecord {
  key: string;
  kind: 'cheese' | 'set';
  cheeseId?: number;
  portionGrams?: PortionWeight;
  setId?: string;
  quantity: number;
}

export interface ResolvedCartEntry {
  key: string;
  kind: 'cheese' | 'set';
  title: string;
  subtitle: string;
  mediaKey: MediaKey;
  unitPriceGrosze: number;
  lineTotalGrosze: number;
  weightGrams: number;
  quantity: number;
}

export interface CartTotals {
  entries: ResolvedCartEntry[];
  itemCount: number;
  totalWeightGrams: number;
  subtotalGrosze: number;
  shippingGrosze: number;
  totalGrosze: number;
  freeShippingRemainingGrosze: number;
  freeShippingProgressPercent: number;
  hasFreeShipping: boolean;
}

export interface ContactFormInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  consent: boolean;
}

export interface CheckoutFormInput {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  deliveryMethod: 'kurier-chlodniczy' | 'odbior-osobisty';
  paymentMethod: 'przelew-online' | 'pobranie';
}

export function normalizePolish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function formatPLN(grosze: number): string {
  const safe = Math.max(0, Math.round(grosze));
  const zl = Math.floor(safe / 100);
  const gr = String(safe % 100).padStart(2, '0');
  const zlFormatted = zl.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${zlFormatted},${gr} zł`;
}

export function calculatePortionPrice(pricePer200g: number, portionGrams: PortionWeight): number {
  const multiplier = portionGrams === 400 ? 2 : 1;
  return pricePer200g * multiplier;
}

export function calculateSetPricing(
  set: CuratedSet,
  catalog: CheeseProduct[]
): {
  cheeses: CheeseProduct[];
  regularGrosze: number;
  discountedGrosze: number;
  savingsGrosze: number;
  totalGrams: number;
} {
  const cheeses = set.cheeseIds
    .map((id) => catalog.find((c) => c.id === id))
    .filter((c): c is CheeseProduct => Boolean(c));

  const regularGrosze = cheeses.reduce(
    (sum, item) => sum + calculatePortionPrice(item.pricePer200g, set.portionGrams),
    0
  );
  const rawDiscounted = (regularGrosze * (100 - set.discountPercent)) / 100;
  const discountedGrosze = Math.round(rawDiscounted / 10) * 10;
  const savingsGrosze = Math.max(0, regularGrosze - discountedGrosze);
  const totalGrams = cheeses.length * set.portionGrams;

  return {
    cheeses,
    regularGrosze,
    discountedGrosze,
    savingsGrosze,
    totalGrams,
  };
}

export function hasActiveFilters(filters: ShopFilters): boolean {
  return (
    filters.category !== 'all' ||
    filters.query.trim().length > 0 ||
    filters.country !== '' ||
    filters.milk !== ''
  );
}

export function filterAndSortCheeses(
  catalog: CheeseProduct[],
  filters: ShopFilters
): CheeseProduct[] {
  const normQuery = normalizePolish(filters.query);

  const filtered = catalog.filter((cheese) => {
    if (filters.category !== 'all' && cheese.category !== filters.category) {
      return false;
    }
    if (filters.country && cheese.country !== filters.country) {
      return false;
    }
    if (filters.milk && cheese.milkFilter !== filters.milk) {
      return false;
    }
    if (normQuery) {
      const searchable = normalizePolish(
        `${cheese.name} ${cheese.country} ${cheese.region} ${cheese.typeLabel} ${cheese.milk} ${cheese.shortDesc} ${cheese.tastingNotes} ${cheese.designation}`
      );
      if (!searchable.includes(normQuery)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    switch (filters.sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'pl');
      case 'country-asc':
        return (
          a.country.localeCompare(b.country, 'pl') || a.name.localeCompare(b.name, 'pl')
        );
      case 'price-asc':
        return a.pricePer200g - b.pricePer200g || a.id - b.id;
      case 'price-desc':
        return b.pricePer200g - a.pricePer200g || a.id - b.id;
      case 'default':
      default: {
        const curatedOrder = [0, 8, 1, 12, 11, 16, 5, 3, 9, 13, 2, 6, 10, 15, 17, 14, 4, 7, 18];
        const rankA = curatedOrder.indexOf(a.id);
        const rankB = curatedOrder.indexOf(b.id);
        return (rankA === -1 ? 99 : rankA) - (rankB === -1 ? 99 : rankB);
      }
    }
  });

  return sorted;
}

export function getUniqueCountries(catalog: CheeseProduct[]): string[] {
  const unique = Array.from(new Set(catalog.map((c) => c.country)));
  return unique.sort((a, b) => a.localeCompare(b, 'pl'));
}

export function addCheeseToCart(
  records: CartRecord[],
  cheeseId: number,
  portionGrams: PortionWeight = 200,
  addQty = 1
): CartRecord[] {
  if (addQty <= 0) return records;
  const key = `cheese:${cheeseId}:${portionGrams}`;
  const existingIndex = records.findIndex((r) => r.key === key);
  if (existingIndex === -1) {
    return [
      ...records,
      {
        key,
        kind: 'cheese',
        cheeseId,
        portionGrams,
        quantity: addQty,
      },
    ];
  }
  return records.map((r, idx) =>
    idx === existingIndex ? { ...r, quantity: r.quantity + addQty } : r
  );
}

export function addCuratedSetToCart(
  records: CartRecord[],
  setId: string,
  addQty = 1
): CartRecord[] {
  if (addQty <= 0) return records;
  const key = `set:${setId}`;
  const existingIndex = records.findIndex((r) => r.key === key);
  if (existingIndex === -1) {
    return [
      ...records,
      {
        key,
        kind: 'set',
        setId,
        quantity: addQty,
      },
    ];
  }
  return records.map((r, idx) =>
    idx === existingIndex ? { ...r, quantity: r.quantity + addQty } : r
  );
}

export function updateCartQuantity(
  records: CartRecord[],
  key: string,
  delta: number
): CartRecord[] {
  return records
    .map((r) => (r.key === key ? { ...r, quantity: r.quantity + delta } : r))
    .filter((r) => r.quantity > 0);
}

export function removeCartEntry(records: CartRecord[], key: string): CartRecord[] {
  return records.filter((r) => r.key !== key);
}

export function calculateCartTotals(
  records: CartRecord[],
  catalog: CheeseProduct[],
  sets: CuratedSet[],
  deliveryMethod: 'kurier-chlodniczy' | 'odbior-osobisty' = 'kurier-chlodniczy'
): CartTotals {
  const entries: ResolvedCartEntry[] = [];

  for (const record of records) {
    if (record.quantity <= 0) continue;

    if (record.kind === 'cheese' && record.cheeseId !== undefined) {
      const cheese = catalog.find((c) => c.id === record.cheeseId);
      if (!cheese) continue;
      const portion: PortionWeight = record.portionGrams === 400 ? 400 : 200;
      const unitPriceGrosze = calculatePortionPrice(cheese.pricePer200g, portion);
      entries.push({
        key: record.key,
        kind: 'cheese',
        title: cheese.name,
        subtitle: `${cheese.country} · Klin ${portion} g`,
        mediaKey: cheese.mediaKey,
        unitPriceGrosze,
        lineTotalGrosze: unitPriceGrosze * record.quantity,
        weightGrams: portion * record.quantity,
        quantity: record.quantity,
      });
    } else if (record.kind === 'set' && record.setId) {
      const foundSet = sets.find((s) => s.id === record.setId);
      if (!foundSet) continue;
      const pricing = calculateSetPricing(foundSet, catalog);
      entries.push({
        key: record.key,
        kind: 'set',
        title: foundSet.title,
        subtitle: `Zestaw ${pricing.cheeses.length} serów · ${pricing.totalGrams} g (-${foundSet.discountPercent}%)`,
        mediaKey: foundSet.mediaKey,
        unitPriceGrosze: pricing.discountedGrosze,
        lineTotalGrosze: pricing.discountedGrosze * record.quantity,
        weightGrams: pricing.totalGrams * record.quantity,
        quantity: record.quantity,
      });
    }
  }

  const itemCount = entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalWeightGrams = entries.reduce((sum, e) => sum + e.weightGrams, 0);
  const subtotalGrosze = entries.reduce((sum, e) => sum + e.lineTotalGrosze, 0);

  const hasFreeShipping =
    subtotalGrosze >= FREE_SHIPPING_THRESHOLD_GROSZE || deliveryMethod === 'odbior-osobisty';

  const shippingGrosze =
    subtotalGrosze === 0 || hasFreeShipping ? 0 : COLD_SHIPPING_COST_GROSZE;

  const freeShippingRemainingGrosze = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_GROSZE - subtotalGrosze
  );
  const freeShippingProgressPercent = Math.min(
    100,
    Math.round((subtotalGrosze / FREE_SHIPPING_THRESHOLD_GROSZE) * 100)
  );

  return {
    entries,
    itemCount,
    totalWeightGrams,
    subtotalGrosze,
    shippingGrosze,
    totalGrosze: subtotalGrosze + shippingGrosze,
    freeShippingRemainingGrosze,
    freeShippingProgressPercent,
    hasFreeShipping,
  };
}

function getCheeseIntensityRank(cheese: CheeseProduct): number {
  if (cheese.id === 18 || cheese.id === 4) return 1; // Mozzarella, Edam (mildest)
  if (cheese.category === 'semi') return 2;
  if (cheese.category === 'soft' && cheese.mediaKey === 'soft_white') return 3; // Brie, Camembert
  if (cheese.category === 'grill') return 3;
  if (cheese.category === 'sheep') return 4;
  if (cheese.category === 'hard') return 5;
  return 6; // Blue cheeses (Gorgonzola, Roquefort)
}

export function analyzeTastingBoard(
  selectedIds: number[],
  catalog: CheeseProduct[]
): {
  orderedCheeses: CheeseProduct[];
  distinctCategoriesCount: number;
  distinctCountriesCount: number;
  sommelierVerdict: string;
} {
  const uniqueIds = Array.from(new Set(selectedIds));
  const selected = uniqueIds
    .map((id) => catalog.find((c) => c.id === id))
    .filter((c): c is CheeseProduct => Boolean(c));

  const orderedCheeses = [...selected].sort(
    (a, b) => getCheeseIntensityRank(a) - getCheeseIntensityRank(b) || a.id - b.id
  );

  const distinctCategoriesCount = new Set(orderedCheeses.map((c) => c.category)).size;
  const distinctCountriesCount = new Set(orderedCheeses.map((c) => c.country)).size;

  let sommelierVerdict = 'Wybierz od 3 do 5 serów z różnych grup, aby ułożyć pełną kolejność degustacji.';
  if (orderedCheeses.length > 0 && orderedCheeses.length < 3) {
    sommelierVerdict = 'Dodaj jeszcze 1–2 sery o kontrastowej strukturze (np. twardy alpejski lub z białą pleśnią), aby zbudować pełny łuk smakowy.';
  } else if (orderedCheeses.length >= 3 && distinctCategoriesCount >= 3) {
    sommelierVerdict = 'Wzorcowa kompozycja sommelierska: zróżnicowane tekstury i harmonijne przejście od łagodnych nut mlecznych po wyrazisty finał.';
  } else if (orderedCheeses.length >= 3) {
    sommelierVerdict = 'Spójna deska tematyczna — rozważ przełamanie jej jednym serem pleśniowym lub owczym dla większego kontrastu na podniebieniu.';
  }

  return {
    orderedCheeses,
    distinctCategoriesCount,
    distinctCountriesCount,
    sommelierVerdict,
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_REGEX = /^\d{2}-\d{3}$/;
const PHONE_REGEX = /^[+\d\s()-]{9,16}$/;

export function validateContactForm(input: ContactFormInput): {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
} {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Podaj imię i nazwisko (minimum 2 znaki).';
  }
  if (!input.email || !EMAIL_REGEX.test(input.email.trim())) {
    errors.email = 'Podaj poprawny adres e-mail (np. anna@domena.pl).';
  }
  if (!input.topic || !input.topic.trim()) {
    errors.topic = 'Wybierz temat wiadomości.';
  }
  if (!input.message || input.message.trim().length < 10) {
    errors.message = 'Wpisz treść wiadomości (minimum 10 znaków).';
  }
  if (!input.consent) {
    errors.consent = 'Wymagana jest zgoda na kontakt zwrotny w sprawie zapytania.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCheckoutForm(input: CheckoutFormInput): {
  valid: boolean;
  errors: Partial<Record<keyof CheckoutFormInput, string>>;
} {
  const errors: Partial<Record<keyof CheckoutFormInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 3) {
    errors.fullName = 'Podaj imię i nazwisko odbiorcy.';
  }
  if (!input.email || !EMAIL_REGEX.test(input.email.trim())) {
    errors.email = 'Podaj poprawny adres e-mail do potwierdzenia.';
  }
  if (!input.phone || !PHONE_REGEX.test(input.phone.trim())) {
    errors.phone = 'Podaj 9-cyfrowy numer telefonu dla kuriera.';
  }

  if (input.deliveryMethod === 'kurier-chlodniczy') {
    if (!input.street || input.street.trim().length < 4) {
      errors.street = 'Podaj ulicę i numer domu / lokalu.';
    }
    if (!input.postalCode || !POSTAL_REGEX.test(input.postalCode.trim())) {
      errors.postalCode = 'Kod pocztowy w formacie 00-000.';
    }
    if (!input.city || input.city.trim().length < 2) {
      errors.city = 'Podaj miejscowość dostawy.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
