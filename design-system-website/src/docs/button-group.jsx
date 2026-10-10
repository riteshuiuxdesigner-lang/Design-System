export default {
  id: 'button-group',
  name: 'Button group',
  group: 'Actions',
  order: 4,
  status: 'Stable',
  figma: '49:261',
  exports: ['ButtonGroup'],
  summary: 'Lays out two or three related buttons with the right spacing and order. Right-aligned in a row on desktop, stacked full width on mobile.',

  examples: [
    {
      title: 'Default',
      desc: 'Buttons sit in a row, aligned to the end of the container with space-sm between them. Put the Primary last in the code so it lands on the right.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%' }}>
  <ButtonGroup label="Listing actions">
    <Button variant="ghost">Cancel</Button>
    <Button variant="secondary">Save draft</Button>
    <Button>Publish</Button>
  </ButtonGroup>
</div>`),
    },
    {
      title: 'Stacked',
      desc: 'Stacked puts each button on its own full-width row for phones. The order on screen is the order in the code, so the Primary, last in the code, sits at the bottom next to the thumb.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 320 }}>
  <ButtonGroup stacked label="Checkout actions">
    <Button variant="secondary">Add to cart</Button>
    <Button size="lg">Buy for $49</Button>
  </ButtonGroup>
</div>`),
    },
    {
      title: 'Confirming a destructive action',
      desc: 'Pair a Destructive button with a safe way out. The safe option comes first and the Destructive one takes the Primary spot.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%' }}>
  <ButtonGroup label="Delete listing">
    <Button variant="secondary">Keep listing</Button>
    <Button variant="destructive">Delete listing</Button>
  </ButtonGroup>
</div>`),
    },
    {
      title: 'Small, in dense UI',
      desc: 'In table rows and toolbars, group Small Secondary buttons. Keep every button in a group the same size.',
      ...ex(`
<ButtonGroup label="Payout actions">
  <Button variant="secondary" size="sm" leadingIcon="download-01">Export CSV</Button>
  <Button variant="secondary" size="sm" leadingIcon="refresh">Retry payout</Button>
</ButtonGroup>`),
    },
    {
      title: 'Wrapping',
      desc: 'When the row runs out of space, buttons wrap onto the next line and stay aligned to the end. If they wrap often, switch to stacked.',
      ...ex(`
<div style={{ width: 300 }}>
  <ButtonGroup label="Draft actions">
    <Button variant="ghost">Discard</Button>
    <Button variant="secondary">Preview listing</Button>
    <Button>Publish</Button>
  </ButtonGroup>
