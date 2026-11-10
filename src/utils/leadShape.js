// 2026-11-10: tap-first quote form (the Sublime / 456 pattern, shipped there 11/9-11/10).
//
// Why: Ads Hub GA4 funnel, paid traffic on the two ad landing pages, 2026-10-27 to 11-09.
// 149 paid sessions saw the form, 55 started it (37%), 16 sent it. The old first screen
// asked people to type their name before anything else, then three more typing steps.
// Now the customer taps how many, taps what, can skip the art, and only types where to
// send it on the last step. Name and email are required, phone is optional (a call Brian
// can reverse in ContactSlide.jsx).
//
// App.jsx and scripts/lead-contract-test.mjs both build the lead with shapeLead(), so the
// contract test always sends exactly what the form ships.

export const QTY_OPTIONS = ['1–11', '12–23', '24–49', '50–99', '100–249', '250+'];

export const ITEM_OPTIONS = ['T-shirts', 'Hoodies & crewnecks', 'Hats', 'Polos & jackets', 'Hi-vis & workwear', 'Promo products'];

// Lowest count in the range. The shop email subject and the growth dashboard both read a
// single number ("New Lead - Name (24 pieces)"), so the number is the low end and the range
// the customer tapped rides at the top of the project text.
export const qtyLow = (range) => parseInt(String(range || '').replace(/[^\d].*$/, ''), 10) || 0;

// A representative count for the conversion value estimate (utils/leadValue.js).
const VALUE_QTY = { '1–11': 6, '12–23': 18, '24–49': 36, '50–99': 72, '100–249': 150, '250+': 300 };
export const qtyForValue = (range) => VALUE_QTY[range] || qtyLow(range);

// What Local Threads would most likely run, shown to the shop as a SUGGESTION.
// Shirts, hoodies and hi-vis screen print, hats and polos/jackets embroider, promo is promo.
export function suggestMethod(items = []) {
  const picks = [];
  const add = (m) => { if (!picks.includes(m)) picks.push(m); };
  items.forEach((it) => {
    if (it === 'T-shirts' || it === 'Hoodies & crewnecks' || it === 'Hi-vis & workwear') add('Screen Printing');
    else if (it === 'Hats' || it === 'Polos & jackets') add('Embroidery');
    else if (it === 'Promo products') add('Promotional Products');
  });
  return picks.length ? picks.join(' + ') : 'Not Sure Yet';
}

// The lead as App.jsx hands it to sendQuoteRequest.
export function shapeLead({ qty, items = [], notes = '', name, email, phone = '' }) {
  const what = items.length ? items.join(', ') : 'Not said';
  const lines = [`Quantity range: ${qty || 'not said'}`, `Making: ${what}`];
  if (notes) lines.push(notes);
  return {
    name,
    email,
    phone,
    quantity: String(qtyLow(qty)),
    quantityRange: qty,
    items: what,
    // decoration_method in the shop's lead email. Labeled so Candice knows the customer
    // did not pick it.
    service: `Suggested: ${suggestMethod(items)}`,
    projectDetails: lines.join('\n'),
  };
}
