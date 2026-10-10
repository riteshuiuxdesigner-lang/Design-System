# Writing a component doc for the Marketplace Design System site

The site works like atlassian.design. Each component page has four tabs:
- **Examples**: live demos with copyable React, HTML and CSS.
- **Code**: install, props, copyable source and CSS.
- **Usage**: when to use it, anatomy, visual do/don'ts, content and accessibility.
- **Changelog**.

Developers copy code from here. Designers learn the rules here. Write for both.

## Files you read first
- `design-system-website/src/docs/button.jsx`: **the reference doc. Match its structure, depth and voice exactly.**
- `design-system-website/design-system/components.js`: the real React source of every component, with its props. Document what the code actually does. Never invent props.
- `design-system-website/design-system/components.css`: the styles (class names and tokens).
- Icons: only names that exist in `design-system-website/design-system/icons/stroke/README.md` (72 names). Check before you use one.

## File format: `design-system-website/src/docs/<id>.jsx`
```jsx
export default {
  id: 'text-field',                // kebab-case, unique; it is the URL (#text-field)
  name: 'Text field',              // sentence case
  group: 'Inputs',                 // one of: Actions, Inputs, Selection, Data display, Feedback, Navigation, Overlays, Media, Layout
  order: 1,                        // position inside the group
  status: 'Stable',                // or 'Beta' for brand-new, less-proven components
  figma: '18:413',                 // Figma node id (given in your task); omit if none
  exports: ['TextField'],          // the window.MarketplaceDS exports this page documents
  summary: 'One or two plain sentences: what it is and the job it does.',
  examples: [ { title, desc, stage?, ...ex(`JSX`) }, ... ],   // 4–7 examples
  props: { TextField: [[name, type, default, description], ...] },
  usage: { when: [...], whenNot: [...], anatomy?: { render: <JSX/>, parts: [...] }, sections?: [{ title, body, dos? }], dos: [...], content: [...] },
  a11y: { keyboard: [[key, action], ...], notes: [...] },
  related: ['other-doc-id', ...],
  changelog: [ { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: '...' } ],
};
```

### Examples: `ex(\`...\`)`
- The text inside `ex(\`…\`)` is compiled at build time and **shown verbatim to developers as the React code**. It has to be clean, idiomatic and copy-paste ready.
- **Single expression form:** write JSX directly. It is wrapped in a fragment: ``ex(`<Button>Publish</Button>`)``.
- **Stateful form:** start with `function Example() { ... }` and use `useState`, `useEffect` and `useRef`. Every overlay (Modal, Drawer, CommandPalette, DropdownMenu, Popover) needs a real trigger plus state.
- **All MarketplaceDS components are in scope** by name: Button, Icon, TextField, … (see the `window.MarketplaceDS = {...}` export list at the bottom of components.js). Also in scope: `useState`, `useEffect`, `useRef` and `Fragment`.
- **Never use a backtick or `${` inside an example.** Use string concatenation instead.
- For layout, use plain `<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>`. Every color, space and radius in inline styles must be a token: `var(--text-muted)`, `var(--space-md)`, `font: '500 12px/16px var(--font-display)'`. Never use hex values.
- Use real marketplace content: UI kits, icon packs, Figma templates, creators like “Mira Okafor”, prices like “$49”, payouts, licenses. Never lorem ipsum, “Foo” or “Item 1”.
- **Example `stage` options:**
  - `'default'`: dotted surface.
  - `'muted'`: grey well.
  - `'plain'`: no dots.
  - `'flush'`: no padding. Use it for full-width things like TopNav, Table and Sidebar.
- **Order examples like the reference.** Start with the default or variants. Then cover sizes, states (error, disabled, loading), content variations and composition with other components. End with a realistic in-context example.
- Inline overlays: `Modal`, `Drawer` and `CommandPalette` accept `inline` (and need `open`), which renders the panel in place with no scrim. Use `inline` in Usage do/don'ts and anatomy. In Examples, show the real behavior with a trigger button.

### Usage tab: do/don'ts MUST be visual
The user was explicit about this. **Every do and every don't renders a real, live example of the right and the wrong way.** A sentence is never enough.
- `dos: [{ do: <JSX/>, doText: 'Do …', dont: <JSX/>, dontText: 'Don’t … because …' }]`.
- Build the "don't" by **misusing real components**: wrong variant, vague label, too much text, a missing label, two primaries, color as the only signal, a tinted background, an all-caps label, a truncated title, and so on. The two sides should differ only in the thing being taught, so the lesson is visible at a glance.
- Write 3–5 best-practice pairs per component, plus pairs inside `sections` where a topic needs its own explanation (hierarchy, placement, validation timing…).
- In usage JSX (not inside ex), you write normal JSX with the same components in scope. Keep each side small enough to fit a ~420px card: use fixed widths such as `style={{ width: 280 }}` when it helps.
- `anatomy.render` shows the component once, at a natural size. `parts` names each part with its token: “Container: pill (radius-control), bg-surface, 1px border-strong.”

### Voice (strict)
- Plain, direct and in sentence case. Write from the user's side. Use short sentences.
- Use active voice and lead with the verb on buttons. Errors say what went wrong and how to fix it.
- Don't use em-dashes as asides, “not X, but Y” framing, filler like “worth noting” or “seamless”, or emoji.
- Name tokens with code formatting in strings when useful, e.g. ‘bg-muted’. Strings are plain text; inside JSX you can use `<code className="ic">bg-muted</code>`.

### Props
`[name, type, default, description]`. Use TypeScript-ish types, quote string defaults (`"'md'"`), and leave the default `''` when there is none. Document every prop the source actually reads. Finish with `['...rest', 'HTMLAttributes', '', 'Any native attribute …']` only when the component spreads `rest`.

### Accessibility
List the keyboard behavior the code really implements, plus roles and aria attributes, contrast, touch target and reduced motion.

### Changelog
Every component gets at least `{ v: '1.0.0', date: '2026-10-10', type: 'Added', notes: '<Name> in React and HTML/CSS, matching the Figma component.' }`. Add 1–2 earlier entries only when they are true design-direction changes:
- 0.2.0, 2026-10-08: everything became pills, neutrals became pure grey, and Inter Display became the only typeface.
- 0.3.0, 2026-10-09: primary moved to blue-600, and icons moved to Hugeicons stroke.

## Verify
Run `node design-system-website/build.mjs --verify` after each file. It must print `verify ok`. It compiles every doc (yours and others'), so if it fails on someone else's file, re-run it a moment later. Never edit files outside your assigned docs. If a component has a real bug or a missing feature you need, don't change components.js. Report it in your final message.
