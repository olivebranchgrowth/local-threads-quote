// npm run test:lead
// Builds the quote form's lead with the SAME functions the form ships (src/utils/leadShape.js
// shapeLead + src/utils/emailService.js buildLeadPayload / sendQuoteRequest) and posts it to the
// LIVE obg-mail-api send_lead in canary mode (X-OBG-Canary), so every email goes to OBG's canary
// inbox and Local Threads is never touched. Exits non-zero unless the API answers 2xx with
// canary:true and ok not false. Then find the printed stamp in Gmail Sent (shop copy + customer copy).
// `npm run test:lead -- --broken` sends a lead with no email or phone, which the API must refuse,
// to show this test can fail.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { sendQuoteRequest, buildLeadPayload } from '../src/utils/emailService.js';
import { shapeLead } from '../src/utils/leadShape.js';

const env = Object.fromEntries(
  readFileSync(`${homedir()}/.config/obg-automation/keys.env`, 'utf8').split('\n')
    .map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
);
if (!env.OBG_CANARY_KEY) { console.error('FAIL OBG_CANARY_KEY missing from keys.env'); process.exit(2); }

const broken = process.argv.includes('--broken');
const stamp = `OBG CONTRACT TEST ${new Date().toISOString()}`;
// The tap-first path: a range tapped on step 1, items tapped on step 2, art skipped, phone
// left empty because it is optional now. That is the new path most worth proving.
const lead = shapeLead({
  qty: '24–49',
  items: ['T-shirts', 'Hi-vis & workwear'],
  notes: 'contract test, ignore. One color logo on the front.',
  name: stamp,
  email: broken ? '' : 'olivebranchgrowth+canary@gmail.com',
  phone: '',
});
const formData = { ...lead, artwork: 'None provided', attachments: [], client: 'Local Threads' };
console.log('payload', JSON.stringify(buildLeadPayload(formData)));

let body = null, status = 0, err = null;
try {
  body = await sendQuoteRequest(formData, { 'X-OBG-Canary': env.OBG_CANARY_KEY });
  status = 200;
} catch (e) { err = e; status = e.status || 0; body = e.body; }
console.log(JSON.stringify({ status, body, error: err ? String(err.message) : null }, null, 1));
if (!err && body?.canary !== true) { console.error('UNSAFE: 2xx without canary:true, mail may have gone to the shop'); process.exit(3); }
const pass = !err && body?.canary === true;
console.log(pass ? `PASS  find "${stamp}" in Sent (shop copy + customer copy)` : 'FAIL');
process.exit(pass ? 0 : 1);
