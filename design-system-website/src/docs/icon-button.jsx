export default {
  id: 'icon-button',
  name: 'Icon button',
  group: 'Actions',
  order: 2,
  status: 'Stable',
  figma: '17:362',
  exports: ['IconButton'],
  summary: 'A round button with only an icon, for actions people already recognise: save, share, close, more. The label you pass becomes its accessible name and tooltip.',

  examples: [
    {
      title: 'Variants',
      desc: 'Ghost is the default and sits quietly in toolbars and card corners. Use Secondary on top of images, Tertiary for a soft filled button, and Primary only when the icon is the main action in a small space.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
  <IconButton icon="more-horizontal" label="More actions" />
  <IconButton variant="secondary" icon="share-08" label="Share listing" />
  <IconButton variant="tertiary" icon="filter-horizontal" label="Filters" />
  <IconButton variant="primary" icon="add-01" label="New listing" />
</div>`),
    },
    {
      title: 'Sizes',
      desc: 'Medium (44px, 20px icon) is the default and meets the touch target. Large (52px) takes a 24px icon for mobile headers. Small (36px, 16px icon) is only for dense desktop UI such as table rows and calendars.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
  <IconButton size="sm" variant="secondary" icon="edit-02" label="Edit listing" />
  <IconButton variant="secondary" icon="edit-02" label="Edit listing" />
  <IconButton size="lg" variant="secondary" icon="edit-02" label="Edit listing" />
</div>`),
    },
    {
      title: 'Toggle',
      desc: 'Pass selected to make an on/off button such as Save. It sets aria-pressed and switches to the selected fill. Change the label too, so it always says what pressing it will do.',
      ...ex(`function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <IconButton
      variant="secondary"
      icon="favourite"
      label={saved ? 'Remove from saved' : 'Save Orbit UI kit'}
      selected={saved}
      onClick={() => setSaved(!saved)}
    />
  );
}`),
    },
    {
      title: 'Loading',
      desc: 'Loading swaps the icon for a spinner and keeps the size, so nothing around it moves. It also sets aria-busy and disables the button, so it can’t be pressed twice.',
      ...ex(`function Example() {
  const [syncing, setSyncing] = useState(false);
  function sync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1600);
  }
  return (
    <IconButton
      variant="secondary"
      icon="refresh"
      label={syncing ? 'Refreshing sales' : 'Refresh sales'}
      loading={syncing}
      onClick={sync}
    />
  );
}`),
    },
    {
      title: 'Disabled',
      desc: 'A disabled icon button gives no reason on its own. Only disable it when the reason is visible nearby, such as the first page of a list.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <IconButton size="sm" variant="secondary" icon="arrow-left-01" label="Previous page" disabled />
  <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Page 1 of 12</span>
  <IconButton size="sm" variant="secondary" icon="arrow-right-01" label="Next page" />
</div>`),
    },
    {
      title: 'In a listing toolbar',
      desc: 'Group icon buttons for related actions on one object. Keep it to three or four, put the destructive one last, and move the rest into a More menu.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-sm) var(--space-sm) var(--space-sm) var(--space-lg)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-control)' }}>
  <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI kit</span>
  <div style={{ display: 'flex', gap: 4 }}>
    <IconButton size="sm" icon="edit-02" label="Edit listing" />
    <IconButton size="sm" icon="copy-01" label="Duplicate listing" />
    <IconButton size="sm" icon="share-08" label="Share listing" />
    <IconButton size="sm" icon="delete-02" label="Delete listing" />
  </div>
</div>`),
    },
  ],

  props: {
    IconButton: [
      ['icon', 'IconName', '', 'The icon to show. Pick one people recognise without a label.'],
      ['label', 'string', '', 'Required. Becomes aria-label and the native tooltip (title). Start with a verb: “Save Orbit UI kit”.'],
      ['variant', "'ghost' | 'secondary' | 'tertiary' | 'primary' | 'destructive'", "'ghost'", 'Visual weight. Ghost for toolbars, Secondary on images.'],
      ['size', "'sm' | 'md' | 'lg'", "'md'", 'Square 36 / 44 / 52px with a 16 / 20 / 24px icon. Small is for dense desktop UI only.'],
      ['selected', 'boolean', '', 'Makes it a toggle. Sets aria-pressed and the selected fill. Leave it out for a normal button.'],
      ['loading', 'boolean', 'false', 'Shows a spinner in place of the icon, sets aria-busy and disables the button until it ends.'],
      ['disabled', 'boolean', 'false', 'Native disabled. Explain why nearby.'],
      ['...rest', 'ButtonHTMLAttributes', '', 'Any native button attribute: onClick, type, aria-*, style.'],
    ],
  },

  usage: {
    when: [
      'For actions with a well-known icon: save, share, close, more, edit, delete.',
      'In tight spaces where a text label won’t fit: card corners, table rows, toolbars, headers.',
      'To toggle something on and off, like saving a listing to favourites.',
    ],
    whenNot: [
      'When the action isn’t obvious from the icon. Use a Button with a text label.',
      'For the main action on a page, like Buy or Publish. Use a Primary Button.',
      'To go to another page. Use a Link.',
    ],
    anatomy: {
      render: <IconButton variant="secondary" icon="favourite" label="Save Orbit UI kit" />,
      parts: [
        'Container: circle (radius-control), 44 × 44px by default (size-control-md).',
        'Icon: 20px Hugeicons stroke, inherits the text color of the variant.',
        'Accessible name: the label prop, read by screen readers and shown as a tooltip on hover.',
        'Focus ring: shadow-focus-ring, shows on keyboard focus only.',
      ],
    },
    sections: [
      {
        title: 'Choosing an icon',
        body: 'An icon button works only when people can guess the action from the icon alone. If you need the tooltip to explain it, use a Button with a label instead.',
        dos: [
          {
            do: <div style={{ display: 'flex', gap: 8 }}><IconButton variant="secondary" icon="share-08" label="Share listing" /><IconButton variant="secondary" icon="favourite" label="Save listing" /></div>,
            doText: 'Use icons with one clear meaning, like share and save.',
            dont: <div style={{ display: 'flex', gap: 8 }}><IconButton variant="secondary" icon="sparkles" label="Generate preview images" /><IconButton variant="secondary" icon="layers-01" label="Manage bundles" /></div>,
            dontText: 'Don’t use an icon nobody can guess. Sparkles and layers could mean almost anything.',
          },
          {
            do: <Button variant="secondary" leadingIcon="sparkles">Generate previews</Button>,
            doText: 'Use a Button with a label when the action is new or specific to your product.',
            dont: <IconButton variant="secondary" icon="sparkles" label="Generate previews" />,
            dontText: 'Don’t rely on the tooltip to explain the action. Touch screens never show it.',
          },
        ],
      },
      {
        title: 'On images',
        body: 'Icon buttons on thumbnails need a solid fill so they stay visible on any artwork. Use Secondary there, the way AssetCard does for Save.',
        dos: [
          {
            do: <div style={{ position: 'relative', width: 200, height: 120, borderRadius: 'var(--radius-xl)', background: 'var(--pop-violet)' }}><IconButton variant="secondary" size="sm" icon="favourite" label="Save Orbit UI kit" style={{ position: 'absolute', top: 8, right: 8 }} /></div>,
            doText: 'Use Secondary on images. The white fill and border hold up on any thumbnail.',
            dont: <div style={{ position: 'relative', width: 200, height: 120, borderRadius: 'var(--radius-xl)', background: 'var(--pop-violet)' }}><IconButton size="sm" icon="favourite" label="Save Orbit UI kit" style={{ position: 'absolute', top: 8, right: 8 }} /></div>,
            dontText: 'Don’t put a Ghost icon button on an image. It has no fill and gets lost in the artwork.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}><IconButton variant="secondary" icon="delete-02" label="Delete Orbit UI kit" /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Screen reader: “Delete Orbit UI kit, button”</span></div>,
        doText: 'Write a label that names the action and the object, like “Delete Orbit UI kit”.',
        dont: <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}><IconButton variant="secondary" icon="delete-02" label="" /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Screen reader: “button”</span></div>,
        dontText: 'Don’t leave the label empty. Screen readers announce only “button” and there is no tooltip.',
      },
      {
        do: <div style={{ display: 'flex', gap: 4 }}><IconButton icon="edit-02" label="Edit listing" /><IconButton icon="share-08" label="Share listing" /><IconButton icon="more-horizontal" label="More actions" /></div>,
        doText: 'Keep a row to three or four icons and put the rest behind More.',
        dont: <div style={{ display: 'flex', gap: 4 }}><IconButton icon="edit-02" label="Edit listing" /><IconButton icon="copy-01" label="Duplicate listing" /><IconButton icon="share-08" label="Share listing" /><IconButton icon="download-01" label="Download files" /><IconButton icon="analytics-01" label="View stats" /><IconButton icon="tag-01" label="Edit price" /><IconButton icon="delete-02" label="Delete listing" /></div>,
        dontText: 'Don’t line up a long row of icons. People have to hover each one to find what they need.',
      },
      {
        do: <div style={{ display: 'flex', gap: 8 }}><IconButton variant="secondary" icon="share-08" label="Share listing" /><Button>Buy for $49</Button></div>,
        doText: 'Pair icon buttons with a labelled Primary for the main action.',
        dont: <div style={{ display: 'flex', gap: 8 }}><IconButton variant="secondary" icon="share-08" label="Share listing" /><IconButton variant="primary" icon="shopping-bag-01" label="Buy for $49" /></div>,
        dontText: 'Don’t hide the main action behind an icon. A purchase needs a label and a price.',
      },
      {
        do: <IconButton size="lg" icon="menu-01" label="Open menu" />,
        doText: 'Use Medium or Large on mobile so the target is at least 44px.',
        dont: <IconButton size="sm" icon="menu-01" label="Open menu" />,
        dontText: 'Don’t use Small on touch screens. 36px is too small to tap reliably.',
      },
    ],
    content: [
      'Start the label with a verb: “Save”, “Share listing”, “Remove from saved”.',
      'Add the object when there are many on screen: “Save Orbit UI kit”, not just “Save”.',
      'For toggles, the label says what pressing it does now. Switch “Save” to “Remove from saved” once it is on.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the button and shows the focus ring.'], ['Enter / Space', 'Activates the button.']],
    notes: [
      'Uses a native <button>. The label prop becomes aria-label, so the icon itself is hidden from screen readers.',
      'The label is also set as title, which shows a native tooltip on mouse hover. Touch screens don’t show it, so the icon must be clear on its own.',
      'With selected, the button exposes aria-pressed="true" or "false" so screen readers announce it as a toggle.',
      'While loading, the button sets aria-busy="true" and is disabled, so it leaves the tab order until the action ends. Announce the result with a Toast.',
      'Medium and Large meet the 44px touch target. Small (36px) is for mouse-driven desktop UI only.',
      'Pressing squishes the button to 0.96 with a spring. Under prefers-reduced-motion, it does not move.',
    ],
  },

  related: ['button', 'button-group', 'asset-card'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'loading now sets aria-busy and disables the button automatically.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Icon button in React and HTML/CSS, matching the Figma component (5 variants × 3 sizes, with selected and loading states).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Icons moved to Hugeicons Stroke · Rounded.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Icon buttons became full circles (radius-control) with a spring press.' },
  ],
};
