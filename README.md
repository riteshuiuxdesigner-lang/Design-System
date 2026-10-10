# Design System

Two websites, published on GitHub Pages:

- **Design system:** https://riteshuiuxdesigner-lang.github.io/Design-System/
- **Marketplace:** https://riteshuiuxdesigner-lang.github.io/Design-System/marketplace/

Every push to `main` rebuilds and republishes both sites (`.github/workflows/pages.yml`).

| Folder | What it is |
|---|---|
| [`design-system-website/`](design-system-website) | **The Marketplace Design System and its docs website**, in the style of atlassian.design. It covers foundations, all 772 tokens, accessibility, and 49 components with live examples, React/HTML/CSS you can copy, visual do/don'ts and changelogs. The design system itself (components, CSS, tokens, fonts) lives in `design-system-website/design-system/`. |
| [`marketplace-website/`](marketplace-website) | **Nudge**, a marketplace where designers sell assets, pitch for freelance gigs and get hired. It's built entirely on the design system. |

## Run them

You need Node 18+ and Python 3. Build the design-system website first, because the marketplace uses its output.

```bash
cd design-system-website && npm install && npm run build && npm start     # http://localhost:4747
cd ../marketplace-website && npm install && npm run build && npm start    # http://localhost:4848
```

## Icons

Both sites use **Hugeicons Pro**. The raw SVGs aren't committed. The built component bundle (`design-system-website/design-system/dist/bundle.js`) is committed with the icons already inside it, so builds work without them. To change the icon set, add the SVGs locally (see [`design-system-website/design-system/icons/`](design-system-website/design-system/icons)), run `npm run build` and commit the new `dist/`.

## Credits

- **Inter Display** by Rasmus Andersson is licensed under the SIL Open Font License 1.1.
- The marketplace portraits are free photos from [Unsplash](https://unsplash.com/license); see [`marketplace-website/src/people/CREDITS.md`](marketplace-website/src/people/CREDITS.md). People, prices and projects in the marketplace are fictional examples.
