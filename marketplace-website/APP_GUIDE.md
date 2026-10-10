# Building pages for Nudge (the prototype)

Nudge is a playful marketplace for designers:
- buy and sell design assets (UI kits, icons, fonts, 3D, templates, illustrations, brand kits);
- freelancers pitch for gigs;
- clients post gigs and hire designers.

Style: **Dribbble + Contra.** Clean white surfaces, content first, designer-centric. Big rounded work thumbnails ("shots") with hover overlays. Contra-style talent cards and opportunity cards. Playfulness comes from colorful previews, pop-color accents (badges, avatars, small stickers on CTA cards), a yellow highlighter under one key phrase, and springy micro-interactions (heart pop, card lift). **No** dotted canvas backgrounds, Figma selection boxes, multiplayer cursors, nudgeable stickers, tilted flyers or tear-off tabs. Copy is warm and direct, and talks to designers like a designer would.

It must stay inside the **Marketplace Design System**:
- Inter Display only (inherited).
- Tokens only for every color, space, radius and shadow: `var(--…)` from `out/tokens.css` (copied from the design-system website build). **No hex values in CSS or JSX**, except preview art (art.js), which stands in for user-uploaded images.
- Pill controls.
- Pure-grey neutrals.
- Blue only for actions and focus. Never put a blue or tinted wash behind content.
- Hugeicons through `<Icon name>`: Stroke by default, `variant="twotone"` only on highlight stickers.

## Read first
- `src/pages/home.jsx`: the reference page. Match its quality, density, voice and playfulness.
- `src/ui/kit.jsx`: shared pieces. Reuse them:
  - `Section`, `AssetTile` (shot card), `AssetGrid`, `GigCard` (alias `GigFlyer`), `DesignerTile` (talent card), `Done`, `Crumbs`, `assetArt(a)`, `workOf(designerId)`, `compact(n)`, `cx`. Shared classes: `.tag`, `.avail`, `.pro`, `.cat` (Dribbble category tab), `.filterbar`.
- `src/store.jsx`: app state.
  - `useStore()` gives you:
    - `allAssets`, `allGigs`, `asset(id)`, `gig(id)`
    - `cart`, `addToCart(id, license)`, `removeFromCart`, `cartTotal()`, `checkout()`, `openCart()`, `owns(id)`, `purchases`
    - `saved`, `isSaved`, `toggleSave`, `following`, `isFollowing`, `toggleFollow`
    - `myAssets`, `publishAsset(assetObj)`, `myGigs`, `postGig(gigObj)`, `pitches`, `pitch({gigId, price, days, note, files})`, `pitchFor(gigId)`
    - `toast(message, {variant, actionLabel, onAction, duration})`, `celebrate()` (confetti), `notifications`, `theme`/`setTheme`
  - `go(page, param)` navigates.
  - Routes are hashes: `#page` or `#page.param`, for example `#asset.orbit` and `#gig.coffee-brand-pitch`.
- `src/data.js`: demo data.
  - `ME` is the signed-in user, Sam Rivera.
  - Other exports: `DESIGNERS`, `designer(id)`, `CATEGORIES`, `ASSETS`, `LICENSES`, `priceFor(asset, license)`, `money(n)`, `GIG_CATEGORIES`, `GIGS`, `budgetText(b)`, `REVIEWS`, `ACTIVITY`.
- `src/art.js`: `art(kind, color, seed, {word})` returns a data-URI preview image.
  - Kinds: `ui`, `mobile`, `icons`, `3d`, `type`, `poster`, `scene`, `brand`.
  - Colors: `yellow`, `lime`, `pink`, `orange`, `violet`, `ink`, `grey`, `blue`.
- `src/app.css`: global styles and class conventions. **Put your page's styles in `src/pages/<page>.css`.** The build appends every `src/pages/*.css` to `out/app.css` automatically. Don't edit `app.css`, and prefix your classes with your page name (`.shop-…`, `.gig-…`).
- DS components come from `src/ds.js` (also React hooks). Look up their real props in `design-system-website/design-system/components.js`.
- The docs for every component, with props and do/don'ts, live at `design-system-website/src/docs/<id>.jsx`. Follow those usage rules.

## Page module format
```jsx
import { Button, … , useState } from '../ds.js';
import { Section, … } from '../ui/kit.jsx';
import { useStore, go } from '../store.jsx';
function Shop({ param }) { … return <div className="page">…</div>; }
Shop.title = 'Shop';      // used in the browser tab
export default Shop;
```
`param` is the part after the dot in the hash, or null.

## Rules
- **Every flow really works in the prototype.** Buttons do something:
  - add to the store, navigate, show a toast, open a modal or drawer, or celebrate.
  - Validation shows real error messages that say how to fix the problem.
- Use realistic marketplace content in the voice of the home page. No lorem ipsum.
- **Responsive.**
  - Desktop ≥1024, tablet 640–1023, mobile <640 (a BottomNav is fixed at the bottom on mobile).
  - Nothing may cause horizontal page scroll at 375px.
  - Give text containers `min-width: 0`.
- **Light and Dark** both work, because you only use tokens.
- **Accessibility.**
  - Real buttons and links, and labels on IconButtons.
  - A logical heading order: one h1 per page.
  - Focus is visible.
- **Playful but calm.**
  - Use one "moment" per page: a sticker, a cursor, a celebration or a tilted card.
  - Use pop colors for stickers and small accents only, always with `--text-on-pop`.
  - Use generous whitespace.
- Use only icons that exist in `design-system-website/design-system/icons/stroke/` (72 names).
- **Don't edit files outside your assignment.** If you need a shared helper or a store action, add it inside your own page file. If you find a bug in shared code, tell me.
- **Verify** with `node marketplace-website/build.mjs --verify`. It must print `verify ok`; if another agent's file breaks it, retry a little later.
  - To look at it in a browser, build into your own folder with `node marketplace-website/build.mjs --dev --out <your-scratchpad-dir>`, then serve that folder on your own port and open `dev.html`. **Never** run the build into `out/` without `--out` (other agents share it), and never stop other servers.
