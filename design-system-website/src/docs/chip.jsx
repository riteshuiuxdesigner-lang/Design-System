const row = { display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', maxWidth: 300 };

export default {
  id: 'chip',
  name: 'Chip',
  group: 'Selection',
  order: 5,
  status: 'Stable',
  figma: '25:169',
  exports: ['Chip'],
  summary: 'A small pill that toggles a filter on a results grid. Selected chips flip to ink. Chips can carry a pop-color category dot, or show an applied filter with a remove button.',

  examples: [
    {
      title: 'Filter chips',
      desc: 'Each chip toggles one filter. Pass selected and flip it in onClick. More than one can be on at once.',
      ...ex(`function Example() {
  const [on, setOn] = useState(['UI kits']);
  const toggle = c => setOn(on.indexOf(c) >= 0 ? on.filter(x => x !== c) : on.concat(c));
  return (
    <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
      {['UI kits', 'Icon packs', 'Templates', 'Illustrations', 'Fonts'].map(c => (
        <Chip key={c} selected={on.indexOf(c) >= 0} onClick={() => toggle(c)}>{c}</Chip>
      ))}
    </div>
  );
}`),
    },
    {
      title: 'Category dots',
      desc: 'dot takes a pop color token name. Use the same color for a category everywhere it appears, so the dot becomes a quick visual cue.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
  <Chip dot="pop-violet">UI kits</Chip>
  <Chip dot="pop-yellow" selected>Icon packs</Chip>
  <Chip dot="pop-lime">Templates</Chip>
  <Chip dot="pop-pink">Illustrations</Chip>
  <Chip dot="pop-orange">3D</Chip>
</div>`),
    },
    {
      title: 'Single choice',
      desc: 'For a filter with one answer, like price, select exactly one chip at a time.',
      ...ex(`function Example() {
  const [price, setPrice] = useState('Any price');
  return (
    <div role="group" aria-label="Price" style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
      {['Any price', 'Free', 'Under $20', '$20 to $50', 'Over $50'].map(p => (
        <Chip key={p} selected={price === p} onClick={() => setPrice(p)}>{p}</Chip>
      ))}
    </div>
  );
}`),
    },
    {
      title: 'Applied filters',
      desc: 'Show active filters as removable chips with a way to clear them all. A removable chip is not a toggle: its remove button is a real button labelled “Remove Figma”, reachable with Tab.',
      ...ex(`function Example() {
  const [applied, setApplied] = useState(['Figma', 'Dark mode', 'Under $50']);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
      {applied.map(f => (
        <Chip key={f} removable onRemove={() => setApplied(applied.filter(x => x !== f))}>{f}</Chip>
      ))}
      {applied.length > 0
        ? <Button variant="ghost" size="sm" onClick={() => setApplied([])}>Clear all</Button>
        : <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>No filters applied</span>}
    </div>
  );
}`),
    },
    {
      title: 'Disabled',
      desc: 'Disable a chip when the filter would return nothing, and show the zero count so the reason is visible.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
  <Chip>Figma (2,104)</Chip>
  <Chip>Sketch (318)</Chip>
  <Chip disabled>Adobe XD (0)</Chip>
</div>`),
    },
    {
      title: 'Scrolling row on mobile',
      desc: 'On phones, keep chips on one line and let the row scroll sideways, so the results stay near the top.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'flex', gap: 'var(--space-xs)', overflowX: 'auto', paddingBottom: 'var(--space-2xs)' }}>
  <Chip selected style={{ flex: 'none' }}>All</Chip>
  <Chip dot="pop-violet" style={{ flex: 'none' }}>UI kits</Chip>
  <Chip dot="pop-yellow" style={{ flex: 'none' }}>Icon packs</Chip>
  <Chip dot="pop-lime" style={{ flex: 'none' }}>Templates</Chip>
  <Chip dot="pop-pink" style={{ flex: 'none' }}>Illustrations</Chip>
  <Chip dot="pop-orange" style={{ flex: 'none' }}>3D</Chip>
</div>`),
    },
    {
      title: 'Browse header',
      desc: 'Search, category chips and a results count work together at the top of the browse page.',
      stage: 'plain',
      ...ex(`function Example() {
  const counts = { 'All': 48210, 'UI kits': 2418, 'Icon packs': 5302, 'Templates': 9120 };
  const [cat, setCat] = useState('All');
  return (
    <div style={{ width: 560, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
      <SearchField placeholder="Search 48,000 assets" />
      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
        {Object.keys(counts).map(c => (
          <Chip key={c} selected={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
        {counts[cat].toLocaleString() + ' results'}
      </span>
    </div>
  );
}`),
    },
  ],

  props: {
    Chip: [
      ['children', 'ReactNode', '', 'The label. One or two words.'],
      ['selected', 'boolean', 'false', 'Flips a toggle chip to ink (bg-selected) and sets aria-pressed="true". Ignored on removable chips.'],
      ['dot', "'pop-yellow' | 'pop-lime' | 'pop-pink' | 'pop-orange' | 'pop-violet'", '', 'Adds an 8px dot in that pop color before the label.'],
      ['removable', 'boolean', 'false', 'Renders a non-toggle chip (a <span>) with a real remove <button> after the label, labelled “Remove {label}”. onClick and aria-pressed are not used.'],
      ['onRemove', '() => void', '', 'Called when the remove button is pressed, by click, Enter or Space.'],
      ['disabled', 'boolean', 'false', 'Greys the chip and blocks clicks.'],
      ['onClick', '(event) => void', '', 'Toggle the filter here. Not used on removable chips.'],
      ['className', 'string', '', 'Added to the chip (<button>, or <span> when removable).'],
      ['...rest', 'ButtonHTMLAttributes', '', 'Any native attribute: aria-label, style, title. On a removable chip they go to the <span>.'],
    ],
  },

  usage: {
    when: [
      'To filter a results grid by category, format or price.',
      'To show which filters are applied, with a way to remove each one.',
    ],
    whenNot: [
      'To switch between views of the same page. Use Tabs.',
      'To show a status or label that can’t be pressed, like “Bestseller”. Use a Badge.',
      'For a setting that saves. Use a Switch or a Checkbox.',
      'To start an action. Use a Button.',
    ],
    anatomy: {
      render: <div style={{ display: 'flex', gap: 'var(--space-xs)' }}><Chip dot="pop-yellow">Icon packs</Chip><Chip selected>UI kits</Chip></div>,
      parts: [
        'Container: pill (radius-control), 40px tall (size-avatar-md), padded space-md, 1px border-default on bg-surface. Hover uses bg-muted.',
        'Dot (optional): 8px (size-track-md) circle in a pop color.',
        'Label: label-sm (Inter Display SemiBold 13/16) in text-primary.',
        'Selected: bg-selected (ink) with text-selected, and aria-pressed="true".',
        'Remove (removable chips): a 28px round button with cancel-01 at 16px. Hover uses bg-hover; focus shows shadow-focus-ring.',
        'Press: squishes to 0.95 with a spring. Focus shows shadow-focus-ring.',
      ],
    },
    sections: [
      {
        title: 'Show the selected state clearly',
        body: 'Selected chips flip to ink so the state reads at a glance, in any theme, without relying on color. The button also reports aria-pressed so screen readers hear it.',
        dos: [
          {
            do: <div style={row}><Chip>UI kits</Chip><Chip selected>Icon packs</Chip><Chip>Templates</Chip></div>,
            doText: 'Use selected so the chip flips to ink and announces “pressed”.',
            dont: <div style={row}><Chip>UI kits</Chip><Chip dot="pop-lime">Icon packs</Chip><Chip>Templates</Chip></div>,
            dontText: 'Don’t mark selection with a colored dot. It looks like a category color, and screen readers hear nothing.',
          },
          {
            do: <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 320 }}><Chip removable>Figma</Chip><Chip removable>Under $50</Chip><Button variant="ghost" size="sm">Clear all</Button></div>,
            doText: 'Show applied filters as removable chips, with Clear all at the end.',
            dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', maxWidth: 300 }}><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>2 filters applied</span></div>,
            dontText: 'Don’t hide applied filters behind a count. People can’t see why results are missing or undo one filter.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={row}><Chip>UI kits</Chip><Chip>Icon packs</Chip><Chip>Fonts</Chip></div>,
        doText: 'Keep labels to one or two words.',
        dont: <div style={row}><Chip>All user interface kits for web</Chip><Chip>Icon packs and icon sets</Chip></div>,
        dontText: 'Don’t write long labels. The row wraps and people stop scanning.',
      },
      {
        do: <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}><Badge variant="yellow">Bestseller</Badge><Badge variant="lime">Free</Badge></div>,
        doText: 'Use a Badge for a status people can’t change.',
        dont: <div style={row}><Chip selected>Bestseller</Chip><Chip>Free</Chip></div>,
        dontText: 'Don’t use Chips as labels. They look pressable, and pressing does nothing.',
      },
      {
        do: <Tabs label="Sales view" items={[{ value: 'all', label: 'All' }, { value: 'sales', label: 'Sales' }, { value: 'payouts', label: 'Payouts' }]} />,
        doText: 'Use Tabs to switch between views of the dashboard.',
        dont: <div style={row}><Chip selected>All</Chip><Chip>Sales</Chip><Chip>Payouts</Chip></div>,
        dontText: 'Don’t use Chips as tabs. People expect chips to narrow a list, not swap the whole view.',
      },
      {
        do: <div style={{ width: 260, display: 'flex', gap: 'var(--space-xs)', overflowX: 'auto' }}><Chip selected style={{ flex: 'none' }}>All</Chip><Chip style={{ flex: 'none' }}>UI kits</Chip><Chip style={{ flex: 'none' }}>Icon packs</Chip><Chip style={{ flex: 'none' }}>Templates</Chip><Chip style={{ flex: 'none' }}>Fonts</Chip></div>,
        doText: 'On phones, keep chips on one scrolling row.',
        dont: <div style={{ width: 200, display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}><Chip selected>All</Chip><Chip>UI kits</Chip><Chip>Icon packs</Chip><Chip>Templates</Chip><Chip>Fonts</Chip></div>,
        dontText: 'Don’t let chips wrap into several rows on a phone. They push the results below the fold.',
      },
    ],
    content: [
      'Labels are plural nouns for categories (“UI kits”, “Icon packs”) and short ranges for prices (“Under $20”).',
      'Use sentence case, no end punctuation and no emoji.',
      'Add a count in brackets when it helps people avoid empty results: “Sketch (318)”.',
      'End a row of applied filters with “Clear all”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to each toggle chip, and to the remove button of each removable chip.'], ['Enter / Space', 'Toggles a chip (calls onClick), or removes a filter on its remove button (calls onRemove).']],
    notes: [
      'A toggle chip is a native <button> with aria-pressed, so screen readers announce “toggle button, pressed” or “not pressed”.',
      'Wrap a row of chips in an element with role="group" and an aria-label (“Price”, “Category”) so the set has a name.',
      'A removable chip is plain text plus a native <button> labelled “Remove Figma”. Pass a string label so the button name includes it; otherwise it reads “Remove filter”.',
      'Chips are 40px tall; leave space-xs between them so neighbors aren’t tapped by mistake.',
      'Selected is ink on white (and white on ink in dark mode), well above 4.5:1. Dots are decorative.',
      'Press squishes to 0.95 with a spring. Under prefers-reduced-motion, chips don’t move.',
    ],
  },

  related: ['tabs', 'badge', 'checkbox', 'search-field'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Removable chips are no longer toggles. The remove icon is now a real, keyboard-reachable button labelled “Remove {label}”.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Chip in React and HTML/CSS, matching the Figma component (default, hover, selected, disabled, with dot, removable).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Chips became pills (radius-control), with pure-grey borders and Inter Display labels.' },
  ],
};
