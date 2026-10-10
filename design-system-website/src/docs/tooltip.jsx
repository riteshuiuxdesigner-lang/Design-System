// Tooltips only open on hover or focus. In the Usage tab we pin them open with the
// same classes the component renders, so each do and don't is visible at a glance.
const OpenTip = ({ content, children }) => (
  <span className="mds-tip-anchor">
    {children}
    <span role="tooltip" className="mds-tooltip mds-tooltip--top mds-tooltip--open" style={{ zIndex: 1 }}>{content}</span>
  </span>
);

export default {
  id: 'tooltip',
  name: 'Tooltip',
  group: 'Feedback',
  order: 3,
  status: 'Stable',
  figma: '33:61',
  exports: ['Tooltip'],
  summary: 'A small dark label that appears when people hover or focus a control. It names icon-only buttons and adds a short hint. It never holds information people need to finish a task.',

  examples: [
    {
      title: 'Default',
      desc: 'Wrap the trigger in Tooltip and pass the text in content. It opens above the trigger on hover and on keyboard focus, and closes on mouse leave, blur or Escape.',
      ...ex(`
<Tooltip content="Save to collection">
  <IconButton variant="secondary" icon="bookmark-01" label="Save to collection" />
</Tooltip>`),
    },
    {
      title: 'Placement',
      desc: 'Top is the default. Use bottom when the trigger sits near the top edge of the screen, like in the top navigation.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'center', padding: 'var(--space-xl) 0' }}>
  <Tooltip content="Share listing">
    <IconButton variant="secondary" icon="share-08" label="Share listing" />
  </Tooltip>
  <Tooltip content="Notifications" placement="bottom">
    <IconButton variant="secondary" icon="notification-01" label="Notifications" />
  </Tooltip>
</div>`),
    },
    {
      title: 'Toolbar of icon buttons',
      desc: 'Icon-only actions get a Tooltip each, with the same words as their label. People hovering learn what each icon does before they press it.',
      ...ex(`
<div role="toolbar" aria-label="Listing actions" style={{ display: 'flex', gap: 'var(--space-2xs)' }}>
  <Tooltip content="Edit listing">
    <IconButton icon="edit-02" label="Edit listing" />
  </Tooltip>
  <Tooltip content="Duplicate">
    <IconButton icon="copy-01" label="Duplicate" />
  </Tooltip>
  <Tooltip content="View analytics">
    <IconButton icon="analytics-01" label="View analytics" />
  </Tooltip>
  <Tooltip content="Delete listing">
    <IconButton icon="delete-02" label="Delete listing" />
  </Tooltip>
</div>`),
    },
    {
      title: 'With a keyboard shortcut',
      desc: 'Add the shortcut after the action name so people can learn it. Keep the whole tooltip on one line.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
  <Tooltip content="Search · ⌘K">
    <IconButton variant="secondary" icon="search-01" label="Search" />
  </Tooltip>
  <Tooltip content="Copy link · ⌘L">
    <IconButton variant="secondary" icon="link-01" label="Copy link" />
  </Tooltip>
</div>`),
    },
    {
      title: 'A short hint next to a value',
      desc: 'A help icon can carry a one-line hint about a number. Anything longer, or anything with a link, belongs in a Popover.',
      ...ex(`
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', font: '500 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>
  <span>Marketplace fee: 12%</span>
  <Tooltip content="Taken from each sale before payout">
    <IconButton size="sm" icon="help-circle" label="About the marketplace fee" />
  </Tooltip>
</div>`),
    },
  ],

  props: {
    Tooltip: [
      ['content', 'ReactNode', '', 'The text. Keep it to one short line. Longer text wraps at 240px.'],
      ['placement', "'top' | 'bottom'", "'top'", 'Side of the trigger the tooltip opens on, centered horizontally.'],
      ['children', 'ReactElement', '', 'The trigger. It must be focusable, like a Button or IconButton. Tooltip adds aria-describedby to it and removes its native title, so only one tooltip shows.'],
    ],
  },

  usage: {
    when: [
      'To name an icon-only button, like Edit, Share or Delete.',
      'To show a keyboard shortcut for an action.',
      'To add a short, optional hint next to a value or setting.',
    ],
    whenNot: [
      'For anything people need to complete a task, like rules for a field. Put it in helper text.',
      'For content with links, buttons or images. Use a Popover.',
      'For long explanations. Link to a help article or use a Popover.',
      'On touch screens as the only label. There is no hover on a phone, so show the text.',
    ],
    anatomy: {
      render: (
        <div style={{ paddingTop: 'var(--space-2xl)' }}>
          <OpenTip content="Save to collection">
            <IconButton variant="secondary" icon="bookmark-01" label="Save to collection" />
          </OpenTip>
        </div>
      ),
      parts: [
        'Container: radius-md, bg-inverse, padded with space-2xs and space-sm. At most 240px wide; longer text wraps.',
        'Label: caption Medium (Inter Display 500 12/16) in text-inverse.',
        'Offset: space-xs from the trigger, centered on it.',
        'Trigger: any focusable control. Icon-only triggers keep their own aria-label.',
      ],
    },
    sections: [
      {
        title: 'Tooltips and touch',
        body: 'Phones have no hover, so a tooltip never shows there. When a control matters on mobile, show its label in the interface.',
        dos: [
          {
            do: <Button variant="secondary" leadingIcon="share-08">Share</Button>,
            doText: 'On mobile, show the label next to the icon.',
            dont: (
              <div style={{ paddingTop: 'var(--space-2xl)' }}>
                <OpenTip content="Share"><IconButton variant="secondary" icon="share-08" label="Share" /></OpenTip>
              </div>
            ),
            dontText: 'Don’t rely on a tooltip to explain an icon on a phone. Nobody can hover to see it.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <div style={{ paddingTop: 'var(--space-2xl)' }}>
            <OpenTip content="Save to collection"><IconButton variant="secondary" icon="bookmark-01" label="Save to collection" /></OpenTip>
          </div>
        ),
        doText: 'Use a few words that name the action.',
        dont: (
          <div style={{ paddingTop: 'var(--space-7xl)' }}>
            <OpenTip content="Saving adds this asset to one of your collections, which you can find in your profile under Saved. You can make collections public and share them with other buyers.">
              <IconButton variant="secondary" icon="bookmark-01" label="Save to collection" />
            </OpenTip>
          </div>
        ),
        dontText: 'Don’t put a paragraph in a tooltip. It covers the page and disappears when the pointer moves.',
      },
      {
        do: (
          <div style={{ width: 260 }}>
            <TextField label="Listing title" defaultValue="Orbit UI Kit" helper="Use at least 10 characters." />
          </div>
        ),
        doText: 'Show rules people need as helper text, where everyone can see them.',
        dont: (
          <div style={{ width: 260, display: 'grid', gap: 'var(--space-2xs)', paddingTop: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>
              Listing title
              <OpenTip content="Use at least 10 characters"><Icon name="help-circle" size={16} /></OpenTip>
            </div>
            <TextField label="" defaultValue="Orbit UI Kit" />
          </div>
        ),
        dontText: 'Don’t hide required information in a tooltip. People only find it after they get an error.',
      },
      {
        do: (
          <div style={{ paddingTop: 'var(--space-2xl)' }}>
            <OpenTip content="Delete listing"><IconButton variant="secondary" icon="delete-02" label="Delete listing" /></OpenTip>
          </div>
        ),
        doText: 'Add a tooltip to icon-only buttons.',
        dont: (
          <div style={{ paddingTop: 'var(--space-2xl)' }}>
            <OpenTip content="Publish"><Button>Publish</Button></OpenTip>
          </div>
        ),
        dontText: 'Don’t repeat a visible label in a tooltip. It adds noise and nothing new.',
      },
      {
        do: (
          <div style={{ paddingTop: 'var(--space-2xl)' }}>
            <OpenTip content="Commercial license"><IconButton variant="secondary" icon="license" label="Commercial license" /></OpenTip>
          </div>
        ),
        doText: 'Keep tooltip content as plain text.',
        dont: (
          <div style={{ paddingTop: 'var(--space-2xl)' }}>
            <OpenTip content={<span>Commercial license · <span style={{ textDecoration: 'underline' }}>Compare licenses</span></span>}>
              <IconButton variant="secondary" icon="license" label="Commercial license" />
            </OpenTip>
          </div>
        ),
        dontText: 'Don’t put a link or button in a tooltip. It closes before people reach it. Use a Popover.',
      },
    ],
    content: [
      'Name the action in 1–4 words, in sentence case, with no end punctuation: “Save to collection”.',
      'Match the button’s aria-label so sighted and screen reader users hear the same words.',
      'Add a shortcut after a middle dot: “Search · ⌘K”.',
      'No emoji, no exclamation marks, no full sentences.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Focusing the trigger opens the tooltip. Moving focus away closes it.'],
      ['Escape', 'Closes the tooltip and keeps focus on the trigger.'],
    ],
    notes: [
      'The tooltip has role="tooltip" and an id. Tooltip adds aria-describedby to the trigger, so screen readers read the tooltip after the trigger’s name.',
      'Icon-only triggers still need their own label. IconButton sets aria-label from its label prop; Tooltip removes the native title so the browser doesn’t show a second tooltip.',
      'The trigger must be focusable. A tooltip on plain text or an Icon cannot be reached by keyboard.',
      'Text is text-inverse on bg-inverse at caption size, above 4.5:1 in both themes.',
      'It fades in over 120ms and springs 4px into place over 200ms. Under prefers-reduced-motion it appears without moving.',
    ],
  },

  related: ['popover', 'icon-button', 'text-field'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'aria-describedby now sits on the trigger itself, the trigger’s native title is removed so only one tooltip shows, and long text wraps inside the 240px box.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Tooltip in React and HTML/CSS, matching the Figma component (top and bottom placement).' },
  ],
};
