# Icons (Hugeicons Pro, not committed)

Hugeicons Pro is a paid library, so the SVGs live only on your machine.

1. In the Hugeicons Pro Figma file, export each icon listed in `stroke/README.md` as **Stroke · Rounded, 24px SVG** into `stroke/`, named exactly as listed (e.g. `search-01.svg`).
2. Export the same names as **Twotone · Rounded** into `twotone/`.
3. Rebuild: `npm run build` in `design-system-website/`, then in `marketplace-website/`.

Black (`#0B0B0B`) and brand blue (`#3F75FF`) in the SVGs become `currentColor`, so icons take the text color.
