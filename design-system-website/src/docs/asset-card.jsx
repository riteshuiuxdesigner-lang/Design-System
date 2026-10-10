export default {
  id: 'asset-card',
  name: 'Asset card',
  group: 'Data display',
  order: 5,
  status: 'Stable',
  figma: '29:210',
  exports: ['AssetCard', 'AssetCardSkeleton'],
  summary: 'The listing card for browse grids: a 4:3 thumbnail, the title, the creator and the price, with Save on hover. The work leads and everything else stays small.',

  examples: [
    {
      title: 'Default',
      desc: 'The card fills the width of its grid column, and a long title truncates with an ellipsis. The thumbnail is 4:3 with radius-xl. Use image for a real preview, or thumbColor for a pop-color placeholder while there is none.',
      ...ex(`
<div style={{ width: 260 }}>
  <AssetCard
    title="Orbit UI kit"
    creator="Mira Okafor"
    initials="MO"
    avatarColor="pop-orange"
    price="$49"
    thumbColor="pop-violet"
  />
</div>`),
    },
    {
      title: 'Sticker and sale',
      desc: 'Add one sticker with badge and badgeVariant. It sits in the top-left corner, tilted by -4°. Pass was to show a sale price.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
  <div style={{ width: 220 }}>
    <AssetCard title="Mono icon pack" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" badge="Bestseller" badgeVariant="lime" thumbColor="pop-yellow" />
  </div>
  <div style={{ width: 220 }}>
    <AssetCard title="Pitch deck template" creator="Aiko Tanaka" initials="AT" avatarColor="pop-lime" price="$29" was="$49" badge="Sale" badgeVariant="orange" thumbColor="pop-pink" />
  </div>
</div>`),
    },
    {
      title: 'Free',
      desc: 'Pass price="Free" and the price tag turns pop-lime, so free listings stand out in a grid.',
      ...ex(`
<div style={{ width: 240 }}>
  <AssetCard title="Starter wireframe kit" creator="Leo Martins" initials="LM" avatarColor="pop-pink" price="Free" thumbColor="pop-lime" />
</div>`),
    },
    {
      title: 'Saving',
      desc: 'Save appears on hover and keyboard focus, and stays visible once selected. Pass saved and onSave to control it, for example to sync with the buyer’s collection.',
      ...ex(`function Example() {
  const [saved, setSaved] = useState(true);
  return (
    <div style={{ width: 260 }}>
      <AssetCard
        title="Orbit UI kit"
        creator="Mira Okafor"
        initials="MO"
        avatarColor="pop-orange"
        price="$49"
        thumbColor="pop-violet"
        saved={saved}
        onSave={setSaved}
      />
    </div>
  );
}`),
    },
    {
      title: 'Responsive grid',
      desc: 'Lay cards out in a CSS grid. Asset grids run 4 columns on desktop, 3 on tablet and 2 on mobile; auto-fill with a minimum column width gets you there without breakpoints.',
      ...ex(`
<div style={{ width: 880, maxWidth: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-xl) var(--space-lg)' }}>
  <AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" badge="New" thumbColor="pop-violet" />
  <AssetCard title="Mono icon pack" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" thumbColor="pop-yellow" />
  <AssetCard title="Pitch deck template" creator="Aiko Tanaka" initials="AT" avatarColor="pop-lime" price="$29" was="$49" thumbColor="pop-pink" />
  <AssetCard title="Starter wireframes" creator="Leo Martins" initials="LM" avatarColor="pop-pink" price="Free" thumbColor="pop-lime" />
  <AssetCard title="Dashboard kit" creator="Priya Raman" initials="PR" avatarColor="pop-violet" price="$69" thumbColor="pop-orange" />
  <AssetCard title="3D shapes" creator="Sam Rivera" initials="SR" avatarColor="pop-yellow" price="$24" badge="Staff pick" badgeVariant="pink" thumbColor="pop-violet" />
  <AssetCard title="Brand guidelines" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$39" thumbColor="pop-lime" />
  <AssetCard title="Mobile app kit" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$59" thumbColor="pop-pink" />
</div>`),
    },
    {
      title: 'Linking to the listing',
      desc: 'Pass href and the title becomes a link that covers the whole card, so a click anywhere opens the listing. Save stays a separate button on top. Use onOpen instead to open a quick view without leaving the page.',
      ...ex(`function Example() {
  const [opened, setOpened] = useState('');
  const listings = [
    { title: 'Orbit UI kit', creator: 'Mira Okafor', initials: 'MO', avatarColor: 'pop-orange', price: '$49', thumbColor: 'pop-violet' },
    { title: 'Mono icon pack', creator: 'Jonas Weber', initials: 'JW', avatarColor: 'pop-yellow', price: '$19', thumbColor: 'pop-yellow' },
    { title: 'Pitch deck template', creator: 'Aiko Tanaka', initials: 'AT', avatarColor: 'pop-lime', price: '$29', thumbColor: 'pop-pink' },
  ];
  return (
    <div style={{ width: 720, maxWidth: '100%', display: 'grid', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-xl) var(--space-lg)' }}>
        {listings.map((l) => (
          <AssetCard key={l.title} {...l} onOpen={() => setOpened(l.title)} />
        ))}
      </div>
      <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
        {opened ? 'Opened quick view: ' + opened : 'Click a card to open its quick view.'}
      </span>
    </div>
  );
}`),
    },
    {
      title: 'Loading',
      desc: 'While results load, show AssetCardSkeleton in the same grid and in the same number as the cards you expect. It matches the card’s layout, so nothing jumps when the real cards arrive.',
      ...ex(`function Example() {
  const [loading, setLoading] = useState(true);
  function reload() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1600);
  }
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);
  const listings = [
    { title: 'Orbit UI kit', creator: 'Mira Okafor', initials: 'MO', avatarColor: 'pop-orange', price: '$49', thumbColor: 'pop-violet' },
    { title: 'Mono icon pack', creator: 'Jonas Weber', initials: 'JW', avatarColor: 'pop-yellow', price: '$19', thumbColor: 'pop-yellow' },
    { title: 'Pitch deck template', creator: 'Aiko Tanaka', initials: 'AT', avatarColor: 'pop-lime', price: '$29', thumbColor: 'pop-pink' },
    { title: 'Dashboard kit', creator: 'Priya Raman', initials: 'PR', avatarColor: 'pop-violet', price: '$69', thumbColor: 'pop-orange' },
  ];
  return (
    <div style={{ width: 880, maxWidth: '100%', display: 'grid', gap: 'var(--space-lg)', justifyItems: 'start' }}>
      <Button variant="secondary" size="sm" leadingIcon="refresh" onClick={reload} disabled={loading}>Reload results</Button>
      <div aria-busy={loading} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-xl) var(--space-lg)' }}>
        {listings.map((l) => loading
          ? <AssetCardSkeleton key={l.title} />
          : <AssetCard key={l.title} {...l} />)}
      </div>
    </div>
  );
}`),
    },
  ],

  props: {
    AssetCard: [
      ['title', 'string', '', 'Listing name, on one line. Longer titles truncate with an ellipsis, so keep it under about 20 characters.'],
      ['creator', 'string', '', 'Creator name in the byline.'],
      ['initials', 'string', '', 'Creator initials for the 24px byline avatar.'],
      ['avatarColor', 'PopToken', "'pop-yellow'", 'Pop token name for the byline avatar. Use the creator’s stable color.'],
      ['price', 'string', '', 'Formatted price with currency, or "Free". Passed to PriceTag.'],
      ['was', 'string', '', 'Original price. Turns the price into a sale.'],
      ['badge', 'string', '', 'One sticker on the thumbnail, tilted -4°.'],
      ['badgeVariant', 'BadgeVariant', "'yellow'", 'Badge variant for the sticker. Use a pop color.'],
      ['image', 'string', '', 'Thumbnail URL, cropped to 4:3. Decorative (alt="") because the title names the listing.'],
      ['thumbColor', 'PopToken', '', 'Pop token name for a placeholder thumbnail when there is no image. Defaults to bg-muted with an image icon.'],
      ['saved', 'boolean', 'false', 'Saved state of the Save button. Without onSave, it is the starting value and the card manages it.'],
      ['onSave', '(saved: boolean) => void', '', 'Makes Save controlled. Called with the new value.'],
      ['href', 'string', '', 'Listing page URL. The title becomes a link that covers the whole card; Save stays separately clickable.'],
      ['onOpen', '(event) => void', '', 'Makes the card open something without a URL, like a quick view. Called on click. With href, it runs before the link is followed.'],
      ['className', 'string', '', 'Extra classes on the card.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the <article>: id, data-*, aria-*, style.'],
    ],
    AssetCardSkeleton: [
      ['(none)', '', '', 'Takes no props. Render one per card you expect, in the same grid, so the layout doesn’t shift when results arrive.'],
    ],
  },

  usage: {
    when: [
      'To show listings in browse grids, search results, collections and creator profiles.',
      'Anywhere people compare many listings by their preview.',
    ],
    whenNot: [
      'For a single featured listing with a description. Build a larger layout on the product page.',
      'For listings in a dense list, like orders or a seller’s inventory. Use a List item or a Table.',
      'For creators. Use a Creator card.',
    ],
    anatomy: {
      render: <div style={{ width: 240 }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" badge="New" thumbColor="pop-violet" saved /></div>,
      parts: [
        'Thumbnail: 4:3, radius-xl, bg-muted or a pop placeholder. Lifts 4px with elevation-3 on hover, on a spring.',
        'Sticker (optional): one Badge in the top-left corner, tilted -4°.',
        'Save: Secondary Icon button (sm) in the top-right corner. Shows on hover and focus, and stays when saved.',
        'Title: Inter Display SemiBold 15/20, text-primary, one line with an ellipsis. With href or onOpen it is a link whose hit area covers the whole card.',
        'Byline: 24px Avatar and the creator name in caption text-muted.',
        'Price: a PriceTag aligned to the top-right of the meta row.',
      ],
    },
    sections: [
      {
        title: 'Titles',
        body: 'The title has one line and truncates with an ellipsis. In a 4-column grid that leaves room for about 20 characters. Write the name of the thing, not a sales pitch.',
        dos: [
          {
            do: <div style={{ width: 220 }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" thumbColor="pop-violet" /></div>,
            doText: 'Keep titles short enough to read in full.',
            dont: <div style={{ width: 220 }}><AssetCard title="Orbit UI kit: 240 components, dark mode and 3 bonus templates" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" thumbColor="pop-violet" /></div>,
            dontText: 'Don’t write long titles. They get cut off, so buyers never see the end, which is often the part that matters.',
          },
        ],
      },
      {
        title: 'Grid',
        body: 'Cards only work in a grid of equal columns. Let the grid set the width, and keep the gap the same across the page.',
        dos: [
          {
            do: <div style={{ width: 340, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" thumbColor="pop-violet" /><AssetCard title="Mono icons" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" thumbColor="pop-yellow" /></div>,
            doText: 'Use equal columns, so thumbnails line up and are easy to compare.',
            dont: <div style={{ width: 340, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" thumbColor="pop-violet" /><AssetCard title="Mono icons" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" thumbColor="pop-yellow" /></div>,
            dontText: 'Don’t mix card widths in one grid. A bigger card looks like an ad, and the rows stop lining up.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 220 }}><AssetCard title="Mono icon pack" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" badge="Bestseller" badgeVariant="lime" thumbColor="pop-yellow" /></div>,
        doText: 'Use the sticker for one short fact that helps people choose.',
        dont: <div style={{ width: 220 }}><AssetCard title="Mono icon pack" creator="Jonas Weber" initials="JW" avatarColor="pop-yellow" price="$19" badge="Updated with 400 new icons" badgeVariant="lime" thumbColor="pop-yellow" /></div>,
        dontText: 'Don’t write a sentence in the sticker. It covers the preview and runs off the card.',
      },
      {
        do: <div style={{ width: 220 }}><AssetCard title="Dashboard kit" creator="Priya Raman" initials="PR" avatarColor="pop-violet" price="$69" thumbColor="pop-orange" /></div>,
        doText: 'Place cards straight on the page background. The thumbnail is the frame.',
        dont: <div style={{ width: 220, padding: 'var(--space-md)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-strong)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-2)' }}><AssetCard title="Dashboard kit" creator="Priya Raman" initials="PR" avatarColor="pop-violet" price="$69" thumbColor="pop-orange" /></div>,
        dontText: 'Don’t wrap the card in another bordered, shadowed box. Card-in-card adds noise and shrinks the preview.',
      },
      {
        do: <div style={{ width: 220 }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="$49" thumbColor="pop-violet" /></div>,
        doText: 'Always pass the price with its currency.',
        dont: <div style={{ width: 220 }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" avatarColor="pop-orange" price="49" thumbColor="pop-violet" /></div>,
        dontText: 'Don’t pass a bare number. People can’t tell the currency.',
      },
      {
        do: <div style={{ width: 340, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}><AssetCardSkeleton /><AssetCardSkeleton /></div>,
        doText: 'Show skeletons in the grid while results load.',
        dont: <div style={{ width: 340, display: 'grid', placeItems: 'center', minHeight: 200 }}><Spinner size="lg" /></div>,
        dontText: 'Don’t show a lone spinner for a grid. The page jumps when the cards arrive and people can’t tell how much is coming.',
      },
    ],
    content: [
      'Titles name the thing: “Orbit UI kit”, “Mono icon pack”. Keep them under about 20 characters.',
      'Use the creator’s display name, the same as on their profile.',
      'Sticker text is one or two words in sentence case: “New”, “Bestseller”, “Staff pick”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the title link (with href or onOpen), then to the Save button, which appears when focused.'], ['Enter', 'On the title link, opens the listing.'], ['Enter / Space', 'On Save, saves or unsaves the listing.']],
    notes: [
      'The card is an <article> and the title is an <h3>, so screen reader users can jump between listings by heading.',
      'Save is an Icon button with aria-pressed and a label that names the listing: “Save Orbit UI kit”, then “Remove from saved”.',
      'The thumbnail image has empty alt because the title already names the listing.',
      'With href or onOpen, only the title is a link. A stretched ::after makes the whole card clickable, so screen readers hear one short link instead of the whole card. The focus ring wraps the full card.',
      'Prefer href for real listing pages, so the card works with middle-click and Open in new tab.',
      'AssetCardSkeleton sets aria-busy and its shapes are aria-hidden. Set aria-busy on the grid too while it loads.',
      'The hover lift and the skeleton shimmer stop under prefers-reduced-motion.',
    ],
  },

  related: ['price-tag', 'badge', 'creator-card'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Long titles now truncate with an ellipsis instead of stretching the card. Added href and onOpen, which make the whole card clickable while Save stays separate, and native attributes now pass to the <article>.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Asset card and its skeleton in React and HTML/CSS, matching the Figma component (sticker, sale, free and saved states).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
