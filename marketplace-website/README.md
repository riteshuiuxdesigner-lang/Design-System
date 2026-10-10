# Nudge: the marketplace website

A clickable prototype of a playful marketplace for designers, built on the Marketplace Design System (`../design-system-website`).

- **Shop:** filters, sorting, a product page with three license prices, cart and checkout, and free downloads.
- **Gigs:** a board of open projects, a pitch form with validation, and a 4-step "Post a gig" flow.
- **Sell:** a 5-step upload flow (files, details, cover, pricing, review).
- **People:** designer profiles (Work, Shop, Services, Reviews, About), hire invites, and a seller dashboard with earnings, sales, pitches and payouts.
- **Throughout:** ⌘K search, Light/Dark themes, and a mobile bottom nav.

```bash
# build the design system first
cd ../design-system-website && npm install && npm run build
cd ../marketplace-website && npm install && npm run build && npm start   # http://localhost:4848
```

- **Saved progress:** everything you post, sell or pitch is saved in your browser (localStorage). Use "Reset demo" in the account menu to clear it.
- **Preview images:** the post images are drawn in code (`src/art.js`).
- **Portraits:** these are Unsplash photos (`src/people/CREDITS.md`). The names are fictional.
- **Code layout:** pages are in `src/pages/`, and shared pieces in `src/ui/kit.jsx` and `src/store.jsx`. `APP_GUIDE.md` describes the conventions.
