export default {
  id: 'divider',
  name: 'Divider',
  group: 'Layout',
  order: 1,
  status: 'Stable',
  exports: ['Divider'],
  summary: 'A 1px hairline in border-subtle that separates groups of content, across or down. Reach for spacing first and add a Divider only when space alone doesn’t show the break.',

  examples: [
    {
      title: 'Horizontal',
      desc: 'The default fills the width of its container. It has no margin of its own, so set the space around it with the parent’s gap.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-md)', width: 320, font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>
  <span>240 components with light and dark modes.</span>
  <Divider />
  <span>Commercial license for unlimited projects.</span>
</div>`),
    },
    {
      title: 'Vertical',
      desc: 'Set vertical inside a flex row. It stretches to the height of the row and gets aria-orientation="vertical". These lines only separate stats visually, so aria-hidden keeps screen readers from announcing them.',
      ...ex(`
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
  <span>1.2k sales</span>
  <Divider vertical aria-hidden="true" />
  <span>4.8 rating</span>
  <Divider vertical aria-hidden="true" />
  <span>86 assets</span>
</div>`),
    },
    {
      title: 'In a toolbar',
      desc: 'Vertical dividers split a toolbar into groups of related actions, such as formatting and sharing.',
      ...ex(`
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', padding: 'var(--space-2xs)', borderRadius: 'var(--radius-control)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-surface)' }}>
  <IconButton size="sm" icon="edit-02" label="Edit listing" />
  <IconButton size="sm" icon="copy-01" label="Duplicate listing" />
  <Divider vertical />
  <IconButton size="sm" icon="share-08" label="Share listing" />
  <IconButton size="sm" icon="link-01" label="Copy link" />
  <Divider vertical />
  <IconButton size="sm" icon="delete-02" label="Delete listing" />
</div>`),
    },
    {
      title: 'Order summary',
      desc: 'A realistic checkout card. The Divider separates the line items from the total, which is the one break that matters.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', width: 320, padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)', font: '400 15px/20px var(--font-display)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Neon dashboard UI kit</span><span>$49.00</span></div>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pastel icon pack</span><span>$19.00</span></div>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Extended license</span><span>$20.00</span></div>
  <Divider />
  <div style={{ display: 'flex', justifyContent: 'space-between', font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}><span>Total</span><span>$88.00</span></div>
  <Button size="lg" style={{ width: '100%' }}>Pay $88.00</Button>
</div>`),
    },
    {
      title: 'Between groups of a list',
      desc: 'In a settings panel, a Divider separates groups of rows. Rows inside a group need no lines between them.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-xs)', width: 320, padding: 'var(--space-xs)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <ListItem href="/settings/profile" leading={<Icon name="user" />} title="Profile" chevron />
  <ListItem href="/settings/payouts" leading={<Icon name="dollar-01" />} title="Payouts" chevron />
  <ListItem href="/settings/notifications" leading={<Icon name="notification-01" />} title="Notifications" chevron />
  <Divider />
  <ListItem href="/logout" leading={<Icon name="logout-01" />} title="Log out" />
</div>`),
    },
  ],

  props: {
    Divider: [
      ['vertical', 'boolean', 'false', 'Draws a vertical line that stretches to the height of a flex row, with aria-orientation="vertical".'],
      ['className', 'string', '', 'Extra class on the hr. Divider has no margin; space it with the parent’s gap.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the hr: aria-hidden, style, id, data-*.'],
    ],
  },

  usage: {
    when: [
      'To separate groups that spacing alone can’t pull apart, like line items and a total.',
      'To split a toolbar or a row of stats into groups.',
      'To set off a different kind of action, such as Log out at the end of a menu.',
    ],
    whenNot: [
      'Between every row of a list. Use spacing, or a Table for tabular data.',
      'Around the edge of a card. Cards already have a border or a surface.',
      'As decoration under headings. Let type size and space create the hierarchy.',
    ],
    anatomy: {
      render: <div style={{ display: 'grid', gap: 'var(--space-md)', width: 280 }}><Divider /><div style={{ display: 'flex', height: 'var(--size-control-sm)', gap: 'var(--space-md)' }}><Divider vertical /><Divider vertical /><Divider vertical /></div></div>,
      parts: [
        'Line: 1px (border-width-default) in border-subtle.',
        'Horizontal: full width of the container, drawn as the top border of an <hr>.',
        'Vertical: full height of the flex row, drawn as the left border.',
        'Spacing: none built in. Use the parent’s gap, usually space-sm to space-xl.',
      ],
    },
    sections: [
      {
        title: 'Space first, then a line',
        body: 'Most groups separate well with space alone. Add a Divider only where the content changes kind, and keep it to one or two per surface. Every extra line makes the page look busier and the real break harder to find.',
        dos: [
          {
            do: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280, padding: 'var(--space-xs)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}><ListItem title="Profile" /><ListItem title="Payouts" /><ListItem title="Notifications" /><Divider /><ListItem title="Log out" /></div>,
            doText: 'Use one Divider where the group changes.',
            dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280, padding: 'var(--space-xs)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}><ListItem title="Profile" /><Divider /><ListItem title="Payouts" /><Divider /><ListItem title="Notifications" /><Divider /><ListItem title="Log out" /></div>,
            dontText: 'Don’t draw a line under every row. Log out no longer stands apart from the rest.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', padding: 'var(--space-2xs)', borderRadius: 'var(--radius-control)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-surface)' }}><IconButton size="sm" icon="edit-02" label="Edit" /><IconButton size="sm" icon="copy-01" label="Duplicate" /><Divider vertical /><IconButton size="sm" icon="share-08" label="Share" /><IconButton size="sm" icon="link-01" label="Copy link" /></div>,
        doText: 'Split a toolbar into groups of related actions.',
        dont: <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', padding: 'var(--space-2xs)', borderRadius: 'var(--radius-control)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-surface)' }}><IconButton size="sm" icon="edit-02" label="Edit" /><Divider vertical /><IconButton size="sm" icon="copy-01" label="Duplicate" /><Divider vertical /><IconButton size="sm" icon="share-08" label="Share" /><Divider vertical /><IconButton size="sm" icon="link-01" label="Copy link" /></div>,
        dontText: 'Don’t put a line between every button. Nothing is grouped, so the lines add noise and no meaning.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 260, padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-subtle)', background: 'var(--bg-surface)', font: '400 15px/20px var(--font-display)', color: 'var(--text-secondary)' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>$68.00</span></div><Divider /><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}><span>Total</span><span>$68.00</span></div></div>,
        doText: 'Use a Divider inside a card, between its parts.',
        dont: <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 260 }}><div style={{ display: 'grid', gap: 'var(--space-sm)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-subtle)', background: 'var(--bg-surface)', font: '400 15px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Divider /><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>$68.00</span></div><Divider /></div><Divider /></div>,
        dontText: 'Don’t line the edges of a card that already has a border. The doubled lines look like a rendering bug.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Reviews</span><span style={{ font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>Clean layers and great docs. Saved me a week.</span></div>,
        doText: 'Let the heading’s size and space lead into the section.',
        dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Reviews</span><Divider /><span style={{ font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>Clean layers and great docs. Saved me a week.</span></div>,
        dontText: 'Don’t underline headings with a Divider. It cuts the heading off from the content it introduces.',
      },
    ],
    content: [
      'A Divider has no text. If a group needs a name, use a heading or a section label instead.',
      'Keep dividers inside a container the same width as its content. Don’t let one line run wider than the rows around it.',
      'Use the same gap above and below a Divider so it sits in the middle of the break.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Skips the divider, which is not focusable.']],
    notes: [
      'Renders a native <hr>, which screen readers announce as a separator. Vertical dividers add aria-orientation="vertical".',
      'border-subtle is a decorative contrast. Never rely on a Divider alone to show that something belongs to a group or is selected.',
      'In a toolbar, a role="toolbar" wrapper with its own label helps screen readers understand the groups. For a purely visual line, pass aria-hidden="true" so it isn’t announced.',
    ],
  },

  related: ['list-item', 'button-group', 'dropdown-menu'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Divider passes native attributes such as aria-hidden and style to the hr.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Divider in React and HTML/CSS (horizontal and vertical), using border-subtle.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Divider color moved to the pure-grey border-subtle.' },
  ],
};
