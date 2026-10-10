const box = (w) => ({ width: w || 290, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' });
const meta = { font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)', paddingLeft: 'var(--space-2xs)' };

export default {
  id: 'search-field',
  name: 'Search field',
  group: 'Inputs',
  order: 3,
  status: 'Stable',
  figma: '19:79',
  exports: ['SearchField'],
  summary: 'A muted pill for searching the catalog or filtering a list. It has a search icon, a clear button and an optional ⌘K hint.',

  examples: [
    {
      title: 'Default',
      desc: 'The field sits on bg-muted so it reads as search, not as a form input. When it is empty, it shows a ⌘K hint; once people type, the hint becomes a clear button.',
      ...ex(`
<div style={{ width: 360, maxWidth: '100%' }}>
  <SearchField placeholder="Search UI kits, icons and templates" />
</div>`),
    },
    {
      title: 'Large',
      desc: 'Use Large (52px) for the hero search on the home and browse pages.',
      ...ex(`
<div style={{ width: 520, maxWidth: '100%' }}>
  <SearchField size="lg" placeholder="Search 48,000 assets" />
</div>`),
    },
    {
      title: 'Without the shortcut hint',
      desc: 'Turn the hint off on touch screens and inside panels where ⌘K does something else.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <SearchField placeholder="Search your listings" shortcut={false} />
</div>`),
    },
    {
      title: 'Search on Enter',
      desc: 'onSubmit fires on Enter with the current text. onChange receives the text itself, not an event. Keep the query in the field after searching so people can refine it.',
      ...ex(`function Example() {
  const [query, setQuery] = useState('dashboard');
  const [searched, setSearched] = useState('dashboard');
  return (
    <div style={{ width: 360, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' }}>
      <SearchField
        label="Search assets"
        placeholder="Search assets"
        value={query}
        onChange={setQuery}
        onSubmit={setSearched}
        shortcut={false}
      />
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)', paddingLeft: 'var(--space-2xs)' }}>
        {searched ? '128 results for “' + searched + '”' : 'Press Enter to search'}
      </span>
    </div>
  );
}`),
    },
    {
      title: 'Wire up ⌘K',
      desc: 'The ⌘K hint is only a label. Add the keyboard shortcut yourself, as here, or open the Command palette with it. Press ⌘K or Ctrl+K to try it.',
      ...ex(`function Example() {
  const wrap = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        wrap.current.querySelector('input').focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div ref={wrap} style={{ width: 360, maxWidth: '100%' }}>
      <SearchField placeholder="Search UI kits, icons and templates" />
    </div>
  );
}`),
    },
    {
      title: 'Filter a list',
      desc: 'In the seller dashboard, the field filters a list in place as people type. Say when nothing matches.',
      stage: 'muted',
      ...ex(`function Example() {
  const [q, setQ] = useState('');
  const listings = [
    { title: 'Orbit dashboard UI kit', meta: '$49 · 312 sales', color: 'pop-violet' },
    { title: 'Doodle icon pack', meta: '$19 · 1,204 sales', color: 'pop-yellow' },
    { title: 'Pitch deck template', meta: '$29 · 87 sales', color: 'pop-lime' },
    { title: 'Isometric illustrations', meta: '$39 · 45 sales', color: 'pop-pink' },
  ];
  const shown = listings.filter(l => l.title.toLowerCase().indexOf(q.toLowerCase()) >= 0);
  return (
    <div style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)', padding: 'var(--space-md)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <SearchField label="Filter listings" placeholder="Filter your listings" value={q} onChange={setQ} shortcut={false} />
      {shown.map(l => (
        <ListItem key={l.title} title={l.title} meta={l.meta} leading={<Avatar size="sm" color={l.color} initials={l.title[0]} />} />
      ))}
      {shown.length === 0 && (
        <span style={{ padding: 'var(--space-sm)', font: '400 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
          No listings match “{q}”. Check the spelling or clear the search.
        </span>
      )}
    </div>
  );
}`),
    },
  ],

  props: {
    SearchField: [
      ['placeholder', 'string', "'Search'", 'Hint text. Say what can be found: “Search UI kits, icons and templates”.'],
      ['label', 'string', "'Search'", 'Accessible name (aria-label) of the input. Set it when the page has more than one search.'],
      ['value', 'string', '', 'Controlled text. Pair with onChange.'],
      ['defaultValue', 'string', "''", 'Starting text when uncontrolled.'],
      ['onChange', '(value: string) => void', '', 'Called with the new text on every keystroke and when cleared. It receives the text, not an event.'],
      ['onSubmit', '(value: string) => void', '', 'Called with the text when people press Enter.'],
      ['shortcut', 'boolean', 'true', 'Shows the ⌘K hint while the field is empty. It is only a label; wire the shortcut yourself.'],
      ['size', "'md' | 'lg'", "'md'", 'Height 44 / 52px. Use Large for hero search.'],
      ['className', 'string', '', 'Added to the <form>. Use it for width and layout.'],
    ],
  },

  usage: {
    when: [
      'To search the whole catalog from the top nav or a hero.',
      'To filter a long list in place, such as your listings, orders or payouts.',
    ],
    whenNot: [
      'To enter data in a form. Use a Text field.',
      'To pick one value from a known list. Use a Select.',
      'For a quick switcher across assets, creators and actions. Use the Command palette.',
      'To narrow results by category or price. Use Chips next to the search.',
    ],
    anatomy: {
      render: <div style={{ width: 340 }}><SearchField placeholder="Search UI kits, icons and templates" /></div>,
      parts: [
        'Container: pill (radius-control), 44px tall, bg-muted with a transparent border. Hover uses bg-muted-hover.',
        'Search icon: search-01, 20px in icon-secondary.',
        'Input: body 16/24 in text-primary. Placeholder uses text-muted.',
        'Shortcut hint: mds-kbd, caption in text-muted on bg-surface. Shows only while empty.',
        'Clear button: 36px circle with cancel-01. Replaces the hint once there is text.',
        'Focus: the pill turns bg-surface with a focus-ring border and shadow-focus-halo.',
      ],
    },
    sections: [
      {
        title: 'Placeholder text',
        body: 'The placeholder is the only hint of what the search covers. Name the things people can find.',
        dos: [
          {
            do: <div style={box()}><SearchField placeholder="Search UI kits, icons and templates" shortcut={false} /></div>,
            doText: 'Say what people can search for.',
            dont: <div style={box()}><SearchField placeholder="Type here..." shortcut={false} /></div>,
            dontText: 'Don’t use “Type here” or “Search...”. It tells people nothing about what is inside.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={box()}><SearchField placeholder="Search assets" shortcut={false} /></div>,
        doText: 'Let Enter submit the search. The field is enough on its own.',
        dont: <div style={{ display: 'flex', gap: 'var(--space-xs)', width: 300, maxWidth: '100%' }}><div style={{ flex: 1, minWidth: 0 }}><SearchField placeholder="Search assets" shortcut={false} /></div><Button>Search</Button></div>,
        dontText: 'Don’t add a separate Search button. It takes space from the field and repeats what Enter does.',
      },
      {
        do: <div style={box()}><SearchField placeholder="Search assets" defaultValue="dashboard" shortcut={false} /><span style={meta}>128 results for “dashboard”</span></div>,
        doText: 'Keep the query in the field after searching so people can refine it.',
        dont: <div style={box()}><SearchField placeholder="Search assets" shortcut={false} /><span style={meta}>128 results</span></div>,
        dontText: 'Don’t clear the field after a search. People forget what they typed and can’t adjust it.',
      },
      {
        do: <div style={box()}><SearchField placeholder="Search assets" shortcut={false} /></div>,
        doText: 'Use a Search field for search. It has the search role, a clear button and the muted style people recognize.',
        dont: <div style={box()}><TextField aria-label="Search assets" leadingIcon="search-01" placeholder="Search assets" /></div>,
        dontText: 'Don’t build search from a Text field with a search icon. It looks like a form field and has no clear button.',
      },
      {
        do: <div style={box(260)}><SearchField placeholder="Search assets" shortcut={false} /></div>,
        doText: 'Hide the ⌘K hint on phones and tablets.',
        dont: <div style={box(260)}><SearchField placeholder="Search assets" /></div>,
        dontText: 'Don’t show ⌘K where there is no keyboard. The hint takes space and means nothing on a phone.',
      },
    ],
    content: [
      'Placeholders start with “Search” and name what can be found: “Search 48,000 assets”, “Search your listings”.',
      'When nothing matches, say so and give a next step: “No listings match ‘orbit’. Check the spelling or clear the search.”',
      'Show the result count with the query: “128 results for ‘dashboard’”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus into the input, then to the clear button when there is text.'],
      ['Enter', 'Submits the search and calls onSubmit.'],
      ['⌘K / Ctrl+K', 'Only works when you add the listener yourself (see the example).'],
    ],
    notes: [
      'The wrapper is a <form role="search">, so screen readers list it as a search landmark.',
      'The input gets its name from label (aria-label, default “Search”). Give each search on a page a different label.',
      'The clear button is labelled “Clear search” and is 36px. It replaces the hint as soon as there is text.',
      'The browser’s own clear icon is hidden so there is only one clear button.',
      'bg-muted and the focus border change color only, so nothing moves under prefers-reduced-motion.',
    ],
  },

  related: ['text-field', 'command-palette', 'chip', 'top-nav'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Search field in React and HTML/CSS, matching the Figma component (2 sizes × empty, focused, filled).' },
  ],
};
