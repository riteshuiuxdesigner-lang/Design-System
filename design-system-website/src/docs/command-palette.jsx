const GROUPS = [
  { label: 'Assets', items: [
    { label: 'Orbit UI Kit', icon: 'layers-01', hint: 'UI kit' },
    { label: 'Neon Icon Pack', icon: 'star', hint: 'Icon pack' },
  ] },
  { label: 'Creators', items: [
    { label: 'Mira Okafor', icon: 'user', hint: 'Creator' },
  ] },
  { label: 'Actions', items: [
    { label: 'Upload asset', icon: 'upload-01', hint: 'Action' },
    { label: 'Go to payouts', icon: 'dollar-01', hint: 'Page' },
  ] },
];

export default {
  id: 'command-palette',
  name: 'Command palette',
  group: 'Overlays',
  order: 5,
  status: 'Beta',
  figma: '47:26',
  exports: ['CommandPalette'],
  summary: 'A search box that opens over the page with ⌘K and jumps to any asset, creator or action. Results are grouped, filter as people type, and run with the keyboard alone.',

  examples: [
    {
      title: 'Open with ⌘K',
      desc: 'The palette doesn’t listen for ⌘K itself. Add the shortcut on the page, toggle open, and close it in onClose. Each item’s onSelect runs on click or Enter, then the palette closes.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('');

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopPropagation();
        setOpen(o => !o);
      }
    }
    // Capture phase, so ⌘K reaches the palette before other shortcuts on the page.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  const groups = [
    { label: 'Assets', items: [
      { label: 'Orbit UI Kit', icon: 'layers-01', hint: 'UI kit', onSelect: () => setPicked('Opened Orbit UI Kit') },
      { label: 'Neon Icon Pack', icon: 'star', hint: 'Icon pack', onSelect: () => setPicked('Opened Neon Icon Pack') },
      { label: 'Pitch Deck Template', icon: 'file-01', hint: 'Template', onSelect: () => setPicked('Opened Pitch Deck Template') },
    ] },
    { label: 'Creators', items: [
      { label: 'Mira Okafor', icon: 'user', hint: 'Creator', onSelect: () => setPicked('Opened Mira Okafor’s profile') },
    ] },
    { label: 'Actions', items: [
      { label: 'Upload asset', icon: 'upload-01', hint: 'Action', onSelect: () => setPicked('Started a new upload') },
      { label: 'Go to payouts', icon: 'dollar-01', hint: 'Page', onSelect: () => setPicked('Went to Payouts') },
    ] },
  ];

  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' }}>
      <Button variant="secondary" leadingIcon="search-01" onClick={() => setOpen(true)}>
        Search <kbd className="mds-kbd">⌘K</kbd>
      </Button>
      {picked && <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>{picked}</span>}
      <CommandPalette open={open} onClose={() => setOpen(false)} groups={groups} />
    </div>
  );
}`),
    },
    {
      title: 'From the search field',
      desc: 'In the top navigation, the Search field shows the ⌘K hint. Match the palette’s placeholder and label to the field. Open the palette when people focus or click the field, and keep the palette outside the clickable wrapper so closing it doesn’t reopen it.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ width: 360 }}>
      <div onFocus={() => setOpen(true)} onClick={() => setOpen(true)}>
        <SearchField placeholder="Search 48,000 assets" />
      </div>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        label="Search assets"
        placeholder="Search 48,000 assets"
        groups={[
          { label: 'Recent searches', items: [
            { label: 'dashboard ui kit', icon: 'search-01', hint: 'Search' },
            { label: 'glassmorphism icons', icon: 'search-01', hint: 'Search' },
          ] },
          { label: 'Collections', items: [
            { label: 'Dashboard kits', icon: 'folder-01', hint: '12 assets' },
          ] },
        ]}
      />
    </div>
  );
}`),
    },
    {
      title: 'Inline, with filtering',
      desc: 'inline renders the panel in place with no scrim. Typing filters every group by label, groups with no matches disappear, and ↑ ↓ ↵ still work. When nothing matches, a row shows emptyText; type “zzz” to see it.',
      stage: 'muted',
      ...ex(`
<CommandPalette
  inline
  open
  emptyText="Nothing matches. Try a creator’s name or “icons”."
  groups={[
    { label: 'Assets', items: [
      { label: 'Orbit UI Kit', icon: 'layers-01', hint: 'UI kit' },
      { label: 'Neon Icon Pack', icon: 'star', hint: 'Icon pack' },
    ] },
    { label: 'Creators', items: [
      { label: 'Mira Okafor', icon: 'user', hint: 'Creator' },
    ] },
    { label: 'Actions', items: [
      { label: 'Upload asset', icon: 'upload-01', hint: 'Action' },
      { label: 'Go to payouts', icon: 'dollar-01', hint: 'Page' },
    ] },
  ]}
/>`),
    },
    {
      title: 'Seller shortcuts',
      desc: 'In the seller dashboard, lead with the actions sellers repeat most, then their own listings.',
      stage: 'muted',
      ...ex(`
<CommandPalette
  inline
  open
  groups={[
    { label: 'Actions', items: [
      { label: 'Upload asset', icon: 'upload-01', hint: 'Action' },
      { label: 'Request payout', icon: 'dollar-01', hint: '$1,240.00 ready' },
      { label: 'View analytics', icon: 'analytics-01', hint: 'Page' },
    ] },
    { label: 'Your listings', items: [
      { label: 'Orbit UI Kit', icon: 'layers-01', hint: '1,204 sales' },
      { label: 'Neon Icon Pack', icon: 'star', hint: '312 sales' },
    ] },
  ]}
/>`),
    },
  ],

  props: {
    CommandPalette: [
      ['open', 'boolean', 'false', 'Shows the palette. When false, nothing renders.'],
      ['onClose', '() => void', '', 'Called by Escape, a click on the scrim, and after an item runs.'],
      ['groups', '{ label: string, items: Item[] }[]', '', 'Result groups, in order. Groups with no matches are hidden while typing.'],
      ['groups[].items[].label', 'string', '', 'Item text. It is also what the search matches against (case-insensitive, anywhere in the label).'],
      ['groups[].items[].icon', 'IconName', "'file-01'", '20px icon before the label, in icon-secondary.'],
      ['groups[].items[].hint', 'string', '', 'Short type or detail on the right, in text-muted: “UI kit”, “Creator”.'],
      ['groups[].items[].onSelect', '() => void', '', 'Runs on click or Enter. The palette then calls onClose.'],
      ['label', 'string', "'Search'", 'aria-label of the search input.'],
      ['placeholder', 'string', "'Search assets, creators and actions'", 'Placeholder of the search input. Say what people can find.'],
      ['emptyText', 'ReactNode', "'No results for “…”. Try a shorter word.'", 'Shown when nothing matches the search.'],
      ['inline', 'boolean', 'false', 'Renders the panel in place with no scrim, no autofocus and no focus trap. Typing and arrow keys still work.'],
    ],
  },

  usage: {
    when: [
      'As a shortcut for people who know what they want: jump to an asset, a creator, a page or an action.',
      'Across the whole product, opened from the top navigation search or ⌘K.',
    ],
    whenNot: [
      'As the only way to search or navigate. Everything in it must also be reachable from the page.',
      'For browsing with filters and previews. Use the search results page.',
      'For actions on one item. Use a Dropdown Menu.',
    ],
    anatomy: {
      render: (
        <div style={{ width: 480 }}>
          <CommandPalette inline open groups={GROUPS} />
        </div>
      ),
      parts: [
        'Panel: bg-raised, radius-2xl, elevation-4, up to size-command (640px) wide. Opens 12% from the top of the screen over a bg-overlay scrim.',
        'Search row: 60px tall, search-01 icon, 17/24 input with a text-muted placeholder, and an Esc key hint. A border-subtle line below.',
        'Group label: caption in text-muted.',
        'Item: pill row, size-control-md (44px) tall, icon in icon-secondary, label in text-primary, hint on the right in text-muted. The active row gets bg-hover and an arrow.',
        'Footer: key hints for ↑↓ Navigate, ↵ Open and ⌘K Toggle, in caption text-muted.',
      ],
    },
    sections: [
      {
        title: 'Group and label results',
        body: 'People scan for the kind of thing first, then the name. Groups and hints tell an asset from a creator or a page, even when names are similar.',
        dos: [
          {
            do: <CommandPalette inline open groups={GROUPS} />,
            doText: 'Group results by type and add a short hint to each.',
            dont: (
              <CommandPalette inline open groups={[{ label: 'Results', items: [
                { label: 'Orbit UI Kit' },
                { label: 'Mira Okafor' },
                { label: 'Upload asset' },
                { label: 'Neon Icon Pack' },
                { label: 'Go to payouts' },
              ] }]} />
            ),
            dontText: 'Don’t mix assets, people and actions in one list with the same icon. People can’t tell what each row opens.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <CommandPalette inline open groups={[{ label: 'Actions', items: [
            { label: 'Upload asset', icon: 'upload-01', hint: 'Action' },
            { label: 'Go to settings', icon: 'settings-01', hint: 'Page' },
          ] }]} />
        ),
        doText: 'Offer safe actions and pages that open something.',
        dont: (
          <CommandPalette inline open groups={[{ label: 'Actions', items: [
            { label: 'Upload asset', icon: 'upload-01', hint: 'Action' },
            { label: 'Delete all listings', icon: 'delete-02', hint: 'Action' },
          ] }]} />
        ),
        dontText: 'Don’t put destructive actions in the palette. Enter runs the active row right away, so one typo can delete things.',
      },
      {
        do: (
          <CommandPalette inline open groups={[{ label: 'Assets', items: [
            { label: 'Orbit UI Kit', icon: 'layers-01', hint: 'UI kit' },
            { label: 'Neon Icon Pack', icon: 'star', hint: 'Icon pack' },
          ] }]} />
        ),
        doText: 'Keep hints to one or two words.',
        dont: (
          <CommandPalette inline open groups={[{ label: 'Assets', items: [
            { label: 'Orbit UI Kit', icon: 'layers-01', hint: 'A UI kit by Mira Okafor, 240 screens' },
            { label: 'Neon Icon Pack', icon: 'star', hint: 'Icons for dashboards, $24' },
          ] }]} />
        ),
        dontText: 'Don’t write long hints. They crowd the names people are scanning for.',
      },
    ],
    content: [
      'Placeholder: say what people can search for. “Search assets, creators and actions”.',
      'Group labels: plural nouns in sentence case. “Assets”, “Creators”, “Recent searches”.',
      'Action items start with a verb: “Upload asset”, “Go to payouts”.',
      'Hints: the type or one useful number. “UI kit”, “1,204 sales”, “$1,240.00 ready”.',
    ],
  },

  a11y: {
    keyboard: [
      ['⌘K / Ctrl+K', 'Opens and closes the palette. Add this listener on the page; the component shows the hint only.'],
      ['↑ / ↓', 'Moves the active row through every group.'],
      ['Enter', 'Runs the active row and closes the palette.'],
      ['Escape', 'Closes the palette and returns focus to where it was.'],
      ['Tab / Shift+Tab', 'Stays inside the palette.'],
    ],
    notes: [
      'The panel has role="dialog", aria-modal="true" and aria-label “Command palette”. When it opens, focus moves to the search input, Tab stays inside and the page stops scrolling. When it closes, focus goes back.',
      'The input has role="combobox", an aria-label, aria-autocomplete="list", aria-controls pointing to the role="listbox", and aria-activedescendant pointing to the active row, so screen readers announce each row as it moves.',
      'Rows are role="option" with unique ids and aria-selected on the active one. The search and the active row reset each time the palette opens.',
      'Keep every item reachable elsewhere on the page. The palette is a shortcut, not the only way in.',
      'Hovering a row makes it active, so mouse and keyboard always agree on which row Enter runs.',
      'Rows are 44px tall. Labels are text-primary and hints text-muted on bg-raised.',
      'The panel springs in over 200ms. Under prefers-reduced-motion it appears at once.',
    ],
  },

  related: ['search-field', 'top-nav', 'dropdown-menu', 'modal'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added a focus trap with focus return, aria-activedescendant with unique ids, an input label, a no-results row, and the label, placeholder and emptyText props. The search resets on each open.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Command palette in React and HTML/CSS, matching the Figma component (grouped results, filtering and keyboard navigation). Adds inline for previews.' },
  ],
};
