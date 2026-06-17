// Quote-request leads go to the central OBG mail service (obg-mail-api) send_lead endpoint.
// No client-side secrets: the Python function holds the OBG Gmail credential and sends both a
// customer auto-reply and an internal lead notification (To Candice, Cc Ryan) per shops/localthreads.json.
const ENDPOINT = 'https://obg-mail-api.vercel.app/api/send_lead';

export const sendQuoteRequest = async (formData) => {
  const payload = {
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
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Quote submit failed (${res.status}): ${text}`);
  }
  return res.json();
};
