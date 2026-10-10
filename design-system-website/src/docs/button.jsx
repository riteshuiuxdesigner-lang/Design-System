export default {
  id: 'button',
  name: 'Button',
  group: 'Actions',
  order: 1,
  status: 'Stable',
  figma: '16:1008',
  exports: ['Button'],
  summary: 'A pill that starts an action: publish, buy, save, upload. Use one Primary per view so the next step is obvious.',

  examples: [
    {
      title: 'Variants',
      desc: 'Primary is the main action on the screen. Secondary sits next to it. Tertiary and Ghost are for quieter actions. Destructive is only for actions that delete or remove something.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
  <Button>Publish</Button>
  <Button variant="secondary">Preview</Button>
  <Button variant="tertiary">Add to collection</Button>
  <Button variant="ghost">Cancel</Button>
  <Button variant="destructive">Unpublish</Button>
</div>`),
    },
    {
      title: 'Sizes',
      desc: 'Medium (44px) is the default and meets the touch target. Use Large (52px) for hero and checkout actions. Use Small (36px) only in dense desktop UI such as tables and toolbars.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
  <Button size="sm">Small</Button>
  <Button>Medium</Button>
  <Button size="lg">Large</Button>
</div>`),
    },
    {
      title: 'With icons',
      desc: 'An icon helps people scan, but the label still does the work. Put the icon before the label, or after it when the icon shows direction.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
  <Button size="lg" leadingIcon="shopping-bag-01">Buy for $49</Button>
  <Button variant="secondary" leadingIcon="upload-01">Upload asset</Button>
  <Button variant="tertiary" trailingIcon="arrow-right-01">See all UI kits</Button>
</div>`),
    },
    {
      title: 'Loading',
      desc: 'Keep the label while the action runs, so the button does not change width. Loading sets aria-busy for screen readers.',
      ...ex(`function Example() {
  const [saving, setSaving] = useState(false);
  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1600);
  }
  return (
    <Button loading={saving} onClick={save}>
      {saving ? 'Publishing' : 'Publish'}
    </Button>
  );
}`),
    },
    {
      title: 'Disabled',
      desc: 'Only disable a button when the reason is visible nearby. If people can fix the problem, keep the button enabled and show an error when they press it.',
      ...ex(`
<div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
  <Button disabled>Publish</Button>
  <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Add at least 3 preview images to publish.</span>
