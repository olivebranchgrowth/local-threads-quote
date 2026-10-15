/**
 * Matrix-derived conversion value for Local Threads quote-form leads.
 *
 * The form posts a lead value to the parent page so Google Ads bids on an estimate
 * built from Local Threads' OWN pricing instead of a flat number. Same method as the
 * Blue Cactus form, with Local Threads' rates.
 *
 * Source (local-threads-calculator/src/utils/fetchPricing.js, Candice's 2026-07-16 sheet):
 *   screen printing  qty tier x ink colors -> decoration $/pc, $25 screen fee per color
 *   embroidery       qty tier (base, up to 10K stitches) -> decoration $/pc, $50 setup
 *   garment          wholesale blank x 1.40 (flat 40% markup)
 *
 * value = qty * (decoration_per_piece + blank_cost * 1.40) + setup_fee
 *
 * The short form does NOT capture ink colors or garment, so we infer. Assume 2 ink
 * colors on a dark garment (the most common order) and read the garment out of the free-text project
 * description when it is recognisable. The result is an ESTIMATE for bidding. It is
 * never shown to the customer and never quoted.
 *
 * Promotional products have no matrix on Local Threads' sheet, so they get a flat
 * per-piece estimate and a low ceiling rather than a made-up decoration table.
 */

// Local Threads prices a blank at wholesale x 1.40, a flat 40% markup on every tier.
const GARMENT_MULTIPLIER = 1.4;

// [minQty, $/pc for 1..N colors (light shirt rows, 1 to 4 colors)]
const SP_MATRIX = [
  [24, [2.4, 2.75, 3.2, 3.65]],
  [100, [2.3, 2.6, 2.85, 3.1]],
  [200, [2.15, 2.3, 2.5, 2.45]],
  [500, [1.85, 1.95, 2.0, 2.1]],
  [2000, [1.65, 1.85, 1.75, 2.0]],
  [4000, [1.4, 1.5, 1.55, 1.65]],
];
const SP_FEE_PER_COLOR = 25;

// [minQty, $/pc] base embroidery, up to 10K stitches
const EMB_MATRIX = [
  [12, 10.0], [24, 8.0], [50, 7.75], [100, 7.5], [150, 7.0], [200, 6.5],
];
const EMB_SETUP_FEE = 50;

// no matrix on the sheet for promo, so a flat per-piece estimate
const PROMO_PER_PIECE = 6.0;

// Wholesale blank cost, taken from the curated garments in local-threads-calculator
// (PC54 tee 4.50, PC54LS 5.04, hoodies 15.50 to 26, polos 11.50 to 17, hats 3.39 to 9.39,
// jackets about 32). The 1.40 multiplier is applied on top.
// Note the `e?s?` tails, customers write "hoodies", "polos", "jackets". A bare \b
// after the singular fails on every plural and silently drops to the default.
const PL = 'e?s?\\b';
const BLANKS = [
  [new RegExp(`\\b(jacket|softshell|windbreaker|varsity|outerwear)${PL}`, 'i'), 32.0],
  [new RegExp(`\\b(hoodie|hooded|sweatshirt|crewneck|crew neck|fleece|pullover)${PL}`, 'i'), 18.0],
  [new RegExp(`\\b(polo|button.?down|button.?up|dress shirt|oxford)${PL}`, 'i'), 13.0],
  [new RegExp(`\\b(beanie|bag|tote|duffel|backpack|apron|towel)${PL}`, 'i'), 6.0],
  [new RegExp(`\\b(hat|cap|trucker|snapback|visor)${PL}`, 'i'), 5.0],
  [new RegExp(`\\b(long.?sleeve|longsleeve)${PL}`, 'i'), 5.5],
  [new RegExp(`\\b(tank|tee|t.?shirt|tshirt|shirt)${PL}`, 'i'), 4.5],
];
const DEFAULT_BLANK = { screenprint: 4.5, embroidery: 9.0 };

const DEFAULT_COLORS = 2;
// Assume a dark garment, which adds an underbase screen. The sheet's rows are named
// "N Color Light / N-1 Color Dark", so a 2 color dark job prices off the 3 color light row
// and burns 3 screens. It reproduces the calculator's own number for a 2 color PC54 job.
const UNDERBASE_SCREENS = 1;

// hard bounds so a typo in the quantity box can never poison Smart Bidding
const MIN_VALUE = 25;
const MAX_VALUE = 15000;
const MAX_QTY = 5000;

function tierFor(matrix, qty) {
  let row = matrix[0];
  for (const r of matrix) if (qty >= r[0]) row = r;
  return row;
}

export function blankCostFor(text, method) {
  const t = String(text || '');
  for (const [re, cost] of BLANKS) if (re.test(t)) return cost;
  return DEFAULT_BLANK[method] ?? 4.0;
}

/** normalise the form's service label into a matrix key */
export function methodKey(service) {
  const m = String(service || '').toLowerCase();
  if (m.includes('embroid')) return 'embroidery';
  if (m.includes('promo')) return 'promo';
  return 'screenprint'; // Screen Printing and Not Sure Yet, their larger share
}

/**
 * Estimated order value in USD, for use as the Google Ads conversion value.
 * @param {number|string} rawQty  quantity from the form
 * @param {string} service        the form's service label
 * @param {string} projectDetails free-text description, parsed for a garment
 * @returns {{value:number, breakdown:object}}
 */
export function leadValue(rawQty, service, projectDetails) {
  const qty = Math.min(Math.max(parseInt(rawQty, 10) || 0, 0), MAX_QTY);
  if (qty <= 0) return { value: MIN_VALUE, breakdown: { reason: 'no quantity' } };

  const method = methodKey(service);
  let raw;
  let breakdown;

  if (method === 'promo') {
    raw = qty * PROMO_PER_PIECE;
    breakdown = { qty, method, perPiece: PROMO_PER_PIECE };
  } else {
    const blank = blankCostFor(projectDetails, method);
    let decoration;
    let setup;
    if (method === 'embroidery') {
      decoration = tierFor(EMB_MATRIX, qty)[1];
      setup = EMB_SETUP_FEE;
    } else {
      decoration = tierFor(SP_MATRIX, qty)[1][DEFAULT_COLORS + UNDERBASE_SCREENS - 1];
      setup = SP_FEE_PER_COLOR * (DEFAULT_COLORS + UNDERBASE_SCREENS);
    }
    const perPiece = decoration + blank * GARMENT_MULTIPLIER;
    raw = perPiece * qty + setup;
    breakdown = {
      qty, method, blank, decoration, setup,
      multiplier: GARMENT_MULTIPLIER,
      perPiece: Math.round(perPiece * 100) / 100,
    };
  }

  const value = Math.round(Math.min(Math.max(raw, MIN_VALUE), MAX_VALUE));
  breakdown.raw = Math.round(raw);
  breakdown.capped = raw > MAX_VALUE;
  return { value, breakdown };
}

export default leadValue;
