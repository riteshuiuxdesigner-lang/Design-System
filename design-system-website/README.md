# Marketplace Design System website

The design system and its documentation site.

- **Look:** playful in shape and motion, calm in color: pill controls, pure-grey neutrals, blue-600 primary (brand `#3f75ff`), pop "sticker" accents and spring motion.
- **Type and icons:** Inter Display for everything. Hugeicons Pro icons, Stroke by default and Twotone for highlights.
- **Figma library:** [Claude design system](https://www.figma.com/design/sc4yzKdTRekt8TLQZYPkAV/Claude-design-system).

```bash
npm install
npm run build   # → out/ (static site)
npm start       # http://localhost:4747
```

## What's inside

| Path | |
|---|---|
| `design-system/components.js` | 55 React components exported on `window.MarketplaceDS`. |
| `design-system/components.css` | Component styles. Every value is a token. |
| `design-system/tokens/build_tokens.py` | Token source of truth: Primitives → Semantic (Light/Dark) → Component tokens, plus Responsive. It validates contrast and writes `tokens.json`. |
| `design-system/tokens/code-tokens.json` | The short CSS names the components use (`--bg-surface`, `--radius-control`…). |
| `design-system/fonts/` | Inter Display 400/500/600/700 (OFL). |
| `design-system/icons/` | Where the Hugeicons Pro SVGs go. Not committed; the README there lists the 72 names. |
| `design-system/build_bundle.py` | Builds `design-system/dist/bundle.js` and `bundle.css`. `dist/` is committed with the icons already inlined, so builds work without the SVGs. |
| `gen_tokens.py` | Writes `out/tokens.css`: Light, Dark and system themes plus responsive values, under both Figma names and code names. |
| `src/` | The docs site: `src/docs/*.jsx` has one file per component; `src/pages/` has foundations, tokens, accessibility and patterns. |
| `DOCS_GUIDE.md` | How to write a component doc page. |

## Using the components in another project

Copy these into any page:
- `out/tokens.css`
- `out/bundle.css`
- `out/bundle.js`
- `out/fonts/`

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="bundle.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="bundle.js"></script>
<script>const { Button } = window.MarketplaceDS;</script>
```

To switch themes, set `data-theme="dark"` (or `"light"`) on `<html>`. Leave it unset to follow the OS.
