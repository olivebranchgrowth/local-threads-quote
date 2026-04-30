# Local Threads Quote Form

Multi-step quote request form for Local Threads (Columbus OH screen print, embroidery, promo).

## Stack
- Vite + React 19 + Tailwind v4 + Motion
- Vercel Serverless Function at `/api/quote` for submission
- Resend for email delivery (set `RESEND_API_KEY` in Vercel env)

## Local dev
```bash
npm install
npm run dev
```

## Deploy
```bash
vercel deploy --prod
```

## Embed
The form is iframe-friendly (CSP frame-ancestors `*`).

```html
<iframe src="https://YOUR-VERCEL-URL.vercel.app" width="100%" height="620" frameborder="0"></iframe>
```

## Env vars (Vercel)
| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key for email delivery (optional — without it, submissions are logged but not emailed) |

Submissions go to `candice@localthreadsohio.com` and `ryan@localthreadsohio.com`, BCC `olivebranchgrowth@gmail.com`.
