# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository overview

- `directory-next/`: Primary Next.js 14 web app for generating telephone-book-style PDF directories from CSV uploads.
- `simple-script/`: Minimal Node.js script version that generates the same style of PDF from a local CSV file.
- `ipg directory mockup/`: Design assets (PNG/PSD) for the printed directory; not used at runtime.
- Root `README.md`: Older documentation for the original script version; current implementation lives primarily in `directory-next/` and `simple-script/`.

## Common commands

### Next.js app (`directory-next/`)

From the repo root:

```bash
cd directory-next

# Install dependencies
npm install

# Run dev server on http://localhost:3000
npm run dev

# Production build & serve
npm run build
npm run start

# Lint (Next.js + ESLint)
npm run lint
```

The same commands are used in Vercel (also encoded in `directory-next/vercel.json`).

### CLI generator (`simple-script/`)

From the repo root:

```bash
cd simple-script

# Install dependencies
npm install

# Generate output.pdf from phonebook.csv
node simple.js
```

Requirements for the CLI script:

- `phonebook.csv` in `simple-script/` with headers `leftText,middleText,rightText`.
- Fonts in `simple-script/fonts/` matching the names used in `simple-script/simple.js`.

### Tests

- There is currently **no automated test suite** configured for either the Next.js app or the Node scripts.
- If you introduce a test runner (e.g., Jest or Vitest), add the appropriate `npm test` (and per-file test) commands here.

## Environment configuration (Next.js app)

Create `directory-next/.env.local` for local development with at least:

```env
WEBSITE_URL=directory-generator.com        # used as the watermark text for free tier
NEXT_PUBLIC_APP_URL=http://localhost:3000  # base URL of the running app
```

For production (Vercel):

- In the Vercel project settings, add environment variables:
  - `WEBSITE_URL` → your production marketing domain (e.g. `1pg.directory`).
  - `NEXT_PUBLIC_APP_URL` → your production URL (initially the Vercel preview URL, then the custom domain).
- If `WEBSITE_URL` is not set in production, the backend defaults to `1pg.directory` for the watermark.

Additional env vars mentioned in the docs but **not yet wired into code** (for planned subscriptions):

- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `DATABASE_URL` — see `directory-next/PROFESSIONALIZATION_SUMMARY.md` before implementing.

## High-level architecture

### 1. Next.js frontend (`directory-next/pages/index.js`)

Single-page React UI responsible for CSV upload, validation, and invoking the PDF generator API:

- Manages local state for `file`, `downloadUrl`, `isLoading`, `error`, and `isPaid`.
- Validates uploads **on the client**:
  - Only accepts `.csv` files.
  - Enforces a 5MB size limit.
- Uses `FileReader` to convert the selected CSV into a base64 string, then calls `/api/generate-pdf` with JSON `{ fileBase64, isPaid }`.
- Handles responses:
  - On success, creates a blob URL from the PDF response and exposes it as a **Download** button and an embedded `<iframe>` preview.
  - On failure, surfaces error messages returned by the API or generic fallbacks.
- Renders inline documentation for CSV format (required headers, max rows, sample CSV) so UX and constraints stay in sync with the backend.
- Styling is done with Tailwind CSS (`styles/globals.css` + `tailwind.config.js`), applied globally via `_app.js`.

When extending the UI:

- Keep all user-facing CSV rules synchronized with backend constants in `pages/api/generate-pdf.js`.
- If you wire in real subscription logic, propagate an accurate `isPaid` value instead of the current local boolean.

### 2. Next.js document shell

- `directory-next/pages/_app.js`: Wraps all pages and imports global styles.
- `directory-next/pages/_document.js`: Custom HTML shell with SEO meta tags and favicon; good place for global `<head>` changes.

### 3. PDF-generation API (`directory-next/pages/api/generate-pdf.js`)

Core backend responsible for CSV validation and PDF creation:

- Accepts `POST` JSON payload `{ fileBase64, isPaid }`; other methods return `405`.
- Reconstructs the CSV as a `Buffer` and enforces:
  - `MAX_FILE_SIZE = 5MB`.
  - `MAX_ROWS = 204` (68 rows × 3 columns).
- Parses the CSV using `csv-parser` (`parseCSV` helper):
  - Requires columns `leftText`, `middleText`, `rightText`.
  - Trims each field and discards rows missing required columns.
  - Rejects if no valid data remains.
- Calls `createPDF(data, showWatermark, websiteUrl)` where:
  - `showWatermark = !isPaid`.
  - `websiteUrl = process.env.WEBSITE_URL || '1pg.directory'`.
- Writes the PDF to an in-memory buffer via `pdfkit` and responds with:
  - `Content-Type: application/pdf`.
  - `Content-Disposition: attachment; filename="directory.pdf"`.

`createPDF` encapsulates the layout logic:

- Registers fonts from `directory-next/fonts/`:
  - `Bell-Centennial-Std-Name---Number_6529.ttf` (labelled `CentName`).
  - `Bell-Centennial-Std-Address_6527.ttf` (labelled `CentAddress`).
  - `AvenirNext-Heavy.otf` for the title (labelled `Title`).
- Uses fixed page metrics (Letter-sized page in points) and margins; draws:
  - A stretched "DIRECTORY" title using custom character spacing.
  - Up to 204 entries in **three columns**, 68 rows per column.
  - Left, middle, and right text with leader dots filling the gap before the rightmost number where space allows (>10pt).
- When `showWatermark` is true, adds a centered `Generated by <websiteUrl>` footer near the bottom of the page.

Any changes to the visual layout (column widths, fonts, title, watermark placement) should be made here.

### 4. Supporting scripts and assets

- `directory-next/simple.js`: Node CLI script that reads `phonebook.csv` and generates `output.pdf` using the same fonts and 3-column layout as the API.
- `simple-script/simple.js`: A similar CLI script, kept as a standalone minimal example; it expects `phonebook.csv` next to the script and writes `output.pdf`.
- `directory-next/fonts/` and `simple-script/fonts/`: Font files used by both the API and CLI scripts; names are hard-coded in the scripts, so keep filenames in sync if you replace fonts.
- `directory-next/mockup.html` + `mockup.css` and `ipg directory mockup/`: Visual design and marketing mockups only; not part of the runtime path.

### 5. Deployment flow (Vercel)

The source of truth for deployment steps is in:

- `directory-next/README_DEPLOY.md`
- `directory-next/SETUP.md`
- `directory-next/QUICK_START.md`
- `directory-next/DEPLOYMENT_CHECKLIST.md`
- `directory-next/PROFESSIONALIZATION_SUMMARY.md`

Big-picture deployment model:

- The **Next.js app in `directory-next/`** is deployed as a standard Next.js project to Vercel.
- Vercel runs `npm install`, `npm run build`, and uses `npm run dev` for previews, as specified in `vercel.json`.
- Environment variables `WEBSITE_URL` and `NEXT_PUBLIC_APP_URL` control watermark text and app URLs in both local and production environments.
- The Stripe/subscription system is not yet implemented; roadmap and schema suggestions live in `PROFESSIONALIZATION_SUMMARY.md`. When implementing, connect the `isPaid` flag in `pages/index.js` and `pages/api/generate-pdf.js` to real subscription status instead of hardcoding.
