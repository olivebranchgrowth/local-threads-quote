// Quote submission goes to a Vercel Serverless Function at /api/quote.
// The function logs + (when configured) emails Candice/Ryan.
export const sendQuoteRequest = async (formData) => {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Quote submit failed (${res.status}): ${text}`);
  }
  return res.json();
};
