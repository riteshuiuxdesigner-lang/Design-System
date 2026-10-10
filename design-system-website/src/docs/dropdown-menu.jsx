// Menus open on click. In the Usage tab we show them already open, using the same
// classes the component renders, so each do and don't is visible without clicking.
const OpenMenu = ({ label, items }) => (
  <div style={{ display: 'grid', gap: 'var(--space-xs)', justifyItems: 'start' }}>
    <Button variant="secondary" trailingIcon="arrow-down-01" aria-expanded="true">{label || 'Actions'}</Button>
    <div className="mds-menu" role="menu" style={{ position: 'static' }}>
      {items.map((it, i) => it.divider
        ? <hr key={i} className="mds-divider mds-menu__divider" />
        : (
          <button key={i} type="button" role="menuitem" disabled={it.disabled} className={'mds-menu__item' + (it.destructive ? ' mds-menu__item--danger' : '')}>
            {it.icon ? <Icon name={it.icon} size={20} /> : null}
            <span className="mds-menu__label">{it.label}</span>
            {it.shortcut ? <span className="mds-menu__kbd">{it.shortcut}</span> : null}
          </button>
        ))}
    </div>
  </div>
);

export default {
  id: 'dropdown-menu',
  name: 'Dropdown menu',
  group: 'Overlays',
  order: 4,
  status: 'Stable',
  figma: '43:137',
  exports: ['DropdownMenu'],
  summary: 'A pill trigger that springs open a short list of actions, like editing, duplicating or deleting a listing. It keeps secondary actions one click away without crowding the page.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass items with a label, an icon and onSelect. The trigger is a Secondary button with a chevron. Selecting an item runs it and closes the menu.',
      ...ex(`
<div style={{ minHeight: 300 }}>
  <DropdownMenu
    label="Manage listing"
    items={[
      { label: 'Edit listing', icon: 'edit-02', onSelect: () => {} },
      { label: 'Duplicate', icon: 'copy-01', onSelect: () => {} },
      { label: 'Share', icon: 'share-08', onSelect: () => {} },
      { divider: true },
      { label: 'Delete listing', icon: 'delete-02', destructive: true, onSelect: () => {} },
    ]}
  />
</div>`),
    },
    {
      title: 'With shortcuts',
      desc: 'Add shortcut to show the keyboard shortcut on the right in text-muted. Only show shortcuts the page really supports.',
      ...ex(`
<div style={{ minHeight: 260 }}>
  <DropdownMenu
    label="Edit"
    items={[
      { label: 'Copy link', icon: 'link-01', shortcut: '⌘L', onSelect: () => {} },
      { label: 'Duplicate', icon: 'copy-01', shortcut: '⌘D', onSelect: () => {} },
      { label: 'Download files', icon: 'download-01', shortcut: '⌘S', onSelect: () => {} },
    ]}
  />
</div>`),
    },
    {
      title: 'Disabled item',
      desc: 'Disable an item when it exists but can’t run yet, and put the reason in the label. Hide it instead if it never applies.',
      ...ex(`
<div style={{ minHeight: 240 }}>
  <DropdownMenu
    label="Payouts"
    items={[
      { label: 'Download statement', icon: 'download-01', onSelect: () => {} },
      { label: 'Request payout (from $100)', icon: 'dollar-01', disabled: true },
    ]}
  />
</div>`),
    },
    {
      title: 'Trigger variants',
      desc: 'triggerVariant takes any Button variant. Use Ghost or Tertiary in toolbars and above grids, and keep Secondary as the default.',
      ...ex(`
<div style={{ minHeight: 260, display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
  <DropdownMenu label="Export" triggerVariant="tertiary" items={[
    { label: 'Export as CSV', icon: 'file-01', onSelect: () => {} },
    { label: 'Export as PDF', icon: 'file-01', onSelect: () => {} },
  ]} />
  <DropdownMenu label="More" triggerVariant="ghost" items={[
    { label: 'Report listing', icon: 'alert-02', onSelect: () => {} },
    { label: 'Copy link', icon: 'link-01', onSelect: () => {} },
  ]} />
</div>`),
    },
    {
      title: 'Sort a grid',
      desc: 'Put the current choice in the trigger label, so people see the sort without opening the menu.',
      ...ex(`function Example() {
  const [sort, setSort] = useState('Newest');
  const options = ['Newest', 'Best selling', 'Price: low to high', 'Price: high to low'];
  return (
    <div style={{ minHeight: 300, display: 'grid', gap: 'var(--space-sm)', alignContent: 'start' }}>
      <DropdownMenu
        label={'Sort: ' + sort}
        triggerVariant="ghost"
        items={options.map(o => ({ label: o, icon: o === sort ? 'tick-02' : 'arrow-up-down', onSelect: () => setSort(o) }))}
      />
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>{'Showing 248 UI kits, sorted by ' + sort.toLowerCase()}</span>
    </div>
  );
}`),
    },
    {
      title: 'On a listing row',
      desc: 'In a seller dashboard, each row keeps one visible action and puts the rest behind a “more” icon. Pass icon for an IconButton trigger (label becomes its aria-label) and align="end" so the menu lines up with the right edge of the row. Confirm what happened with a Toast.',
      stage: 'muted',
      ...ex(`function Example() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  return (
    <div style={{ minHeight: 340, width: 480, display: 'grid', gap: 'var(--space-md)', alignContent: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
        <Avatar initials="OU" color="pop-violet" />
        <div style={{ flex: 1, display: 'grid' }}>
          <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI Kit</span>
          <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Published · 1,204 sales</span>
        </div>
        <Button variant="secondary" size="sm" leadingIcon="edit-02" onClick={() => setMessage('Opened the editor')}>Edit</Button>
        <DropdownMenu
          icon="more-horizontal"
          label="More actions for Orbit UI Kit"
          align="end"
          items={[
            { label: 'View analytics', icon: 'analytics-01', onSelect: () => setMessage('Opened analytics') },
            { label: 'Duplicate', icon: 'copy-01', onSelect: () => setMessage('Duplicated as a draft') },
            { divider: true },
            { label: 'Unpublish', icon: 'view-off', destructive: true, onSelect: () => setMessage('Unpublished') },
          ]}
        />
      </div>
      {message && <div><Toast message={message} onDismiss={() => setMessage('')} /></div>}
    </div>
  );
}`),
    },
  ],

  props: {
    DropdownMenu: [
      ['label', 'string', "'Actions'", 'Trigger label, and the menu’s aria-label. Name the object or the choice: “Manage listing”, “Sort: Newest”. With icon, it becomes the IconButton’s aria-label.'],
      ['icon', 'IconName', '', 'Renders an IconButton trigger with this icon instead of a labelled Button, like “more-horizontal”.'],
      ['triggerVariant', "'primary' | 'secondary' | 'tertiary' | 'ghost'", "'secondary'", 'Variant of the trigger. Defaults to ghost when icon is set. The text trigger always has an arrow-down-01 chevron.'],
      ['align', "'start' | 'end'", "'start'", 'start lines the menu up with the trigger’s left edge; end with its right edge. Use end for triggers at the right of a row.'],
      ['items', 'MenuItem[]', '', 'The menu rows, in order. See the item fields below.'],
      ['items[].label', 'string', '', 'Item text. Start with a verb.'],
      ['items[].icon', 'IconName', '', '20px icon before the label, in icon-secondary.'],
      ['items[].shortcut', 'string', '', 'Shortcut shown on the right, like “⌘D”.'],
      ['items[].destructive', 'boolean', 'false', 'Red text and icon (feedback-error-text) for delete and remove.'],
      ['items[].disabled', 'boolean', 'false', 'Greys out the row and blocks the click.'],
      ['items[].onSelect', '() => void', '', 'Runs when the item is chosen. The menu closes first.'],
      ['items[].divider', 'boolean', 'false', 'Renders a hairline divider instead of an item.'],
    ],
  },

  usage: {
    when: [
      'For 2–7 secondary actions on one object, like a listing or an order.',
      'To pick one option that changes the view, like sort order.',
    ],
    whenNot: [
      'For the main action. Show it as a Button.',
      'For one action. Show the Button itself.',
      'To choose a value in a form. Use a Select.',
      'For explanations. Use a Popover.',
    ],
    anatomy: {
      render: (
        <OpenMenu label="Manage listing" items={[
          { label: 'Edit listing', icon: 'edit-02', shortcut: '⌘E' },
          { label: 'Duplicate', icon: 'copy-01' },
          { divider: true },
          { label: 'Delete listing', icon: 'delete-02', destructive: true },
        ]} />
      ),
      parts: [
        'Trigger: a Button (Secondary by default) with a trailing arrow-down-01, or an IconButton when icon is set. Sets aria-haspopup="menu", aria-expanded and aria-controls.',
        'Panel: bg-raised, 1px border-elevation, radius-lg, elevation-2, padded with space-xs, at least 224px wide. Opens space-xs below the trigger and springs in from 0.9.',
        'Item: pill row (radius-control), size-control-md (44px) tall, Inter Display Medium 15/20, with a 20px icon in icon-secondary. bg-hover on hover and focus.',
        'Shortcut (optional): caption Medium in text-muted, on the right.',
        'Divider: 1px border-subtle with space-xs above and below. Separates destructive items.',
        'Destructive item: feedback-error-text for the label and icon.',
      ],
    },
    sections: [
      {
        title: 'Destructive items',
        body: 'Put delete and remove at the bottom, after a divider, so people don’t hit them by accident. If the action can’t be undone, the item opens a Modal to confirm.',
        dos: [
          {
            do: (
              <OpenMenu label="Manage listing" items={[
                { label: 'Edit listing', icon: 'edit-02' },
                { label: 'Duplicate', icon: 'copy-01' },
                { divider: true },
                { label: 'Delete listing', icon: 'delete-02', destructive: true },
              ]} />
            ),
            doText: 'Put destructive items last, after a divider.',
            dont: (
              <OpenMenu label="Manage listing" items={[
                { label: 'Edit listing', icon: 'edit-02' },
                { label: 'Delete listing', icon: 'delete-02' },
                { label: 'Duplicate', icon: 'copy-01' },
              ]} />
            ),
            dontText: 'Don’t mix Delete in with safe actions in the same color. It is one slip away from Edit.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <OpenMenu label="Order #4821" items={[
            { label: 'Download files', icon: 'download-01' },
            { label: 'Download invoice', icon: 'file-01' },
            { label: 'Ask for a refund', icon: 'refresh' },
          ]} />
        ),
        doText: 'Start each item with a verb, in a few words.',
        dont: (
          <OpenMenu label="Order #4821" items={[
            { label: 'Files', icon: 'download-01' },
            { label: 'Here you can get the invoice', icon: 'file-01' },
            { label: 'Refund?', icon: 'refresh' },
          ]} />
        ),
        dontText: 'Don’t mix nouns, sentences and questions. People can’t scan for the action they want.',
      },
      {
        do: <Button variant="secondary" leadingIcon="edit-02">Edit listing</Button>,
        doText: 'Show a single action as a Button.',
        dont: <OpenMenu label="Actions" items={[{ label: 'Edit listing', icon: 'edit-02' }]} />,
        dontText: 'Don’t hide one action in a menu. It costs an extra click and a vague “Actions” label.',
      },
      {
        do: (
          <OpenMenu label="Share" items={[
            { label: 'Copy link', icon: 'link-01' },
            { label: 'Send by email', icon: 'mail-01' },
            { label: 'Send in a message', icon: 'message-01' },
          ]} />
        ),
        doText: 'Give every item an icon, or none of them.',
        dont: (
          <OpenMenu label="Share" items={[
            { label: 'Copy link', icon: 'link-01' },
            { label: 'Send by email' },
            { label: 'Send in a message', icon: 'sparkles' },
          ]} />
        ),
        dontText: 'Don’t mix rows with and without icons, or pick icons for decoration. The labels stop lining up.',
      },
    ],
    content: [
      'Trigger: name the object or show the current choice. “Manage listing”, “Sort: Newest”. Avoid “Actions” when you can.',
      'Items: verb first, sentence case, 1–3 words. “Edit listing”, “Download invoice”.',
      'Order items by how often people use them, with destructive items last.',
      'Disabled items say why in the label: “Request payout (from $100)”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Enter / Space', 'On the trigger, opens the menu and focuses the first item. On an item, runs it, closes the menu and returns focus to the trigger.'],
      ['↓ / ↑', 'Moves to the next or previous item, wrapping at the ends. Disabled items are skipped.'],
      ['Home / End', 'Moves to the first or last item.'],
      ['Escape', 'Closes the menu and returns focus to the trigger.'],
      ['Tab', 'Closes the menu and moves on to the next control.'],
    ],
    notes: [
      'The trigger has aria-haspopup="menu", aria-expanded and aria-controls. The panel has role="menu" with an aria-label from label, and each row role="menuitem".',
      'Icon-only triggers use label as their aria-label, so write the full name: “More actions for Orbit UI Kit”.',
      'Clicking outside the menu closes it.',
      'Items are 44px tall, which meets the touch target. The focused item gets bg-hover and shadow-focus-ring.',
      'Destructive items use red text and a delete icon, so color is never the only signal.',
      'The panel springs in over 200ms. Under prefers-reduced-motion it appears at once.',
    ],
  },

  related: ['button', 'popover', 'select', 'modal'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added arrow-key, Home and End navigation, focus on open and return on close, aria-controls and a menu label, plus the icon and align props.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Dropdown menu in React and HTML/CSS, matching the Figma component (icons, shortcuts, dividers, destructive and disabled items).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Menu items became pills with a spring open.' },
  ],
};