</div>`),
    },
    {
      title: 'Full width on mobile',
      desc: 'On phones, the main action can stretch to the full width of its container. Pair it with a Secondary button stacked above it.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 320, display: 'grid', gap: 8 }}>
  <Button variant="secondary" style={{ width: '100%' }}>Save draft</Button>
  <Button size="lg" style={{ width: '100%' }}>Publish listing</Button>
</div>`),
    },
  ],

  props: {
    Button: [
      ['variant', "'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive'", "'primary'", 'Visual weight. One Primary per view.'],
      ['size', "'sm' | 'md' | 'lg'", "'md'", 'Height 36 / 44 / 52px (size-control-*). Small is for dense desktop UI only.'],
      ['loading', 'boolean', 'false', 'Shows a spinner in place of the leading icon and sets aria-busy. The label stays.'],
      ['leadingIcon', 'IconName', '', 'Icon before the label (any name from Iconography).'],
      ['trailingIcon', 'IconName', '', 'Icon after the label. Use for direction (arrow-right-01) or menus (arrow-down-01).'],
      ['disabled', 'boolean', 'false', 'Native disabled. Explain why next to the button.'],
      ['children', 'ReactNode', '', 'The label. Start with a verb.'],
      ['...rest', 'ButtonHTMLAttributes', '', 'Any native button attribute: onClick, type, aria-*, style.'],
    ],
  },

  usage: {
    when: [
      'To start an action: submit a form, buy, publish, upload, follow.',
      'To confirm or cancel a decision in a modal or drawer.',
    ],
    whenNot: [
      'To go to another page. Use a Link so it opens in a new tab and reads as navigation.',
      'For an action that only has an icon. Use an Icon Button with a label.',
      'To filter a list. Use Chips.',
    ],
    anatomy: {
      render: <Button size="lg" leadingIcon="shopping-bag-01">Buy for $49</Button>,
      parts: [
        'Container: pill (radius-control), 44px tall by default, padded with space-lg.',
        'Leading icon (optional): 20px, inherits the label color.',
        'Label: label-md (Inter Display SemiBold 15/20). Starts with a verb.',
        'Focus ring: shadow-focus-ring, a 2px gap and a 2px brand-blue ring. Shows on keyboard focus only.',
      ],
    },
    sections: [
      {
        title: 'Hierarchy',
        body: 'Each view gets one Primary. The other actions step down through Secondary, Tertiary and Ghost. When two actions sit together, put Primary on the right on desktop and at the bottom on mobile.',
        dos: [
          {
            do: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary">Save draft</Button><Button>Publish</Button></div>,
            doText: 'Use one Primary for the main action and a Secondary for the alternative.',
            dont: <div style={{ display: 'flex', gap: 8 }}><Button>Save draft</Button><Button>Publish</Button></div>,
            dontText: 'Don’t use two Primary buttons side by side. People can’t tell which one moves them forward.',
          },
        ],
      },
      {
        title: 'Destructive actions',
        body: 'Use Destructive only for actions that delete or remove something. Ask for confirmation in a Modal when the action can’t be undone.',
        dos: [
          {
            do: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary">Keep listing</Button><Button variant="destructive">Delete listing</Button></div>,
            doText: 'Name exactly what gets deleted and pair it with a safe way out.',
            dont: <div style={{ display: 'flex', gap: 8 }}><Button variant="destructive">Save changes</Button></div>,
            dontText: 'Don’t use red for a normal action to make it stand out. Red means data will be lost.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Button leadingIcon="upload-01">Upload asset</Button>,
        doText: 'Start with a verb and say what happens.',
        dont: <Button>Click here</Button>,
        dontText: 'Don’t use vague labels like “Click here”, “OK” or “Submit”.',
      },
      {
        do: <Button size="lg">Buy for $49</Button>,
        doText: 'Put the price in the purchase button so there are no surprises.',
        dont: <Button size="lg">BUY NOW!!!</Button>,
        dontText: 'Don’t use all caps, exclamation marks or emoji in labels.',
      },
      {
        do: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" size="sm">Edit</Button><Button variant="secondary" size="sm">Duplicate</Button></div>,
        doText: 'Use Small only in dense desktop areas such as table rows.',
        dont: <div style={{ display: 'flex', gap: 4 }}><Button size="sm">Publish</Button></div>,
        dontText: 'Don’t use Small for a main action on mobile. It drops below the 44px touch target.',
      },
    ],
    content: [
      'Use sentence case: “Add to collection”, not “Add To Collection”.',
      'Keep it to 1–3 words. Add the object when the verb alone is unclear: “Publish” in an editor, “Publish listing” elsewhere.',
      'After the action, confirm in the past tense with a Toast: “Published”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the button and shows the focus ring.'], ['Enter / Space', 'Activates the button.']],
    notes: [
      'Uses a native <button>, so it works with every screen reader and keyboard without extra code.',
      'Text on Primary and Destructive is white on blue-600 / red-600, at least 5:1 contrast.',
      'Loading keeps the label and sets aria-busy="true"; announce the result with a Toast.',
      'Pressing squishes the button to 0.96 with a spring. Under prefers-reduced-motion, it does not move.',
    ],
  },

  related: ['icon-button', 'button-group', 'link'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Button in React and HTML/CSS, matching the Figma component (5 variants × 3 sizes × 6 states).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Primary moved from blue-500 to blue-600 (#3263e4) for 5.2:1 contrast with white text.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'All buttons became pills (radius-control = 9999) with a spring press.' },
  ],
};
