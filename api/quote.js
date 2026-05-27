// Vercel Serverless Function: receives quote requests from the form
// and emails them via Resend. Falls back to logging if RESEND_API_KEY is not set.

const TO_EMAILS = ['ryan@localthreadsohio.com'];
const BCC_EMAIL = 'olivebranchgrowth@gmail.com';
const FROM_EMAIL = 'Local Threads Quote Form <quotes@localthreadsohio.com>';

function escape(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(d) {
  return `
    <p><strong>New quote request from the Local Threads website.</strong></p>
    <p><strong>Name:</strong> ${escape(d.name)}</p>
    <p><strong>Email:</strong> ${escape(d.email)}</p>
    <p><strong>Phone:</strong> ${escape(d.phone)}</p>
    <p><strong>Service:</strong> ${escape(d.service)}</p>
    <p><strong>Quantity:</strong> ${escape(d.quantity)}</p>
    <p><strong>Project details:</strong><br>${escape(d.projectDetails).replace(/\n/g, '<br>')}</p>
    <p><strong>Submitted:</strong> ${escape(d.submittedAt)}</p>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const data = req.body || {};
  console.log('[quote] new submission', JSON.stringify(data));

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured yet — just acknowledge and log
    res.status(200).json({
      ok: true,
      delivered: false,
      message: 'Quote received and logged (email delivery not yet configured)',
    });
    return;
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAILS,
        bcc: [BCC_EMAIL],
        reply_to: data.email,
        subject: `🕊️ New Quote Request from ${data.name || 'Local Threads Site'}`,
        html: buildEmailHtml(data),
      }),
    });
    if (!r.ok) {
      const text = await r.text();
      console.error('[quote] Resend error', r.status, text);
      res.status(502).json({ ok: false, error: 'Email service error' });
      return;
    }
    res.status(200).json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[quote] failure', err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
}
