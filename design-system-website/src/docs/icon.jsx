export default {
  id: 'icon',
  name: 'Icon',
  group: 'Media',
  order: 1,
  status: 'Stable',
  exports: ['Icon'],
  summary: 'Hugeicons Pro, drawn inline in currentColor. Use Stroke·Rounded for every interface icon, and Twotone·Rounded only for highlights such as feature callouts, empty states, onboarding and pricing perks.',

  examples: [
    {
      title: 'Stroke (default)',
      desc: 'Stroke·Rounded is the default for every icon in the interface: buttons, inputs, menus, navigation and meta. Icons take the text color around them.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', flexWrap: 'wrap', color: 'var(--icon-primary)' }}>
  <Icon name="search-01" />
  <Icon name="shopping-bag-01" />
  <Icon name="favourite" />
  <Icon name="upload-01" />
  <Icon name="notification-01" />
  <Icon name="settings-01" />
  <Icon name="share-08" />
  <Icon name="download-01" />
</div>`),
    },
    {
      title: 'Twotone for highlights',
      desc: 'Set variant="twotone" when something should feel special: Pro plan perks, an onboarding checklist, an empty state. Tint it with focus-ring (brand blue) or icon-primary. Keep it out of controls.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-md)', width: 320, padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <span style={{ font: '600 18px/24px var(--font-display)', color: 'var(--text-primary)' }}>Pro creator perks</span>
  {[
    { icon: 'crown', text: 'Featured on the Creators page' },
    { icon: 'analytics-01', text: 'Sales analytics by asset' },
    { icon: 'dollar-01', text: 'Weekly payouts, no minimum' },
    { icon: 'license', text: 'Extended licenses for your buyers' },
  ].map(perk => (
    <div key={perk.icon} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', font: '500 15px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
      <Icon name={perk.icon} variant="twotone" size={24} color="var(--focus-ring)" />
      {perk.text}
    </div>
  ))}
</div>`),
    },
    {
      title: 'Sizes',
      desc: 'Use 16 (size-icon-sm) in dense rows, meta and small buttons, 20 (size-icon-md) as the default, and 24 (size-icon-lg) for mobile navigation, highlights and empty states.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'flex-end', color: 'var(--icon-primary)' }}>
  {[16, 20, 24].map(size => (
    <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-xs)' }}>
      <Icon name="rocket-01" size={size} />
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>{size + 'px'}</span>
    </div>
  ))}
