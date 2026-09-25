# Paatam.ai website

The public marketing website for **Paatam.ai**, a teacher-first learning intelligence platform that turns handwritten student assessments into actionable learning insights.

> Turning Assessments into Learning Intelligence.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) with React 19 and TypeScript
- Tailwind CSS v4, with design tokens in `src/app/globals.css`
- `next/font` for Fraunces (display), Figtree (text), Kalam (handwriting in the illustrative answer sheets) and Noto Sans Telugu
- No UI, icon or form libraries. Icons are a small inline SVG set in `src/components/ui/Icon.tsx`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the development server                  |
| `npm run build`     | Production build                              |
| `npm run start`     | Serve the production build                    |
| `npm run lint`      | ESLint (`eslint-config-next`)                 |
| `npm run typecheck` | Generate route types, then run `tsc --noEmit` |

## Configuration

All configuration is through environment variables. Nothing sensitive is hard-coded, and no contact detail is shown unless you configure it.

| Variable                    | Scope  | Purpose                                                                                                                             |
| --------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | public | Canonical origin for canonical links, sitemap, robots and social previews. Defaults to `http://localhost:3000`.                     |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Enquiry email shown in the contact section, footer and legal pages. Hidden when empty.                                              |
| `CONTACT_WEBHOOK_URL`       | server | Where enquiries are delivered. Each submission is POSTed as JSON. **Required for the form to send anything.**                       |
| `CONTACT_WEBHOOK_SECRET`    | server | Optional. Sent as `Authorization: Bearer <secret>` to the webhook.                                                                  |

The home page is statically prerendered, so changes to these variables take effect on the next build or deploy.

### Contact form delivery

`POST /api/contact` (`src/app/api/contact/route.ts`) validates each enquiry with the same rules as the browser (`src/lib/contact.ts`), then forwards it to `CONTACT_WEBHOOK_URL`:

```json
{
  "source": "paatam.ai website",
  "submittedAt": "2026-01-01T10:00:00.000Z",
  "name": "…",
  "contact": "email or phone",
  "school": "…",
  "role": "Principal / Head of school",
  "city": "…",
  "interest": "demo | pilot | other",
  "message": "…"
}
```

Any endpoint that accepts a JSON POST works, for example a CRM intake URL, an automation-tool webhook (Zapier, Make, n8n), a Google Apps Script web app, or your own backend.

- **Not configured:** the form shows a notice, and on submit it tells the visitor the enquiry was *not* sent. It never shows a false success.
- **Delivery fails:** the visitor sees an error and can retry.
- **Spam:** a hidden honeypot field plus best-effort in-memory rate limiting (5 requests per 10 minutes per IP, per server instance). Add platform-level protection (WAF or bot protection) in production.

The form collects only what's needed to follow up and asks visitors not to share student information.

## Project structure

```
src/
  app/
    layout.tsx            Fonts, global metadata (SEO, Open Graph, Twitter)
    page.tsx              Home page: section order + JSON-LD (Organization, FAQPage)
    api/contact/route.ts  Enquiry endpoint
    privacy/, terms/      Placeholder legal pages (see below)
    opengraph-image.tsx   Generated 1200×630 social image
    icon.svg, robots.ts, sitemap.ts, not-found.tsx
  components/
    Header.tsx, Footer.tsx, ContactForm.tsx, LegalPage.tsx
    sections/             One component per page section
    ui/                   Button, Section, Icon, Logo, StatusChip, RevealObserver
    visuals/AnswerSheet.tsx  Illustrative handwritten answer sheet (HTML, no images)
  config/site.ts          Site name, copy constants, nav, env-driven contact details
  lib/contact.ts          Shared form schema + validation
```

## Content and claims policy

- **All product examples are fictional** (student "Ananya Reddy", teacher "Ms. K. Lakshmi") and labelled as illustrative. The product UI is an HTML mock-up, not a screenshot of a deployed product.
- **Teacher-first:** the copy consistently presents AI output as a suggestion that a teacher reviews and approves. Keep new copy consistent with that.
- **Don't add** customer logos, testimonials, usage numbers, accuracy figures, language support, certifications or compliance claims unless they are verified.

## Still to do before launch

1. **Legal:** `/privacy` and `/terms` are placeholders that say the full policies are being prepared. Replace them with reviewed policy text. Both pages are `noindex` until then.
2. **Contact:** set `CONTACT_WEBHOOK_URL`, and optionally `NEXT_PUBLIC_CONTACT_EMAIL`.
3. **Domain:** set `NEXT_PUBLIC_SITE_URL` so canonical and social URLs are correct.
4. **Photography (optional):** the site uses no stock imagery. If you add real classroom photos, use images you have rights to and consent for, and never identifiable student work.
