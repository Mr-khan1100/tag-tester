# AdTag Tester Pro

**Free online ad tag tester** for VAST, Native, Banner, Video, Audio and Interstitial creatives.

## Features

- ✅ Standard HTML banner tag testing
- ✅ VAST 2.0 / 3.0 XML tag testing (wrapper + inline)
- ✅ Native OpenRTB JSON ad testing
- ✅ Video ad tag testing (VAST + raw URL)
- ✅ Audio VAST ad testing
- ✅ Interstitial with device/resolution gating
- ✅ Real-time HTTP event log (tabular, no overlap)
- ✅ Device simulation: Desktop / Tablet / Mobile
- ✅ Screen rotation for mobile simulation
- ✅ AdMob sidebar (isolated from test area)
- ✅ Full SEO optimization (JSON-LD, Open Graph, sitemap, robots.txt)
- ✅ Modular component architecture (Next.js 14 App Router)

## Project Structure

```
adtag-tester/
├── app/
│   ├── layout.js        # Root layout + all SEO metadata + JSON-LD
│   ├── page.js          # Home page (server component, semantic H1)
│   ├── globals.css      # Design tokens + shared styles
│   └── sitemap.js       # /sitemap.xml route
├── components/
│   ├── TesterApp.js     # Client root, wraps provider + layout
│   ├── TesterContext.js # React context + useReducer state
│   ├── Header.js        # Logo + device selector
│   ├── TagInputPanel.js # Left sidebar: tag type tabs + textarea
│   ├── tagRunner.js     # Async tag execution engine
│   ├── DevicePreview.js # Device frame + rotate button
│   ├── AdDisplay.js     # Renders ad based on content type
│   ├── EventLog.js      # Tabular HTTP event log
│   └── AdMobSidebar.js  # Right panel AdMob slots
├── lib/
│   └── tagUtils.js      # Pure utils: VAST parser, native parser, fetch
├── public/
│   └── robots.txt
├── jsconfig.json        # @/ path aliases
├── next.config.mjs
└── package.json
```

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (Recommended — Free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → "New Project" → Import your repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Your site is live in ~60 seconds

**Before deploying**, update these in `app/layout.js`:
- `SITE_URL` → your actual domain (e.g. `https://adtagtester.pro`)
- `google` verification token in `metadata.verification`

## Deploy to Netlify

```bash
npm run build
# Then drag-and-drop the .next folder to Netlify, or use:
npx netlify-cli deploy --prod --dir=.next
```

## SEO Checklist

- [x] `<title>` and `<meta description>` optimized for "ad tag tester" keywords
- [x] JSON-LD SoftwareApplication structured data
- [x] JSON-LD FAQPage for featured snippets
- [x] Open Graph + Twitter Card tags
- [x] Canonical URL
- [x] `/sitemap.xml` auto-generated
- [x] `/robots.txt`
- [x] Semantic `<h1>` (visually hidden, crawler-visible)
- [x] Keyword-rich `<p>` content in page footer

## Adding Google Site Verification

Replace `'your-google-site-verification-token'` in `app/layout.js` with your actual token from Google Search Console.
