export default {
  id: 'carousel',
  name: 'Carousel',
  group: 'Media',
  order: 2,
  status: 'Beta',
  figma: '48:23',
  exports: ['Carousel'],
  summary: 'Shows the preview images of one asset, one at a time. The gallery has arrows and thumbnails for listing pages; the inline style has dots for cards and tight spaces.',

  examples: [
    {
      title: 'Gallery',
      desc: 'The default. Arrows sit on the preview and a row of thumbnails runs underneath, so people can jump straight to the screen they want. It wraps around at either end. For real previews, pass image and alt on each slide; here color fills the frame with a pop token as a placeholder.',
      ...ex(`
<div style={{ width: 480 }}>
  <Carousel
    slides={[
      { color: 'pop-violet', alt: 'Dashboard overview screen' },
      { color: 'pop-lime', alt: 'Analytics charts' },
      { color: 'pop-yellow', alt: 'Settings page' },
      { color: 'pop-pink', alt: 'Mobile layouts' },
      { color: 'pop-orange', alt: 'Component library' },
    ]}
  />
</div>`),
    },
    {
      title: 'Inline',
      desc: 'Set variant="inline" for small spaces. The arrows go away and dots under the preview show how many there are. The current dot stretches into a pill.',
      ...ex(`
<div style={{ width: 280 }}>
  <Carousel
    variant="inline"
    slides={[
      { color: 'pop-lime', alt: 'Icon pack overview' },
      { color: 'pop-yellow', alt: 'Icons on a dark background' },
      { color: 'pop-pink', alt: 'Icon sizes' },
      { color: 'pop-violet', alt: 'Icons in use' },
    ]}
  />
</div>`),
    },
    {
      title: 'On a listing page',
      desc: 'A realistic listing. The gallery leads on the left, and the title, creator, price and Buy button sit next to it.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'flex-start', width: 760, padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <div style={{ flex: '0 0 420px', minWidth: 0 }}>
    <Carousel
      slides={[
        { color: 'pop-violet', alt: 'Dashboard overview screen' },
        { color: 'pop-lime', alt: 'Analytics charts' },
        { color: 'pop-yellow', alt: 'Settings page' },
        { color: 'pop-pink', alt: 'Mobile layouts' },
      ]}
    />
  </div>
  <div style={{ display: 'grid', gap: 'var(--space-md)', alignContent: 'start' }}>
    <Badge variant="yellow">Bestseller</Badge>
    <h2 style={{ margin: 0, font: '700 28px/36px var(--font-display)', letterSpacing: '-0.56px', color: 'var(--text-primary)' }}>Neon dashboard UI kit</h2>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
      <Avatar size="xs" initials="MO" color="pop-violet" />
      Mira Okafor
    </div>
    <Rating value={4.8} count={128} />
    <Button size="lg" leadingIcon="shopping-bag-01">Buy for $49</Button>
  </div>
</div>`),
    },
    {
      title: 'In a card',
      desc: 'Inline fits inside a card in a browse grid, so people can flip through previews without opening the listing.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', width: 260, padding: 'var(--space-md)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <Carousel
    variant="inline"
    slides={[
      { color: 'pop-orange', alt: '3D shapes on a light background' },
      { color: 'pop-violet', alt: '3D shapes on a dark background' },
      { color: 'pop-lime', alt: 'Shapes in a hero section' },
    ]}
  />
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)' }}>
    <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>3D shapes pack</span>
    <PriceTag price="$29" />
  </div>
</div>`),
    },
  ],

  props: {
    Carousel: [
      ['slides', '{ image?: string; alt?: string; color?: string }[]', '[]', 'The previews, in order. image fills the 4:3 frame. color is a token name (such as “pop-violet”) used when there is no image.'],
      ['variant', "'gallery' | 'inline'", "'gallery'", 'Gallery shows arrows and thumbnails. Inline shows dots only.'],
      ['className', 'string', '', 'Extra class on the root.'],
    ],
  },

  usage: {
    when: [
      'To show the preview images of one asset on its listing page.',
      'To let people flip through a few previews inside a card without leaving the grid.',
    ],
    whenNot: [
      'For a single preview. Show the image on its own.',
      'To rotate unrelated promotions or listings. People miss what isn’t on screen. Show a grid.',
      'When every image matters, such as before-and-after or a comparison. Show them side by side.',
    ],
    anatomy: {
      render: <div style={{ width: 320 }}><Carousel slides={[{ color: 'pop-violet' }, { color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }]} /></div>,
      parts: [
        'Stage: 4:3 frame with radius-xl (24px). Shows the image, or a pop color with an image-01 icon as a placeholder.',
        'Arrows (gallery): small Secondary Icon Buttons on the left and right edges, labelled “Previous preview” and “Next preview”.',
        'Thumbnails (gallery): 72px wide, 4:3, radius-md, at 70% opacity. The current one is fully opaque with a 2px border-selected ring.',
        'Dots (inline): 8px circles in border-strong with an invisible hit area about 32px tall. The current dot stretches to 24px in bg-inverse with a spring.',
      ],
    },
    sections: [
      {
        title: 'Gallery or inline',
        body: 'Use the gallery where there is room, such as the listing page, at 400px wide or more. In cards and narrow columns, use inline. The arrows and thumbnails need space to stay tappable.',
        dos: [
          {
            do: <div style={{ width: 200 }}><Carousel variant="inline" slides={[{ color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-violet' }]} /></div>,
            doText: 'Use inline in a small card.',
            dont: <div style={{ width: 200 }}><Carousel slides={[{ color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-violet' }]} /></div>,
            dontText: 'Don’t squeeze the gallery into a card. The arrows cover the preview and the thumbnails run off the edge.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 240 }}><Carousel variant="inline" slides={[{ color: 'pop-violet' }, { color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-orange' }]} /></div>,
        doText: 'Show 3–8 of the best previews.',
        dont: <div style={{ width: 240 }}><Carousel variant="inline" slides={[{ color: 'pop-violet' }, { color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-orange' }, { color: 'pop-violet' }, { color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-orange' }, { color: 'pop-violet' }, { color: 'pop-lime' }, { color: 'pop-yellow' }, { color: 'pop-pink' }]} /></div>,
        dontText: 'Don’t upload every screen. Fourteen dots are too many to count and nobody reaches the end.',
      },
      {
        do: <div style={{ width: 240 }}><AssetCard title="Wireframe starter" creator="Sam Reyes" initials="SR" price="Free" thumbColor="pop-yellow" avatarColor="pop-orange" /></div>,
        doText: 'Show a single preview as a plain image.',
        dont: <div style={{ width: 240 }}><Carousel slides={[{ color: 'pop-yellow' }]} /></div>,
        dontText: 'Don’t use a Carousel for one image. The arrows and lone thumbnail suggest more that isn’t there.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><Carousel variant="inline" slides={[{ color: 'pop-violet' }, { color: 'pop-violet' }, { color: 'pop-violet' }]} /><span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Neon dashboard UI kit · $49</span></div>,
        doText: 'Keep one carousel to the previews of one asset.',
        dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><Carousel variant="inline" slides={[{ color: 'pop-violet' }, { color: 'pop-orange' }, { color: 'pop-lime' }]} /><span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Neon dashboard $49 · Fintech kit $39 · Wireframe starter Free</span></div>,
        dontText: 'Don’t rotate different listings through one carousel. The title and price no longer match the preview on screen.',
      },
    ],
    content: [
      'Lead with the strongest preview. Many people never go past the first one.',
      'Write alt text for each preview that says what it shows: “Dark mode settings page”.',
      'Use the same 4:3 export size for every preview so nothing jumps between slides.',
      'Don’t put text people must read only inside the images. Repeat it in the listing description.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves to the arrows (gallery), then each thumbnail or dot.'],
      ['Enter / Space', 'Shows the previous or next preview, or the one for the focused thumbnail or dot.'],
    ],
    notes: [
      'The root has aria-roledescription="carousel". The stage is aria-live="polite" and labelled “Preview 2 of 5”, so changes are announced.',
      'Arrows, thumbnails and dots are buttons with labels such as “Next preview” and “Show preview 3”.',
      'It never moves on its own, so there is nothing to pause.',
      'Dots look 8px but have an invisible hit area about 32px tall. That is still under 44px, so on touch screens prefer the gallery or let people swipe through the listing.',
      'Under prefers-reduced-motion, the current dot changes width without the spring.',
    ],
  },

  related: ['asset-card', 'icon'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Dots have a larger invisible hit area, about 32px tall.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Carousel in React and HTML/CSS, matching the Figma component (gallery with thumbnails, inline with dots).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Arrows became pill Icon Buttons, and the current dot became a stretching pill.' },
  ],
};
