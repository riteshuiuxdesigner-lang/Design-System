// Popover opens on click. In the Usage tab we show the panel already open, using the
// same classes the component renders, so each do and don't is visible without clicking.
const OpenPopover = ({ trigger, title, children, width }) => (
  <div style={{ display: 'grid', gap: 'var(--space-xs)', justifyItems: 'start', width: width || 280 }}>
    {trigger}
    <div className="mds-popover-panel" role="dialog" style={{ width: '100%', boxSizing: 'border-box' }}>
      {title ? <div className="mds-alert__title">{title}</div> : null}
      <div className="mds-popover__body">{children}</div>
    </div>
  </div>
);

export default {
  id: 'popover',
  name: 'Popover',
  group: 'Overlays',
  order: 3,
  status: 'Stable',
  figma: '46:205',
  exports: ['Popover'],
  summary: 'A small raised panel that opens under a control when people click it. It holds extra detail that would clutter the page, like what a license covers or how fees work, and can include a link.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass a Button as trigger, a short title and the body as children. Clicking the trigger opens the panel below it; clicking again, clicking outside or pressing Escape closes it.',
      ...ex(`
<div style={{ minHeight: 280 }}>
  <Popover trigger={<Button variant="secondary" leadingIcon="license">Commercial license</Button>} title="What it covers">
    Use Orbit UI Kit in client work and in products you sell. You can’t resell the kit itself. <Link href="#">Compare licenses</Link>
  </Popover>
</div>`),
    },
    {
      title: 'From a help icon',
      desc: 'A help IconButton next to a value can open a Popover with the explanation. Unlike a Tooltip, it stays open and can hold a link.',
      ...ex(`
<div style={{ minHeight: 280 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', font: '500 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>
    <span>Marketplace fee: 12%</span>
    <Popover trigger={<IconButton size="sm" icon="help-circle" label="How fees work" />} title="How fees work">
      We take 12% of each sale to cover payments, hosting and buyer support. On a $49 sale you get $43.12. <Link href="#">See fee examples</Link>
    </Popover>
  </div>
</div>`),
    },
    {
      title: 'Without a title',
      desc: 'Leave out title when the body is one sentence and the trigger already names the topic. Pass label so the panel still has a name for screen readers.',
      ...ex(`
<div style={{ minHeight: 220 }}>
  <Popover label="Delivery" trigger={<Button variant="tertiary" size="sm" trailingIcon="arrow-down-01">Delivery</Button>}>
    Files download right after payment. You get updates for free for 12 months.
  </Popover>
</div>`),
    },
    {
      title: 'Creator preview',
      desc: 'A Popover can show a small preview with one action. Keep it to a few lines; link to the full profile for the rest.',
      ...ex(`
<div style={{ minHeight: 300 }}>
  <Popover label="Mira Okafor" trigger={<Button variant="ghost" leadingIcon="user">Mira Okafor</Button>}>
    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Avatar initials="MO" color="pop-violet" />
        <div style={{ display: 'grid' }}>
          <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor</span>
          <Rating value={4.9} count={312} size="sm" />
        </div>
      </div>
      <span>UI kits and dashboard templates. 24 listings, 3,140 sales.</span>
      <Button variant="secondary" size="sm">Follow</Button>
    </div>
  </Popover>
</div>`),
    },
    {
      title: 'Price breakdown at checkout',
      desc: 'Next to a total, a Popover can show how it adds up, without pushing the Buy button down the page.',
      stage: 'muted',
      ...ex(`
<div style={{ minHeight: 300, width: 320, display: 'grid', gap: 'var(--space-md)', alignContent: 'start' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '600 17px/24px var(--font-display)', color: 'var(--text-primary)' }}>
    <span>Total</span>
    <Popover trigger={<Button variant="ghost" size="sm" trailingIcon="arrow-down-01">$85.32</Button>} title="How your total adds up">
      <div style={{ display: 'grid', gap: 'var(--space-2xs)', fontVariantNumeric: 'tabular-nums' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Commercial license</span><span>$79.00</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>VAT (8%)</span><span>$6.32</span></div>
      </div>
    </Popover>
  </div>
  <Button size="lg" style={{ width: '100%' }}>Buy for $85.32</Button>
</div>`),
    },
  ],

  props: {
    Popover: [
      ['trigger', 'ReactElement', '', 'The control that opens it. Use a Button or IconButton. Popover adds aria-expanded, aria-haspopup="dialog", aria-controls and the click handler; the trigger’s own onClick still runs.'],
      ['title', 'string', '', 'Optional bold first line in text-primary. Also the panel’s aria-label.'],
      ['label', 'string', '', 'aria-label for the panel when there is no title.'],
      ['children', 'ReactNode', '', 'The body. Short text, a link, or a small preview with one action.'],
    ],
  },

  usage: {
    when: [
      'To explain a term, fee or license next to where it appears, when the explanation needs a link or more than one line.',
      'To show a small preview, like a creator’s profile, with one action.',
      'To show how a number adds up, like a checkout total.',
    ],
    whenNot: [
      'For a one-line label on an icon button. Use a Tooltip.',
      'For a list of actions. Use a Dropdown Menu.',
      'For forms or decisions. Use a Modal or a Drawer.',
      'For information everyone needs. Put it on the page.',
    ],
    anatomy: {
      render: (
        <OpenPopover trigger={<Button variant="secondary" leadingIcon="license">Commercial license</Button>} title="What it covers">
          Use Orbit UI Kit in client work and in products you sell. <Link href="#">Compare licenses</Link>
        </OpenPopover>
      ),
      parts: [
        'Trigger: a Button or IconButton. The panel opens space-xs below it, aligned to its left edge.',
        'Panel: bg-raised, 1px border-elevation, radius-lg, elevation-2. 240–320px wide (size-popover), padded with space-md. Springs in from the top left over 200ms.',
        'Title (optional): Inter Display SemiBold 14/20 in text-primary.',
        'Body: body-sm (Inter Display 14/20) in text-secondary. Can include a Link or one small Button.',
      ],
    },
    sections: [
      {
        title: 'Popover or Tooltip',
        body: 'A Tooltip shows on hover and holds a few words. A Popover opens on click, stays open, and can hold a link or a button. When people need to read or click, use a Popover.',
        dos: [
          {
            do: (
              <OpenPopover trigger={<IconButton size="sm" variant="secondary" icon="help-circle" label="How fees work" />} title="How fees work">
                We take 12% of each sale. <Link href="#">See fee examples</Link>
              </OpenPopover>
            ),
            doText: 'Use a Popover when the explanation has a link.',
            dont: (
              <div style={{ paddingTop: 'var(--space-5xl)' }}>
                <span className="mds-tip-anchor">
                  <IconButton size="sm" variant="secondary" icon="help-circle" label="How fees work" />
                  <span role="tooltip" className="mds-tooltip mds-tooltip--top mds-tooltip--open" style={{ zIndex: 1 }}>We take 12% of each sale. <u>See fee examples</u></span>
                </span>
              </div>
            ),
            dontText: 'Don’t put a link in a Tooltip. It closes when the pointer moves toward the link.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <OpenPopover trigger={<Button variant="secondary" size="sm" leadingIcon="license">Commercial license</Button>} title="What it covers">
            Client work and products you sell. <Link href="#">Compare licenses</Link>
          </OpenPopover>
        ),
        doText: 'Keep it to a title, a sentence or two and at most one link or button.',
        dont: (
          <OpenPopover trigger={<Button variant="secondary" size="sm" leadingIcon="edit-02">Edit price</Button>} title="Edit price">
            <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
              <TextField size="sm" label="Price" defaultValue="$49" />
              <TextField size="sm" label="Sale price" placeholder="Optional" />
              <Button size="sm">Save</Button>
            </div>
          </OpenPopover>
        ),
        dontText: 'Don’t put a form in a Popover. A click outside closes it and the changes are lost. Use a Modal.',
      },
      {
        do: (
          <OpenPopover trigger={<IconButton size="sm" variant="secondary" icon="help-circle" label="About VAT" />}>
            VAT depends on your billing country.
          </OpenPopover>
        ),
        doText: 'Open it from a focusable control with a name, like a labelled IconButton.',
        dont: (
          <OpenPopover trigger={<span style={{ color: 'var(--icon-muted)', display: 'inline-flex' }}><Icon name="help-circle" size={16} /></span>}>
            VAT depends on your billing country.
          </OpenPopover>
        ),
        dontText: 'Don’t use a bare icon as the trigger. Keyboard users can’t reach it and screen readers don’t announce it.',
      },
      {
        do: (
          <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280, font: '400 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
            <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Refunds</span>
            <span>Ask for a refund within 14 days if the files don’t match the listing.</span>
          </div>
        ),
        doText: 'Put rules people need before buying on the page.',
        dont: (
          <OpenPopover trigger={<Button variant="tertiary" size="sm">Refunds</Button>}>
            Ask for a refund within 14 days if the files don’t match the listing.
          </OpenPopover>
        ),
        dontText: 'Don’t hide must-know terms in a Popover. Most people never open it.',
      },
    ],
    content: [
      'Title: name the topic in 2–5 words: “How fees work”, “What it covers”.',
      'Body: one or two plain sentences with real numbers. “On a $49 sale you get $43.12.”',
      'Links: say where they go, like “Compare licenses”. Never “Learn more” on its own.',
    ],
  },

  a11y: {
    keyboard: [
      ['Enter / Space', 'On the trigger, opens or closes the Popover.'],
      ['Tab', 'Moves from the trigger into the panel’s links and buttons.'],
      ['Escape', 'Closes the Popover.'],
    ],
    notes: [
      'The panel has role="dialog" and an aria-label from title (or label). Clicking or tapping outside it closes it.',
      'The trigger gets aria-expanded, aria-haspopup="dialog" and aria-controls pointing to the panel.',
      'The Popover is not modal, so focus stays on the trigger when it opens. The panel follows the trigger in the DOM, so Tab reaches its links next.',
      'Text is text-secondary on bg-raised, at least 4.5:1. The 1px border-elevation keeps the edge visible in dark mode.',
      'The panel springs in over 200ms. Under prefers-reduced-motion it appears at once.',
    ],
  },

  related: ['tooltip', 'dropdown-menu', 'modal'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'The trigger now gets aria-expanded, aria-haspopup and aria-controls, and the panel is named by title or the new label prop.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Popover in React and HTML/CSS, matching the Figma component.' },
  ],
};
