export default {
  id: 'tabs',
  name: 'Tabs',
  group: 'Navigation',
  order: 1,
  status: 'Stable',
  figma: '35:1672',
  exports: ['Tabs'],
  summary: 'A segmented pill control that switches between views of the same content, such as a listing’s details, files and reviews. Keep it to 2–5 short options.',

  examples: [
    {
      title: 'Default',
      desc: 'Tabs sit on a grey pill track. The selected tab lifts onto a white thumb. Without value, Tabs keeps its own state and starts on the first item or defaultValue.',
      ...ex(`
<Tabs
  label="Listing"
  items={[
    { value: 'details', label: 'Details' },
    { value: 'files', label: 'Files' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'license', label: 'License' },
  ]}
/>`),
    },
    {
      title: 'With counts',
      desc: 'Add a count when the number helps people decide where to look, such as drafts waiting to publish. Counts use tabular figures so they don’t jump as they change.',
      ...ex(`
<Tabs
  label="Your listings"
  defaultValue="published"
  items={[
    { value: 'published', label: 'Published', count: 24 },
    { value: 'drafts', label: 'Drafts', count: 3 },
    { value: 'review', label: 'In review', count: 1 },
  ]}
/>`),
    },
    {
      title: 'Disabled tab',
      desc: 'Set disabled on an item when a view exists but has nothing to show yet. Arrow keys skip it. Explain why next to the tabs.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-xs)', justifyItems: 'start' }}>
  <Tabs
    label="Listing"
    items={[
      { value: 'details', label: 'Details' },
      { value: 'files', label: 'Files' },
      { value: 'reviews', label: 'Reviews', disabled: true },
    ]}
  />
  <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Reviews open after the first sale.</span>
</div>`),
    },
    {
      title: 'Controlled with content',
      desc: 'Pass value and onChange when the page needs to know which view is open. Tabs only renders the switch. You render the view under it.',
      ...ex(`function Example() {
  const [range, setRange] = useState('month');
  const data = {
    week: { value: '$312.00', change: '+8% from last week' },
    month: { value: '$1,240.00', change: '+12% from last month' },
    all: { value: '$18,960.00', change: 'Since March 2025' },
  };
  return (
    <div style={{ display: 'grid', gap: 'var(--space-md)', width: 320 }}>
      <Tabs
        label="Earnings period"
        value={range}
        onChange={setRange}
        items={[
          { value: 'week', label: 'This week' },
          { value: 'month', label: 'This month' },
          { value: 'all', label: 'All time' },
        ]}
      />
      <StatTile
        label="Earnings"
        value={data[range].value}
        change={data[range].change}
        trend={range === 'all' ? 'neutral' : 'up'}
        icon="dollar-01"
      />
    </div>
  );
}`),
    },
    {
      title: 'Two options',
      desc: 'Two tabs work well for a quick switch between two views of the same thing, like monthly and yearly pricing for a creator plan.',
      ...ex(`function Example() {
  const [billing, setBilling] = useState('monthly');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' }}>
      <Tabs
        label="Billing period"
        value={billing}
        onChange={setBilling}
        items={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />
      <span style={{ font: '600 24px/32px var(--font-display)', color: 'var(--text-primary)' }}>
        {billing === 'monthly' ? '$12 per month' : '$120 per year'}
      </span>
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>
        {billing === 'monthly' ? 'Cancel any time.' : 'Two months free.'}
      </span>
    </div>
  );
}`),
    },
    {
      title: 'On a listing page',
      desc: 'A realistic listing view. The tabs switch what you see about one asset and the page stays the same. Each item points at the panel with controls, and the panel has role="tabpanel". Try the arrow keys.',
      stage: 'muted',
      ...ex(`function Example() {
  const [view, setView] = useState('files');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-md)', width: 360 }}>
      <Tabs
        label="Neon dashboard UI kit"
        value={view}
        onChange={setView}
        items={[
          { value: 'details', label: 'Details', controls: 'listing-panel' },
          { value: 'files', label: 'Files', count: 3, controls: 'listing-panel' },
          { value: 'reviews', label: 'Reviews', count: 128, controls: 'listing-panel' },
        ]}
      />
      <div id="listing-panel" role="tabpanel" aria-label={'Listing ' + view}>
        {view === 'details' && (
          <p style={{ margin: 0, font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>
            240 components with light and dark modes, auto layout and Figma variables. Made by Mira Okafor.
          </p>
        )}
        {view === 'files' && (
          <div style={{ display: 'grid' }}>
            <ListItem leading={<Icon name="file-01" />} title="neon-dashboard.fig" meta="Figma file · 184 MB" />
            <ListItem leading={<Icon name="file-01" />} title="neon-icons.svg.zip" meta="Icon pack · 12 MB" />
            <ListItem leading={<Icon name="file-01" />} title="license.pdf" meta="Commercial license · 220 KB" />
          </div>
        )}
        {view === 'reviews' && <Rating value={4.8} count={128} />}
      </div>
    </div>
  );
}`),
    },
  ],

  props: {
    Tabs: [
      ['items', '{ value: string; label: ReactNode; count?: number; disabled?: boolean; controls?: string }[]', '', 'The tabs, in order. value must be unique. count shows a muted number after the label. disabled skips the tab for clicks and arrow keys. controls is the id of the panel it shows and sets aria-controls.'],
      ['value', 'string', '', 'The selected tab for controlled use. Pair it with onChange.'],
      ['defaultValue', 'string', 'items[0].value', 'The tab selected first when Tabs keeps its own state.'],
      ['onChange', '(value: string) => void', '', 'Called with the new value when someone picks a tab.'],
      ['label', 'string', '', 'aria-label for the tablist. Name what the tabs switch, such as “Listing” or “Earnings period”.'],
      ['className', 'string', '', 'Extra class on the track.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the tablist: style, id, data-*, aria-*.'],
    ],
  },

  usage: {
    when: [
      'To switch between views of the same content: a listing’s details, files and reviews.',
      'To change the time range or grouping of the same data on a dashboard.',
      'For 2–5 options with short labels that fit on one line.',
    ],
    whenNot: [
      'To move through the steps of a flow. Use a Stepper with Back and Next.',
      'To go to another page or section of the site. Use TopNav, SidebarNav or BottomNav.',
      'To filter a list by several values at once. Use Chips.',
      'To pick a value inside a form. Use Radio or a License selector.',
    ],
    anatomy: {
      render: <Tabs label="Your listings" items={[{ value: 'published', label: 'Published', count: 24 }, { value: 'drafts', label: 'Drafts', count: 3 }, { value: 'review', label: 'In review', count: 1 }]} />,
      parts: [
        'Track: pill (radius-control) in bg-muted, padded with space-2xs. 44px tall overall.',
        'Tab: 36px pill (size-control-sm), label-sm (Inter Display SemiBold 13/16) in text-secondary. Hover fills with bg-hover.',
        'Selected tab: control-thumb surface with elevation-1 and text-primary. It is the only tab that floats.',
        'Count (optional): 14/20 Medium in text-muted with tabular figures.',
        'Focus ring: shadow-focus-ring on keyboard focus only.',
      ],
    },
    sections: [
      {
        title: 'Views, not steps',
        body: 'Every tab shows the same thing from a different angle, and people can jump between them in any order. If one view has to come before another, it is a flow. Use a Stepper.',
        dos: [
          {
            do: <Tabs label="Listing" items={[{ value: 'details', label: 'Details' }, { value: 'files', label: 'Files' }, { value: 'reviews', label: 'Reviews' }]} />,
            doText: 'Use Tabs for views of one listing that people can open in any order.',
            dont: <Tabs label="Publish" items={[{ value: '1', label: '1. Details' }, { value: '2', label: '2. Files' }, { value: '3', label: '3. Pricing' }, { value: '4', label: '4. Review' }]} />,
            dontText: 'Don’t use Tabs as the steps of a flow. Nothing shows what is done or what comes next. Use a Stepper.',
          },
        ],
      },
      {
        title: 'Tabs are not site navigation',
        body: 'Tabs change the view inside one page. Moving to another page belongs in TopNav, SidebarNav or BottomNav, which mark the current page with aria-current and work as links.',
        dos: [
          {
            do: <Tabs label="Earnings period" items={[{ value: 'week', label: 'This week' }, { value: 'month', label: 'This month' }, { value: 'all', label: 'All time' }]} />,
            doText: 'Switch the range of the earnings chart in place.',
            dont: <Tabs label="Site" items={[{ value: 'home', label: 'Home' }, { value: 'browse', label: 'Browse' }, { value: 'sell', label: 'Sell' }, { value: 'profile', label: 'Profile' }]} />,
            dontText: 'Don’t use Tabs to move between pages of the site. They can’t be opened in a new tab or bookmarked.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Tabs label="Assets" items={[{ value: 'all', label: 'All' }, { value: 'kits', label: 'UI kits' }, { value: 'icons', label: 'Icons' }, { value: 'templates', label: 'Templates' }]} />,
        doText: 'Keep it to 2–5 tabs so every option is visible at once.',
        dont: <div style={{ width: 320, overflowX: 'auto' }}><Tabs label="Assets" items={[{ value: 'all', label: 'All' }, { value: 'kits', label: 'UI kits' }, { value: 'icons', label: 'Icons' }, { value: 'templates', label: 'Templates' }, { value: 'fonts', label: 'Fonts' }, { value: 'mockups', label: 'Mockups' }, { value: '3d', label: '3D' }, { value: 'illus', label: 'Illustrations' }, { value: 'decks', label: 'Decks' }]} /></div>,
        dontText: 'Don’t cram in 9 tabs. They run off the edge and people miss the ones they can’t see. Use Chips or a Select.',
      },
      {
        do: <Tabs label="Listing" items={[{ value: 'details', label: 'Details' }, { value: 'reviews', label: 'Reviews' }]} />,
        doText: 'Use one or two words per tab.',
        dont: <div style={{ width: 320, overflowX: 'auto' }}><Tabs label="Listing" items={[{ value: 'details', label: 'Everything about this kit' }, { value: 'reviews', label: 'What verified buyers say' }]} /></div>,
        dontText: 'Don’t write sentences in tabs. Long labels push the track wider than the screen.',
      },
      {
        do: <Tabs label="Your listings" items={[{ value: 'published', label: 'Published', count: 24 }, { value: 'drafts', label: 'Drafts', count: 3 }]} />,
        doText: 'Use the count field so numbers stay muted and line up.',
        dont: <Tabs label="Your listings" items={[{ value: 'published', label: 'Published (24)' }, { value: 'drafts', label: 'Drafts (3)' }]} />,
        dontText: 'Don’t type counts into the label in brackets. They read as part of the name.',
      },
      {
        do: <Tabs label="Reviews" items={[{ value: 'recent', label: 'Most recent' }, { value: 'helpful', label: 'Most helpful' }]} />,
        doText: 'Write labels in sentence case.',
        dont: <Tabs label="Reviews" items={[{ value: 'recent', label: 'MOST RECENT' }, { value: 'helpful', label: 'MOST HELPFUL' }]} />,
        dontText: 'Don’t use all caps. It is harder to read and looks like shouting.',
      },
    ],
    content: [
      'Name the view, not the action: “Reviews”, not “See reviews”.',
      'Use nouns of similar length so the track looks even.',
      'Keep the same order everywhere the same tabs appear, and open the most useful view first.',
      'Give the tablist a label that names what the tabs switch, such as “Listing” or “Earnings period”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus into the tablist, onto the selected tab, then out to the panel. Only the selected tab is in the tab order.'],
      ['Arrow Right / Arrow Left', 'Selects and focuses the next or previous tab, wrapping at the ends. Disabled tabs are skipped.'],
      ['Home / End', 'Selects and focuses the first or last enabled tab.'],
      ['Enter / Space', 'Selects the focused tab.'],
    ],
    notes: [
      'The track has role="tablist" and takes its name from label. Each tab has role="tab" and aria-selected.',
      'Roving tabindex: the selected tab has tabIndex 0 and the others -1, so the whole control is one stop in the tab order.',
      'Tabs does not render panels. Give the view under it role="tabpanel" and an id, and pass that id as controls on each item to set aria-controls.',
      'Disabled tabs use the native disabled attribute and are skipped by the arrow keys. Say nearby why a view is unavailable.',
      'Selected and hover states use surface and shadow plus text weight, so they do not rely on color alone. Labels meet 4.5:1.',
      'Each tab is 36px, and the track brings the row to 44px. On touch screens, keep space around the track so taps don’t land on neighbours.',
    ],
  },

  related: ['stepper', 'chip', 'top-nav', 'sidebar-nav'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Arrow-key, Home and End navigation with roving tabindex, per-item disabled and controls (aria-controls), and native attributes and style on the tablist.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Tabs in React and HTML/CSS, matching the Figma component (segmented track, counts, controlled and uncontrolled).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Tabs became a segmented pill control on a bg-muted track, with Inter Display labels.' },
  ],
};