</div>`),
    },
    {
      title: 'In a form footer',
      desc: 'A group closes a form or a card. Keep it at the bottom, after the last field, so people finish reading before they act.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <span style={{ font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}>Payout details</span>
  <TextField label="Account holder" defaultValue="Mira Okafor" />
  <ButtonGroup label="Payout details">
    <Button variant="ghost">Cancel</Button>
    <Button>Save details</Button>
  </ButtonGroup>
</div>`),
    },
  ],

  props: {
    ButtonGroup: [
      ['stacked', 'boolean', 'false', 'Full-width column for mobile. Keeps the code order, so the last button (the Primary) sits at the bottom.'],
      ['label', 'string', '', 'aria-label for the group (role="group"). Name what the actions are about.'],
      ['className', 'string', '', 'Extra classes on the wrapper.'],
      ['children', 'ReactNode', '', '2–3 Buttons. Put the Primary last.'],
    ],
  },

  usage: {
    when: [
      'To close a form, modal, drawer or card with two or three actions.',
      'To pair a main action with its alternative: Save draft and Publish, Keep and Delete.',
      'To keep spacing, order and mobile stacking consistent across the product.',
    ],
    whenNot: [
      'For a single button. Place the Button on its own.',
      'For four or more actions. Keep two or three and move the rest to a Dropdown menu.',
      'For a set of toggles or filters. Use Chips or Tabs.',
    ],
    anatomy: {
      render: <div style={{ width: 360 }}><ButtonGroup label="Listing actions"><Button variant="secondary">Save draft</Button><Button>Publish</Button></ButtonGroup></div>,
      parts: [
        'Container: flex row, aligned to the end, wraps when it runs out of space. role="group" with an aria-label.',
        'Gap: space-sm (12px) between buttons.',
        'Secondary action: comes first, on the left in a row and on top when stacked.',
        'Primary action: comes last, on the right in a row and at the bottom when stacked.',
      ],
    },
    sections: [
      {
        title: 'Order',
        body: 'Read order is decision order. People scan to the end of the row to find the way forward, so the Primary goes last on desktop. On mobile, stacked keeps the same order, so the Primary lands at the bottom, next to their thumb.',
        dos: [
          {
            do: <div style={{ width: 300 }}><ButtonGroup label="Listing actions"><Button variant="secondary">Save draft</Button><Button>Publish</Button></ButtonGroup></div>,
            doText: 'Put the Primary last, so it sits on the right.',
            dont: <div style={{ width: 300 }}><ButtonGroup label="Listing actions"><Button>Publish</Button><Button variant="secondary">Save draft</Button></ButtonGroup></div>,
            dontText: 'Don’t put the Primary first. It breaks the pattern people learned from every other form.',
          },
          {
            do: <div style={{ width: 260 }}><ButtonGroup stacked label="Checkout actions"><Button variant="secondary">Add to cart</Button><Button>Buy for $49</Button></ButtonGroup></div>,
            doText: 'Use stacked on narrow screens, so every button is full width and easy to tap.',
            dont: <div style={{ width: 260 }}><ButtonGroup label="Checkout actions"><Button variant="secondary">Add to cart</Button><Button>Buy for $49</Button></ButtonGroup></div>,
            dontText: 'Don’t leave a row on a phone. It wraps unevenly and the buttons end up different widths.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <ButtonGroup label="Listing actions"><Button variant="secondary">Save draft</Button><Button>Publish</Button></ButtonGroup>,
        doText: 'Use one Primary and step the others down to Secondary or Ghost.',
        dont: <ButtonGroup label="Listing actions"><Button>Save draft</Button><Button>Publish</Button></ButtonGroup>,
        dontText: 'Don’t put two Primaries in a group. People can’t tell which one moves them forward.',
      },
      {
        do: <ButtonGroup label="Listing actions"><Button variant="ghost">Cancel</Button><Button>Publish</Button></ButtonGroup>,
        doText: 'Keep it to two or three actions that belong to the same task.',
        dont: <div style={{ width: 340 }}><ButtonGroup label="Listing actions"><Button variant="ghost" size="sm">Cancel</Button><Button variant="secondary" size="sm">Preview</Button><Button variant="secondary" size="sm">Duplicate</Button><Button variant="secondary" size="sm">Export</Button><Button size="sm">Publish</Button></ButtonGroup></div>,
        dontText: 'Don’t line up five buttons. Move the extras into a Dropdown menu.',
      },
      {
        do: <ButtonGroup label="Draft actions"><Button variant="secondary">Save draft</Button><Button>Publish</Button></ButtonGroup>,
        doText: 'Keep every button in a group the same size.',
        dont: <ButtonGroup label="Draft actions"><Button variant="secondary" size="sm">Save draft</Button><Button size="lg">Publish</Button></ButtonGroup>,
        dontText: 'Don’t mix sizes. Use variant to show which action matters, not height.',
      },
      {
        do: <ButtonGroup label="Delete listing"><Button variant="secondary">Keep listing</Button><Button variant="destructive">Delete listing</Button></ButtonGroup>,
        doText: 'Group actions that answer the same question, like keep or delete.',
        dont: <ButtonGroup label="Account"><Button variant="secondary">Log out</Button><Button>Publish</Button></ButtonGroup>,
        dontText: 'Don’t group unrelated actions. Log out has nothing to do with publishing.',
      },
    ],
    content: [
      'Each label starts with a verb and names the result: “Save draft”, “Publish”, “Delete listing”.',
      'Make the two labels clearly different. “Keep listing” and “Delete listing” beat “Cancel” and “OK”.',
      'Give the group a label that names the task, like “Checkout actions”. Screen readers announce it.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves through the buttons in code order.'], ['Enter / Space', 'Activates the focused button.']],
    notes: [
      'The wrapper has role="group" and takes the label prop as aria-label, so screen readers announce the buttons as a set.',
      'Stacked keeps the code order on screen, so the visual order and the tab order always match: Secondary first, then Primary.',
      'Buttons keep their own focus ring, contrast and 44px touch target. Stacked buttons stretch to the full width.',
    ],
  },

  related: ['button', 'icon-button', 'link'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Stacked no longer reverses the order. The Primary, last in the code, now sits at the bottom, matching the Button guidance, and the tab order matches what people see.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Button group in React and HTML/CSS, matching the Figma component (row and stacked).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
