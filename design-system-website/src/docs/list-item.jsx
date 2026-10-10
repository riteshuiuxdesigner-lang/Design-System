export default {
  id: 'list-item',
  name: 'List item',
  group: 'Data display',
  order: 7,
  status: 'Stable',
  figma: '29:409',
  exports: ['ListItem'],
  summary: 'One row in a list: an optional avatar or icon, a title with a line of meta, and a slot at the end for a price, a badge or a chevron. It becomes a link or a button when you give it href or onClick.',

  examples: [
    {
      title: 'Default',
      desc: 'A static row with a leading Avatar, a SemiBold title and caption meta. The title truncates to one line; the meta sits under it in text-muted.',
      ...ex(`
<div style={{ width: 360, maxWidth: '100%' }}>
  <ListItem
    leading={<Avatar size="sm" initials="JW" color="pop-yellow" />}
    title="Jonas Weber"
    meta="Bought Orbit UI kit · 2 hours ago"
  />
</div>`),
    },
    {
      title: 'Trailing content',
      desc: 'Use trailing for one short piece of information that people compare down the list, such as a price or a status.',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%', display: 'grid' }}>
  <ListItem title="Orbit UI kit" meta="Standard license" trailing={<PriceTag price="$49" />} />
  <ListItem title="Mono icon pack" meta="Extended license" trailing={<PriceTag price="$95" />} />
  <ListItem title="Starter wireframes" meta="Standard license" trailing={<PriceTag free />} />
</div>`),
    },
    {
      title: 'Navigation',
      desc: 'Pass href to render a link, and chevron to show it leads to another page. The whole row is the target, with a bg-hover fill on hover.',
      ...ex(`
<div style={{ width: 360, maxWidth: '100%', display: 'grid' }}>
  <ListItem href="/settings/payouts" leading={<Icon name="dollar-01" />} title="Payout details" meta="Bank account ending 4021" chevron />
  <ListItem href="/settings/tax" leading={<Icon name="file-01" />} title="Tax information" meta="W-8BEN on file" chevron />
  <ListItem href="/settings/notifications" leading={<Icon name="notification-01" />} title="Notifications" meta="Email and push" chevron />
</div>`),
    },
    {
      title: 'Selectable',
      desc: 'Pass onClick to render a button, and selected to fill the chosen row with bg-muted. Add a check in trailing, so the choice isn’t shown by the fill alone.',
      ...ex(`function Example() {
  const [method, setMethod] = useState('bank');
  const methods = [
    { value: 'bank', title: 'Bank transfer', meta: 'Arrives in 2–3 business days' },
    { value: 'paypal', title: 'PayPal', meta: 'Arrives in 1 business day · 2% fee' },
    { value: 'payoneer', title: 'Payoneer', meta: 'Arrives in 1–2 business days' },
  ];
  return (
    <div style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 4 }}>
      {methods.map((m) => (
        <ListItem
          key={m.value}
          title={m.title}
          meta={m.meta}
          selected={method === m.value}
          onClick={() => setMethod(m.value)}
          trailing={method === m.value ? <Icon name="tick-02" color="var(--icon-primary)" /> : null}
        />
      ))}
    </div>
  );
}`),
    },
    {
      title: 'With a control',
      desc: 'A static row can hold one control in trailing, like a Switch or a small Button. Keep the row itself non-interactive, so there is only one thing to press.',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%', display: 'grid' }}>
  <ListItem leading={<Icon name="mail-01" />} title="Sale emails" meta="One email per purchase" trailing={<Switch aria-label="Sale emails" defaultChecked />} />
  <ListItem leading={<Icon name="message-01" />} title="Buyer messages" meta="When a buyer writes to you" trailing={<Switch aria-label="Buyer messages" />} />
</div>`),
    },
    {
      title: 'Recent sales',
      desc: 'In a seller dashboard, a short list in a card shows the latest activity. Link to the full table for more.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-xs)', padding: 'var(--space-lg)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-sm)' }}>
    <span style={{ font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}>Recent sales</span>
    <Link subtle href="/dashboard/sales">See all</Link>
  </div>
  <ListItem leading={<Avatar size="sm" initials="JW" color="pop-yellow" />} title="Orbit UI kit" meta="Jonas Weber · 2 hours ago" trailing={<PriceTag price="$49" />} />
  <ListItem leading={<Avatar size="sm" initials="AT" color="pop-lime" />} title="Mono icon pack" meta="Aiko Tanaka · 5 hours ago" trailing={<PriceTag price="$19" />} />
  <ListItem leading={<Avatar size="sm" initials="LM" color="pop-pink" />} title="Pitch deck template" meta="Leo Martins · Yesterday" trailing={<PriceTag price="$29" was="$49" />} />
</div>`),
    },
  ],

  props: {
    ListItem: [
      ['title', 'ReactNode', '', 'The main line. SemiBold, one line, truncates with an ellipsis.'],
      ['meta', 'ReactNode', '', 'Supporting line under the title, in caption text-muted.'],
      ['leading', 'ReactNode', '', 'Avatar or Icon before the text.'],
      ['trailing', 'ReactNode', '', 'One element after the text: PriceTag, Badge, Switch, small Button or a check.'],
      ['chevron', 'boolean', 'false', 'Adds an arrow-right-01 icon at the end. Use only when the row goes to another page.'],
      ['href', 'string', '', 'Renders the row as an <a>. Takes priority over onClick.'],
      ['onClick', '(event) => void', '', 'Renders the row as a <button> when there is no href.'],
      ['selected', 'boolean', 'false', 'Fills the row with bg-muted. On link and button rows it also sets aria-current="true".'],
      ['className', 'string', '', 'Extra classes on the row.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the row element (a, button or div): aria-*, data-*, id, target.'],
    ],
  },

  usage: {
    when: [
      'For lists of people, listings, orders or settings, where each row has the same shape.',
      'For short lists in a card, a menu-like settings page or a side panel.',
      'For a single choice from a few options with a sentence of detail each.',
    ],
    whenNot: [
      'To compare several values across many rows. Use a Table.',
      'To show listings by their preview. Use Asset cards in a grid.',
      'For a single choice in a form. Use Radio or a License selector.',
    ],
    anatomy: {
      render: <div style={{ width: 360 }}><ListItem href="#list-item.usage" leading={<Avatar size="sm" initials="MO" color="pop-orange" />} title="Mira Okafor" meta="48 listings · Top creator" trailing={<Badge variant="lime">Following</Badge>} chevron /></div>,
      parts: [
        'Container: radius-lg, at least 52px tall (size-control-lg), padded with space-xs and space-sm. bg-hover on hover when interactive.',
        'Leading (optional): an Avatar or a 20px Icon.',
        'Title: Inter Display SemiBold 15/20, text-primary, one line with an ellipsis.',
        'Meta (optional): caption 12/16 in text-muted.',
        'Trailing (optional): one element, aligned to the end.',
        'Chevron (optional): arrow-right-01 at 20px in icon-muted.',
      ],
    },
    sections: [
      {
        title: 'Interactive rows',
        body: 'A row is either a target or a container, never both. If the whole row opens something, give it href or onClick and keep everything inside it as plain content. If the row holds a control, leave the row static.',
        dos: [
          {
            do: <div style={{ width: 320, display: 'grid', gap: 8 }}><ListItem title="Orbit UI kit" meta="Live · 1,240 sales" trailing={<Button variant="secondary" size="sm">Edit</Button>} /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Tap targets: Edit</span></div>,
            doText: 'Keep the row static when it holds a button, so there is one clear target.',
            dont: <div style={{ width: 320, display: 'grid', gap: 8 }}><ListItem onClick={() => {}} title="Orbit UI kit" meta="Live · 1,240 sales" trailing={<Button variant="secondary" size="sm">Edit</Button>} /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Tap targets: the whole row, and Edit inside it</span></div>,
            dontText: 'Don’t put a button inside a clickable row. Nested buttons are invalid HTML, and people can’t tell which part does what.',
          },
          {
            do: <div style={{ width: 320 }}><ListItem leading={<Icon name="dollar-01" />} title="Payout details" meta="Bank account ending 4021" /></div>,
            doText: 'Leave the chevron off rows that don’t go anywhere. Add it only with href.',
            dont: <div style={{ width: 320 }}><ListItem leading={<Icon name="dollar-01" />} title="Payout details" meta="Bank account ending 4021" chevron /></div>,
            dontText: 'Don’t add a chevron to a static row. People tap it and nothing happens.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 300 }}><ListItem title="Orbit UI kit" meta="Standard license · $49" /></div>,
        doText: 'Keep the title short and put details in the meta line.',
        dont: <div style={{ width: 300 }}><ListItem title="Orbit UI kit with Standard license, bought for $49 on 3 October" meta="Orbit UI kit · Standard license" /></div>,
        dontText: 'Don’t pack everything into the title. It truncates, and the meta just repeats it.',
      },
      {
        do: <div style={{ width: 300 }}><ListItem title="Payout #2041" meta="Sent 1 October" trailing={<Badge variant="success" icon="checkmark-circle-02">Paid</Badge>} /></div>,
        doText: 'Use one trailing element that people compare down the list.',
        dont: <div style={{ width: 300 }}><ListItem title="Payout #2041" meta="Sent 1 October" trailing={<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><Badge variant="success">Paid</Badge><PriceTag price="$1,240" /><IconButton size="sm" icon="more-horizontal" label="More actions" /></div>} /></div>,
        dontText: 'Don’t stack several things at the end. The title gets squeezed and nothing lines up.',
      },
      {
        do: <div style={{ width: 300, display: 'grid' }}><ListItem leading={<Avatar size="sm" initials="JW" color="pop-yellow" />} title="Jonas Weber" meta="Buyer" /><ListItem leading={<Avatar size="sm" initials="AT" color="pop-lime" />} title="Aiko Tanaka" meta="Buyer" /></div>,
        doText: 'Use the same kind of leading element on every row.',
        dont: <div style={{ width: 300, display: 'grid' }}><ListItem leading={<Avatar size="sm" initials="JW" color="pop-yellow" />} title="Jonas Weber" meta="Buyer" /><ListItem leading={<Icon name="user" />} title="Aiko Tanaka" meta="Buyer" /><ListItem title="Leo Martins" meta="Buyer" /></div>,
        dontText: 'Don’t mix avatars, icons and nothing. The titles stop lining up and the list looks broken.',
      },
      {
        do: <div style={{ width: 300, display: 'grid', gap: 4 }}><ListItem selected onClick={() => {}} title="Bank transfer" meta="2–3 business days" trailing={<Icon name="tick-02" color="var(--icon-primary)" />} /><ListItem onClick={() => {}} title="PayPal" meta="1 business day" /></div>,
        doText: 'Add a check to the selected row.',
        dont: <div style={{ width: 300, display: 'grid', gap: 4 }}><ListItem selected onClick={() => {}} title="Bank transfer" meta="2–3 business days" /><ListItem onClick={() => {}} title="PayPal" meta="1 business day" /></div>,
        dontText: 'Don’t rely on the grey fill alone. It is subtle and easy to miss, especially in dark mode.',
      },
    ],
    content: [
      'Titles name the thing: a person, a listing, a setting. Keep them to a few words.',
      'Meta adds one or two facts, joined with “·”: “Jonas Weber · 2 hours ago”.',
      'Use relative times for recent activity (“2 hours ago”) and dates for anything older than a week.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to an interactive row (href or onClick) and shows the focus ring.'], ['Enter', 'Follows the link or activates the button row.'], ['Space', 'Activates a button row.']],
    notes: [
      'The element follows the job: <a> with href, <button> with onClick, and a plain <div> otherwise. Don’t add onClick to a static row through other means.',
      'Wrap a set of rows in a <ul> with <li> items, or give the container a heading, so screen readers know how many items there are.',
      'Selected link and button rows set aria-current="true", so screen readers announce the current one. A static row gets only the fill. Show the choice with a check icon too, since the bg-muted fill is subtle.',
      'Rows are at least 52px tall, above the 44px touch target.',
    ],
  },

  related: ['table', 'avatar', 'badge'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'selected now sets aria-current on link and button rows instead of an invalid aria-selected, and native attributes pass through to the row.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'List item in React and HTML/CSS, matching the Figma component (static, link, button and selected).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
