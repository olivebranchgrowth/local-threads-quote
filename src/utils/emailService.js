// Quote-request leads go to the central OBG mail service (obg-mail-api) send_lead endpoint.
// No client-side secrets: the Python function holds the OBG Gmail credential and sends both a
// customer auto-reply and an internal lead notification (To Candice, Cc Ryan) per shops/localthreads.json.
// scripts/lead-contract-test.mjs (npm run test:lead) imports both functions below, so the test
// always sends exactly what the form ships.
export const ENDPOINT = 'https://obg-mail-api.vercel.app/api/send_lead';

export const buildLeadPayload = (formData) => ({
  shop_id: 'localthreads',
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  project: formData.projectDetails,
  quantity: formData.quantity,
  decoration_method: formData.service,
  artwork: formData.artwork || 'None provided',
  attachments: formData.attachments || [],
  source:
    (typeof document !== 'undefined' && document.referrer) ||
    'Local Threads website',
});

// Resolves with the API's JSON body. Throws on any non-2xx, or on a body that says ok: false,
// so the caller can never mistake a refusal for a delivered lead.
export const sendQuoteRequest = async (formData, extraHeaders = {}) => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(buildLeadPayload(formData)),
  });

  let body = null;
  try { body = await res.json(); } catch { /* non-JSON error page */ }
  if (!res.ok || (body && body.ok === false)) {
    const err = new Error(`Quote submit failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
};
