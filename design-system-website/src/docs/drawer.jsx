export default {
  id: 'drawer',
  name: 'Drawer',
  group: 'Overlays',
  order: 2,
  status: 'Stable',
  figma: '46:171',
  exports: ['Drawer'],
  summary: 'A panel that slides in from the side of the screen, or up from the bottom as a sheet on mobile. It holds a task that needs more room than a Modal, like filters or order details, while the page stays in view.',

  examples: [
    {
      title: 'Side drawer',
      desc: 'side="right" is the default. It slides in over 320ms and fills the height of the screen at 400px wide. Put the main action in footer.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ figma: true, free: false, commercial: true });
  const count = 248 - (filters.free ? 180 : 0) - (filters.commercial ? 0 : 40);
  function toggle(key) {
    setFilters(f => ({ ...f, [key]: !f[key] }));
  }
  return (
    <>
      <Button variant="secondary" leadingIcon="filter-horizontal" onClick={() => setOpen(true)}>Filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter UI kits"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFilters({ figma: false, free: false, commercial: false })}>Clear all</Button>
            <Button onClick={() => setOpen(false)}>{'Show ' + count + ' results'}</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
          <Checkbox label="Made for Figma" checked={filters.figma} onChange={() => toggle('figma')} />
          <Checkbox label="Free only" checked={filters.free} onChange={() => toggle('free')} />
          <Checkbox label="Commercial license included" checked={filters.commercial} onChange={() => toggle('commercial')} />
        </div>
      </Drawer>
    </>
  );
}`),
    },
    {
      title: 'Bottom sheet',
      desc: 'side="bottom" rises from the bottom edge with a grab handle and radius-2xl top corners. Use it on phones for short tasks, like picking a license before buying.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [license, setLicense] = useState('personal');
  const prices = { personal: '$49', commercial: '$79', extended: '$249' };
  return (
    <>
      <Button size="lg" leadingIcon="shopping-bag-01" onClick={() => setOpen(true)}>Buy Orbit UI Kit</Button>
      <Drawer
        open={open}
        side="bottom"
        onClose={() => setOpen(false)}
        title="Choose a license"
        footer={<Button size="lg" onClick={() => setOpen(false)}>{'Buy for ' + prices[license]}</Button>}
      >
        <LicenseSelector
          value={license}
          onChange={setLicense}
          options={[
            { value: 'personal', title: 'Personal', description: 'Your own projects', price: '$49' },
            { value: 'commercial', title: 'Commercial', description: 'Client work and products you sell', price: '$79' },
            { value: 'extended', title: 'Extended', description: 'Templates and themes you resell', price: '$249' },
          ]}
        />
      </Drawer>
    </>
  );
}`),
    },
    {
      title: 'From the left',
      desc: 'side="left" slides in from the left edge. Use it for the navigation menu on phones and tablets, opened from the menu button in the top navigation.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState('Browse');
  const links = [['Browse', 'search-01'], ['Creators', 'user'], ['Collections', 'folder-01'], ['Sell', 'store-01']];
  return (
    <>
      <IconButton variant="secondary" icon="menu-01" label="Open menu" onClick={() => setOpen(true)} />
      <Drawer open={open} side="left" onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Primary" style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
          {links.map(([label, icon]) => (
            <ListItem
              key={label}
              title={label}
              leading={<Icon name={icon} />}
              selected={label === page}
              onClick={() => { setPage(label); setOpen(false); }}
            />
          ))}
        </nav>
      </Drawer>
    </>
  );
}`),
    },
    {
      title: 'Details without a footer',
      desc: 'Leave out footer when the drawer is only for reading. The close button and Escape are enough.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => setOpen(true)}>View order #4821</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Order #4821">
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          <ListItem title="Orbit UI Kit" meta="Commercial license · Mira Okafor" leading={<Avatar size="sm" initials="MO" color="pop-violet" />} trailing={<PriceTag price="$79" />} />
          <ListItem title="Neon Icon Pack" meta="Personal license · Theo Lind" leading={<Avatar size="sm" initials="TL" color="pop-lime" />} trailing={<PriceTag price="$24" />} />
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '600 15px/22px var(--font-display)', color: 'var(--text-primary)' }}>
            <span>Total paid</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>$103.00</span>
          </div>
          <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Paid with the card ending 6411 on October 8, 2026.</span>
        </div>
      </Drawer>
    </>
  );
}`),
    },
    {
      title: 'Inline preview',
      desc: 'inline renders the panel in place with no scrim and no slide. Use it in docs and design reviews; it is not interactive as an overlay.',
      stage: 'muted',
      ...ex(`
<Drawer
  inline
  open
  title="Filter UI kits"
  footer={<><Button variant="secondary">Clear all</Button><Button>Show 248 results</Button></>}
>
  <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
    <Checkbox label="Made for Figma" defaultChecked />
    <Checkbox label="Free only" />
    <Checkbox label="Commercial license included" defaultChecked />
  </div>
</Drawer>`),
    },
    {
      title: 'Sheet on a phone screen',
      desc: 'An inline bottom sheet inside a phone frame, the way it looks over a listing page on mobile.',
      stage: 'muted',
      ...ex(`
<div style={{ position: 'relative', width: 360, height: 560, overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: 'var(--border-width-default) solid var(--border-subtle)', background: 'var(--bg-default)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
  <div style={{ position: 'absolute', inset: 0, padding: 'var(--space-md)' }}>
    <AssetCard title="Orbit UI Kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" />
  </div>
  <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)' }} />
  <div style={{ position: 'relative' }}>
    <Drawer inline open side="bottom" title="Share Orbit UI Kit" footer={<Button leadingIcon="copy-01">Copy link</Button>}>
      <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
        <ListItem title="Send in a message" leading={<Icon name="message-01" />} chevron onClick={() => {}} />
        <ListItem title="Email to a teammate" leading={<Icon name="mail-01" />} chevron onClick={() => {}} />
      </div>
    </Drawer>
  </div>
</div>`),
    },
  ],

  props: {
    Drawer: [
      ['open', 'boolean', 'false', 'Shows the Drawer. When false, nothing renders.'],
      ['onClose', '() => void', '', 'Called by the close button, Escape and a click on the scrim.'],
      ['title', 'string', '', 'Shown in the header and used as the dialog’s aria-label.'],
      ['children', 'ReactNode', '', 'The body. It scrolls when it is taller than the screen.'],
      ['footer', 'ReactNode', '', 'Actions pinned to the bottom. Buttons stretch to share the width equally.'],
      ['side', "'right' | 'left' | 'bottom'", "'right'", 'Right or left: full-height panel, size-drawer (400px) wide. Bottom: full-width sheet with a grab handle, up to 90% of the screen height.'],
      ['inline', 'boolean', 'false', 'Renders the panel in place with no scrim, no slide, no Escape handling and no focus trap. For docs and previews only.'],
      ['className', 'string', '', 'Extra class on the panel.'],
      ['style', 'CSSProperties', '', 'Inline style on the panel. Use tokens only.'],
    ],
  },

  usage: {
    when: [
      'For a task that needs more room than a Modal but should keep the page in view: filters, order details, editing a listing’s tags.',
      'On phones, as a bottom sheet for short choices: license, share, sort.',
    ],
    whenNot: [
      'For a single yes-or-no decision. Use a Modal.',
      'For long multi-step flows like checkout. Use a full page.',
      'For a handful of actions on one item. Use a Dropdown Menu.',
      'For navigation on desktop. Use the Sidebar Nav.',
    ],
    anatomy: {
      render: (
        <Drawer inline open title="Filter UI kits" onClose={() => {}} footer={<><Button variant="secondary">Clear all</Button><Button>Show 248 results</Button></>}>
          <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
            <Checkbox label="Made for Figma" defaultChecked />
            <Checkbox label="Free only" />
          </div>
        </Drawer>
      ),
      parts: [
        'Panel: bg-raised, elevation-4. Right or left: size-drawer (400px) wide and full height. Bottom: full width with radius-2xl top corners and a grab handle in border-strong.',
        'Header: title in Inter Display SemiBold 20/28 and a small Close IconButton. A border-subtle line below.',
        'Body: padded with space-xl, body-md in text-secondary. Scrolls on its own.',
        'Footer (optional): pinned actions, padded with space-md and space-xl, with a border-subtle line above. Buttons share the width.',
        'Scrim: bg-overlay. Clicking it closes the Drawer.',
      ],
    },
    sections: [
      {
        title: 'Drawer or Modal',
        body: 'A Drawer keeps the page in view, so people can see the effect of what they change, like filters on a grid. A Modal takes over the screen for one decision.',
        dos: [
          {
            do: (
              <div style={{ display: 'flex', width: 320 }}>
                <Drawer inline open title="Filter UI kits" footer={<Button>Show 248 results</Button>}>
                  <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
                    <Checkbox label="Made for Figma" defaultChecked />
                    <Checkbox label="Free only" />
                    <Checkbox label="Commercial license" defaultChecked />
                  </div>
                </Drawer>
              </div>
            ),
            doText: 'Use a Drawer for filters, so the grid stays in view beside it.',
            dont: (
              <Modal inline open icon="filter-horizontal" title="Filter UI kits" primaryLabel="Confirm">
                <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
                  <Checkbox label="Made for Figma" defaultChecked />
                  <Checkbox label="Free only" />
                  <Checkbox label="Commercial license" defaultChecked />
                </div>
              </Modal>
            ),
            dontText: 'Don’t put filters in a Modal. It hides the results people are trying to narrow down.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <div style={{ display: 'flex', width: 320 }}>
            <Drawer inline open title="Filter UI kits" footer={<><Button variant="secondary">Clear all</Button><Button>Show 248 results</Button></>}>
              <Checkbox label="Made for Figma" defaultChecked />
            </Drawer>
          </div>
        ),
        doText: 'Use two footer actions and say the result on the Primary.',
        dont: (
          <div style={{ display: 'flex', width: 320 }}>
            <Drawer inline open title="Filter UI kits" footer={<><Button variant="secondary" size="sm">Cancel</Button><Button variant="secondary" size="sm">Reset</Button><Button size="sm">Apply</Button></>}>
              <Checkbox label="Made for Figma" defaultChecked />
            </Drawer>
          </div>
        ),
        dontText: 'Don’t line up Cancel, Reset and Apply. The close button already cancels, and “Apply” hides what happens.',
      },
      {
        do: (
          <div style={{ width: 320 }}>
            <Drawer inline open side="bottom" title="Choose a license" footer={<Button>Buy for $79</Button>}>
              <Radio name="lic-do" label="Commercial · $79" defaultChecked />
            </Drawer>
          </div>
        ),
        doText: 'Keep a bottom sheet to one short choice and one action.',
        dont: (
          <div style={{ width: 320 }}>
            <Drawer inline open side="bottom" title="Checkout" footer={<Button>Pay $79</Button>}>
              <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
                <TextField label="Email" placeholder="you@studio.com" size="sm" />
                <TextField label="Name on card" size="sm" />
                <TextField label="Billing address" size="sm" />
              </div>
            </Drawer>
          </div>
        ),
        dontText: 'Don’t squeeze a long form into a sheet. The keyboard covers half of it on a phone; use a full page.',
      },
      {
        do: (
          <div style={{ display: 'flex', width: 320 }}>
            <Drawer inline open title="Order #4821">
              <ListItem title="Orbit UI Kit" meta="Commercial license" trailing={<PriceTag price="$79" />} />
            </Drawer>
          </div>
        ),
        doText: 'Title the Drawer with what is inside.',
        dont: (
          <div style={{ display: 'flex', width: 320 }}>
            <Drawer inline open title="Details">
              <ListItem title="Orbit UI Kit" meta="Commercial license" trailing={<PriceTag price="$79" />} />
            </Drawer>
          </div>
        ),
        dontText: 'Don’t use a vague title like “Details” or “More”. Screen readers announce the title as the dialog’s name.',
      },
    ],
    content: [
      'Title: the object or task, in sentence case. “Filter UI kits”, “Order #4821”, “Choose a license”.',
      'Primary footer action: the result, with numbers when you have them. “Show 248 results”, “Buy for $79”.',
      'Keep body copy short. Use headings to split long content into groups.',
    ],
  },

  a11y: {
    keyboard: [
      ['Escape', 'Closes the Drawer (calls onClose).'],
      ['Tab / Shift+Tab', 'Moves through the close button, the body and the footer actions, and wraps around inside the Drawer.'],
      ['Enter / Space', 'Activates the focused control.'],
    ],
    notes: [
      'The panel has role="dialog", aria-modal="true" and aria-label set to the title.',
      'When it opens, focus moves to the panel, Tab stays inside it and the page behind stops scrolling. When it closes, focus goes back to the element that opened it.',
      'The close button is an IconButton labelled “Close”. Every footer action needs a visible label.',
      'The grab handle on the bottom sheet is decorative. Close it with the button, Escape or the scrim.',
      'It slides in over 320ms with cubic-bezier(0.2,0,0,1). Under prefers-reduced-motion it appears without moving.',
    ],
  },

  related: ['modal', 'dropdown-menu', 'license-selector'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added a focus trap with scroll lock and focus return, side="left", and the className and style props.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Drawer in React and HTML/CSS, matching the Figma component (side drawer and bottom sheet). Adds inline for previews.' },
  ],
};
