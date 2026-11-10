import test from 'node:test';
import assert from 'node:assert/strict';
import { CHEESES, CURATED_SETS } from '../data/cheeses';
import {
  addCheeseToCart,
  addCuratedSetToCart,
  analyzeTastingBoard,
  calculateCartTotals,
  calculatePortionPrice,
  calculateSetPricing,
  filterAndSortCheeses,
  formatPLN,
  normalizePolish,
  removeCartEntry,
  updateCartQuantity,
  validateCheckoutForm,
  validateContactForm,
  type CartRecord,
} from './shopLogic';

test('normalizePolish strips Polish and French diacritics reliably', () => {
  assert.equal(normalizePolish('Półtwardy Włochy Chèvre Comté'), 'poltwardy wlochy chevre comte');
  assert.equal(normalizePolish('  Świeży Żółty Łagodny  '), 'swiezy zolty lagodny');
});

test('formatPLN formats grosze into Polish currency with tabular spacing', () => {
  assert.equal(formatPLN(0), '0,00 zł');
  assert.equal(formatPLN(3490), '34,90 zł');
  assert.equal(formatPLN(18000), '180,00 zł');
  assert.equal(formatPLN(124590), '1 245,90 zł');
});

test('filterAndSortCheeses filters by category, country, milk, and Polish diacritic-free query', () => {
  const all = filterAndSortCheeses(CHEESES, {
    category: 'all',
    query: '',
    country: '',
    milk: '',
    sort: 'default',
  });
  assert.equal(all.length, 19);

  const softOnly = filterAndSortCheeses(CHEESES, {
    category: 'soft',
    query: '',
    country: '',
    milk: '',
    sort: 'default',
  });
  assert.equal(softOnly.length, 4);

  const polishQuery = filterAndSortCheeses(CHEESES, {
    category: 'all',
    query: 'wlochy',
    country: '',
    milk: '',
    sort: 'name-asc',
  });
  assert.equal(polishQuery.length, 4); // Gorgonzola Dolce, Mozzarella Fior di Latte, Parmigiano Reggiano, Pecorino Romano
  assert.equal(polishQuery[0].name, 'Gorgonzola Dolce');

  const sheepMilk = filterAndSortCheeses(CHEESES, {
    category: 'all',
    query: '',
    country: '',
    milk: 'owcze',
    sort: 'price-desc',
  });
  assert.ok(sheepMilk.length >= 4);
  assert.ok(sheepMilk[0].pricePer200g >= sheepMilk[sheepMilk.length - 1].pricePer200g);
});

test('cart state operations calculate portions, bundle discounts, and free cold-chain shipping threshold', () => {
  let cart: CartRecord[] = [];
  // Parmigiano (id 0) is 3690 per 200g -> 400g = 7380
  assert.equal(calculatePortionPrice(3690, 400), 7380);

  cart = addCheeseToCart(cart, 0, 400, 1);
  cart = addCheeseToCart(cart, 8, 200, 1); // Brie (id 8) = 2990

  let totals = calculateCartTotals(cart, CHEESES, CURATED_SETS);
  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotalGrosze, 7380 + 2990); // 10370 < 18000
  assert.equal(totals.hasFreeShipping, false);
  assert.equal(totals.shippingGrosze, 1990);
  assert.equal(totals.freeShippingRemainingGrosze, 18000 - 10370);

  // Add curated wine set -> pushes total over 180,00 zł threshold and rounds cleanly to 10 gr
  const wineSetPricing = calculateSetPricing(CURATED_SETS[0], CHEESES);
  assert.ok(wineSetPricing.discountedGrosze < wineSetPricing.regularGrosze);
  assert.equal(wineSetPricing.discountedGrosze % 10, 0);

  cart = addCuratedSetToCart(cart, 'set-wine', 1);
  totals = calculateCartTotals(cart, CHEESES, CURATED_SETS);
  assert.equal(totals.hasFreeShipping, true);
  assert.equal(totals.shippingGrosze, 0);
  assert.equal(totals.totalGrosze, totals.subtotalGrosze);

  // Decrement and remove
  cart = updateCartQuantity(cart, 'cheese:8:200', -1);
  assert.equal(cart.some((c) => c.key === 'cheese:8:200'), false);

  cart = removeCartEntry(cart, 'set-wine'); // non-matching key keeps existing
  assert.equal(cart.length, 2);
  cart = removeCartEntry(cart, 'set:set-wine');
  assert.equal(cart.length, 1);
});

test('analyzeTastingBoard sorts cheeses from mildest to boldest blue finish', () => {
  // Pass Roquefort (11 - blue), Edam (4 - mild semi), Parmigiano (0 - hard), Brie (8 - soft white)
  const result = analyzeTastingBoard([11, 4, 0, 8], CHEESES);
  assert.equal(result.orderedCheeses.length, 4);
  assert.equal(result.orderedCheeses[0].id, 4); // Edam first
  assert.equal(result.orderedCheeses[result.orderedCheeses.length - 1].id, 11); // Roquefort last
  assert.equal(result.distinctCategoriesCount, 3);
});

test('validateContactForm and validateCheckoutForm reject invalid inputs and pass valid ones', () => {
  const badContact = validateContactForm({
    name: 'A',
    email: 'invalid-email',
    topic: '',
    message: 'krótko',
    consent: false,
  });
  assert.equal(badContact.valid, false);
  assert.ok(badContact.errors.name);
  assert.ok(badContact.errors.email);
  assert.ok(badContact.errors.message);
  assert.ok(badContact.errors.consent);

  const okContact = validateContactForm({
    name: 'Jan Kowalski',
    email: 'jan@kowalski.pl',
    topic: 'Pytanie o sery',
    message: 'Dzień dobry, chciałbym zapytać o dostępność sera Comté.',
    consent: true,
  });
  assert.equal(okContact.valid, true);

  const badCheckout = validateCheckoutForm({
    fullName: '',
    email: 'zle',
    phone: '123',
    street: '',
    postalCode: '00000',
    city: '',
    deliveryMethod: 'kurier-chlodniczy',
    paymentMethod: 'przelew-online',
  });
  assert.equal(badCheckout.valid, false);
  assert.ok(badCheckout.errors.postalCode);

  const pickupCheckout = validateCheckoutForm({
    fullName: 'Marta Nowak',
    email: 'marta@nowak.pl',
    phone: '+48 600 700 800',
    street: '',
    postalCode: '',
    city: '',
    deliveryMethod: 'odbior-osobisty',
    paymentMethod: 'przelew-online',
  });
  assert.equal(pickupCheckout.valid, true);
});