</div>`),
    },
    {
      title: 'Color',
      desc: 'Icons inherit currentColor, so they match their label without extra work. To set a color, pass an icon token to color. On a pop sticker, use icon-on-pop.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center', flexWrap: 'wrap' }}>
  <Icon name="user" color="var(--icon-primary)" />
  <Icon name="user" color="var(--icon-secondary)" />
  <Icon name="user" color="var(--icon-muted)" />
  <Icon name="checkmark-circle-02" color="var(--feedback-success-icon)" />
  <Icon name="alert-circle" color="var(--feedback-error-icon)" />
  <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-avatar-md)', height: 'var(--size-avatar-md)', borderRadius: 'var(--radius-full)', background: 'var(--pop-yellow)', color: 'var(--icon-on-pop)', transform: 'rotate(-6deg)' }}>
    <Icon name="sparkles" />
  </span>
</div>`),
    },
    {
      title: 'Meaningful icons',
      desc: 'Icons are hidden from screen readers by default, because a label next to them says the same thing. When an icon stands alone and carries meaning, pass label so it is announced.',
      ...ex(`
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>
  Mira Okafor
  <Icon name="crown" size={16} color="var(--focus-ring)" label="Top creator" />
</div>`),
    },
    {
      title: 'All 72 icons',
      desc: 'The curated set in both styles. Icon.names lists every name. Need another icon? Take it from the Hugeicons Pro Figma file in the same style and add it to the set.',
      stage: 'flush',
      ...ex(`function Example() {
  const [variant, setVariant] = useState('stroke');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
      <Tabs
        label="Icon style"
        value={variant}
        onChange={setVariant}
        items={[
          { value: 'stroke', label: 'Stroke' },
          { value: 'twotone', label: 'Twotone' },
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 'var(--space-xs)' }}>
        {Icon.names.map(name => (
          <div key={name} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--space-xs)', padding: 'var(--space-md) var(--space-xs)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-subtle)', color: variant === 'twotone' ? 'var(--focus-ring)' : 'var(--icon-primary)' }}>
            <Icon name={name} variant={variant} size={24} />
            <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-word' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`),
    },
  ],

  props: {
    Icon: [
      ['name', 'IconName', '', 'One of Icon.names (72 icons). An unknown name falls back to help-circle.'],
      ['variant', "'stroke' | 'twotone'", "'stroke'", 'Stroke·Rounded for interface icons. Twotone·Rounded only for highlights.'],
      ['size', 'number', '20', 'Width and height in px. Use 16, 20 or 24 (size-icon-sm / md / lg).'],
      ['color', 'string', '', 'Any CSS color, set as the SVG’s color. Use a token: var(--icon-secondary). Without it, the icon inherits currentColor.'],
      ['label', 'string', '', 'Accessible name. Sets role="img" and aria-label. Without it, the icon is aria-hidden.'],
      ['style', 'CSSProperties', '', 'Inline styles on the svg, merged with color. Use tokens, for example for a margin.'],
      ['className', 'string', '', 'Extra class on the svg.'],
    ],
  },

  usage: {
    when: [
      'Next to a label, to help people scan buttons, menus, navigation and meta rows.',
      'In Icon Buttons for well-known actions (search, close, more), always with a label.',
      'Twotone: to make a highlight feel special, such as plan perks, onboarding steps and empty states.',
    ],
    whenNot: [
      'As the only way to say something important. Add a word.',
      'Twotone inside buttons, inputs, menus, tabs or navigation. Those stay Stroke.',
      'For decoration that adds no meaning. Leave the space empty.',
      'Icons from another set. Take new ones from the Hugeicons Pro Figma file.',
    ],
    anatomy: {
      render: (
        <div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'center' }}>
          <Icon name="rocket-01" size={64} color="var(--icon-primary)" />
          <Icon name="rocket-01" variant="twotone" size={64} color="var(--focus-ring)" />
        </div>
      ),
      parts: [
        'Grid: 24 × 24 viewBox, scaled by size (16, 20 or 24).',
        'Stroke·Rounded: one outline with rounded ends and corners, filled with currentColor.',
        'Twotone·Rounded: the same outline plus a tone layer at 40% opacity in the same color.',
        'Color: currentColor by default. Set it with icon-* tokens, focus-ring for highlights, or icon-on-pop on a sticker.',
      ],
    },
    sections: [
      {
        title: 'Stroke or twotone',
        body: 'Stroke is the quiet default that sits with text. Twotone is louder, so it only works when it is rare. Use it where you want people to pause and feel something is special: perks, achievements, onboarding and empty states.',
        dos: [
          {
            do: <div style={{ display: 'flex', gap: 'var(--space-xs)' }}><Button size="sm" variant="secondary" leadingIcon="edit-02">Edit</Button><Button size="sm" variant="secondary" leadingIcon="copy-01">Duplicate</Button><Button size="sm" variant="secondary" leadingIcon="share-08">Share</Button></div>,
            doText: 'Use Stroke icons in every control.',
            dont: <div style={{ display: 'flex', gap: 'var(--space-xs)' }}><Button size="sm" variant="secondary"><Icon name="edit-02" variant="twotone" size={16} />Edit</Button><Button size="sm" variant="secondary"><Icon name="copy-01" variant="twotone" size={16} />Duplicate</Button><Button size="sm" variant="secondary"><Icon name="share-08" variant="twotone" size={16} />Share</Button></div>,
            dontText: 'Don’t put Twotone icons in a row of controls. They look heavy and compete with the labels.',
          },
          {
            do: <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 280, padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}><span style={{ font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}>Pro creator perks</span><div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="crown" variant="twotone" size={24} color="var(--focus-ring)" />Featured placement</div><div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="dollar-01" variant="twotone" size={24} color="var(--focus-ring)" />Weekly payouts</div></div>,
            doText: 'Use Twotone in a highlight callout, tinted with focus-ring.',
            dont: <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 280, padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}><span style={{ font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}>Pro creator perks</span><div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="crown" variant="twotone" size={24} color="var(--pop-yellow)" />Featured placement</div><div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="dollar-01" variant="twotone" size={24} color="var(--pop-pink)" />Weekly payouts</div></div>,
            dontText: 'Don’t tint icons with pop colors. They fade into white surfaces. Pop colors are for sticker fills, not icon strokes.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'flex', gap: 'var(--space-xs)' }}><Button variant="secondary" leadingIcon="license">License</Button><Button variant="secondary" leadingIcon="layers-01">Variants</Button></div>,
        doText: 'Pair an icon with a label when its meaning isn’t obvious.',
        dont: <div style={{ display: 'flex', gap: 'var(--space-xs)' }}><IconButton variant="secondary" icon="license" label="License" /><IconButton variant="secondary" icon="layers-01" label="Variants" /></div>,
        dontText: 'Don’t show an ambiguous icon alone. Few people will guess “License” and “Variants” from these shapes.',
      },
      {
        do: <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="download-01" size={16} />1.2k</span><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="star" size={16} />4.8</span><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="file-01" size={16} />.fig</span></div>,
        doText: 'Use one size per row. 16px fits 12px meta text.',
        dont: <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="download-01" size={24} />1.2k</span><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="star" size={16} />4.8</span><span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center' }}><Icon name="file-01" size={20} />.fig</span></div>,
        dontText: 'Don’t mix sizes in a row. The row looks uneven and the big icon seems more important.',
      },
      {
        do: <span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--feedback-success-text)' }}><Icon name="checkmark-circle-02" size={16} />Payout sent</span>,
        doText: 'Put a word next to a status icon.',
        dont: <Icon name="checkmark-circle-02" color="var(--feedback-success-icon)" />,
        dontText: 'Don’t use an icon and its color as the only signal. A green circle means nothing to a screen reader or to someone who can’t see green.',
      },
    ],
    content: [
      'Let icons inherit currentColor so they always match their label, including hover and disabled states.',
      'Use one icon per meaning across the product. favourite always means Save.',
      'Put the icon before the label, or after it when it shows direction (arrow-right-01).',
      'Only the 72 curated names exist in code. Check Icon.names before you design with a new one.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Skips the icon, which is not focusable. Put it inside a Button, IconButton or Link to make it interactive.']],
    notes: [
      'Without label, the svg has aria-hidden="true", so it is skipped. The visible text does the work.',
      'With label, it gets role="img" and aria-label. Use this only when the icon stands alone and carries meaning.',
      'Icon colors from icon-primary and icon-secondary meet 3:1 against bg-surface. icon-muted is for decoration next to text.',
      'Icons never animate on their own, so there is nothing to turn off under reduced motion.',
    ],
  },

  related: ['icon-button', 'button', 'empty-state'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Icon accepts style, merged with color.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Icon in React and HTML/CSS with the 72 curated Hugeicons Pro icons in Stroke·Rounded and Twotone·Rounded.' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Icons moved to Hugeicons Pro Stroke·Rounded as the default, with Twotone·Rounded for highlights.' },
  ],
};
