const col = (w) => ({ width: w || 280, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' });

export default {
  id: 'text-field',
  name: 'Text field',
  group: 'Inputs',
  order: 1,
  status: 'Stable',
  figma: '18:413',
  exports: ['TextField'],
  summary: 'A pill input for one line of text, with a label above it and a helper or error below. Use it for titles, emails, prices and links.',

  examples: [
    {
      title: 'Default',
      desc: 'Every field has a visible label. Add a helper when people need to know where the value shows up or what format to use.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <TextField
    label="Listing title"
    placeholder="e.g. Orbit dashboard UI kit"
    helper="Shown on the listing card and in search results."
  />
</div>`),
    },
    {
      title: 'Required and optional',
      desc: 'Required adds an asterisk and the native required attribute. When most fields in a form are required, mark only the optional ones instead.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <TextField label="Email" type="email" autoComplete="email" required />
  <TextField label="Studio name" optional />
</div>`),
    },
    {
      title: 'Sizes',
      desc: 'Medium (44px) is the default and meets the touch target. Use Large (52px) on checkout and sign-up pages. Use Small (36px) only in dense desktop UI such as table filters.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <TextField size="sm" label="Small" placeholder="Filter by buyer" />
  <TextField label="Medium" placeholder="mira@studio.com" />
  <TextField size="lg" label="Large" placeholder="Card holder name" />
</div>`),
    },
    {
      title: 'With icons',
      desc: 'A leading icon hints at the format: an envelope for email, a dollar sign for price, a link for URLs. Icons are decorative and can’t be clicked.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <TextField label="Payout email" leadingIcon="mail-01" type="email" defaultValue="mira@studio.com" />
  <TextField label="Price" leadingIcon="dollar-01" inputMode="decimal" defaultValue="49" />
  <TextField label="Portfolio" leadingIcon="link-01" type="url" placeholder="https://" />
</div>`),
    },
    {
      title: 'Validation',
      desc: 'Check the value when people leave the field. Once an error shows, re-check on every keystroke so it clears the moment the value is fixed. The error replaces the helper.',
      ...ex(`function Example() {
  const [price, setPrice] = useState('2');
  const [touched, setTouched] = useState(true);
  const n = Number(price);
  const error = touched && (price === '' || isNaN(n) || n < 5)
    ? 'Enter a price of $5 or more, or list it for free.'
    : '';
  return (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <TextField
        label="Price"
        leadingIcon="dollar-01"
        inputMode="decimal"
        value={price}
        onChange={e => setPrice(e.target.value)}
        onBlur={() => setTouched(true)}
        error={error}
        helper="You keep 85% of every sale."
      />
    </div>
  );
}`),
    },
    {
      title: 'Disabled',
      desc: 'Disable a field only when people can’t change it here, and say where they can. The helper stays readable.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <TextField
    label="Payout currency"
    defaultValue="USD"
    disabled
    helper="Set by your payout country. Change it in Payout settings."
  />
</div>`),
    },
    {
      title: 'In a form',
      desc: 'A creator profile form. Fields stack with space-md between them and the action sits at the end.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)' }}>
  <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Your creator profile</span>
  <TextField label="Display name" defaultValue="Mira Okafor" required />
  <TextField label="Store URL" leadingIcon="link-01" defaultValue="mira-okafor" helper="marketplace.com/mira-okafor" required />
  <TextField label="Location" placeholder="e.g. Lagos, Nigeria" optional />
  <Button style={{ justifySelf: 'end' }}>Save profile</Button>
</div>`),
    },
  ],

  props: {
    TextField: [
      ['label', 'ReactNode', '', 'Visible label above the input, linked with htmlFor. Always set it.'],
      ['helper', 'string', '', 'One line of help below the input, linked with aria-describedby.'],
      ['error', 'string', '', 'Replaces the helper. Turns the border red, adds an alert icon and sets aria-invalid.'],
      ['required', 'boolean', 'false', 'Adds a red asterisk (hidden from screen readers) and sets native required on the input.'],
      ['optional', 'boolean', 'false', 'Adds “(optional)” after the label.'],
      ['size', "'sm' | 'md' | 'lg'", "'md'", 'Height 36 / 44 / 52px (size-control-*). Small is for dense desktop UI only.'],
      ['leadingIcon', 'IconName', '', 'Decorative icon before the text, 20px (16px at Small).'],
      ['trailingIcon', 'IconName', '', 'Decorative icon after the text. It is not a button.'],
      ['disabled', 'boolean', 'false', 'Disables the input and greys the container. Explain why in the helper.'],
      ['id', 'string', '', 'Input id. Generated when omitted; the label and message use it.'],
      ['className', 'string', '', 'Added to the outer wrapper. Use it for layout.'],
      ['...rest', 'InputHTMLAttributes', '', 'Passed to the <input>: type, value, defaultValue, onChange, onBlur, placeholder, autoComplete, inputMode, name, style.'],
    ],
  },

  usage: {
    when: [
      'To collect one line of text: a listing title, an email, a price, a store URL.',
      'To let people type a value they already know, like a discount code or a VAT number.',
    ],
    whenNot: [
      'For more than one line, such as a listing description. Use a Textarea.',
      'To pick from a known list. Use a Select, or Radio buttons for 2–5 options.',
      'To search the catalog or filter a list. Use a Search field.',
      'For dates or one-time codes. Use a Date picker or an OTP input.',
    ],
    anatomy: {
      render: <div style={{ width: 300 }}><TextField label="Payout email" leadingIcon="mail-01" required defaultValue="mira@studio.com" helper="We send payout receipts here." /></div>,
      parts: [
        'Label: label-md (Inter Display SemiBold 15/20) in text-primary. The required asterisk uses feedback-error-text.',
        'Container: pill (radius-control), 44px tall (size-control-md), bg-surface, 1px border-strong. Hover uses border-hover.',
        'Leading icon (optional): 20px in icon-muted.',
        'Value: body 16/24 in text-primary. 16px stops iOS from zooming in. Placeholder uses text-muted.',
        'Helper: caption (500 12/16) in text-muted. An error swaps it for feedback-error-text with an alert-circle icon.',
        'Focus: border turns focus-ring and shadow-focus-halo appears around the pill.',
      ],
    },
    sections: [
      {
        title: 'Labels',
        body: 'Put a short label above every field. Placeholder text disappears as soon as people type, has low contrast and is skipped by some screen readers, so it can’t stand in for a label.',
        dos: [
          {
            do: <div style={col()}><TextField label="Email" type="email" placeholder="mira@studio.com" /><TextField label="Password" type="password" /></div>,
            doText: 'Use a visible label above the field. A placeholder can show an example of the format.',
            dont: <div style={col()}><TextField type="email" placeholder="Email" /><TextField type="password" placeholder="Password" /></div>,
            dontText: 'Don’t use the placeholder as the label. Once people type, they can’t see what the field was for.',
          },
          {
            do: <div style={col()}><TextField label="Store name" defaultValue="Okafor Studio" /></div>,
            doText: 'Write labels as short nouns in sentence case.',
            dont: <div style={col()}><TextField label="PLEASE ENTER YOUR STORE NAME:" defaultValue="Okafor Studio" /></div>,
            dontText: 'Don’t use all caps, colons or instructions in the label. Put guidance in the helper.',
          },
        ],
      },
      {
        title: 'Validation',
        body: 'Check a field when people leave it. Once it shows an error, re-check it as they type so the message clears as soon as the value is right. An error says what is wrong and how to fix it.',
        dos: [
          {
            do: <div style={col()}><TextField label="Price" leadingIcon="dollar-01" defaultValue="2" error="Enter a price of $5 or more, or list it for free." /></div>,
            doText: 'Say what went wrong and how to fix it, in plain words.',
            dont: <div style={col()}><TextField label="Price" leadingIcon="dollar-01" defaultValue="2" error="Invalid input" /></div>,
            dontText: 'Don’t write “Invalid input” or an error code. People can’t tell what to change.',
          },
          {
            do: <div style={col()}><TextField label="Password" type="password" helper="At least 8 characters, with one number." /></div>,
            doText: 'Show the rules in the helper before people start typing.',
            dont: <div style={col()}><TextField label="Password" type="password" defaultValue="orbit" error="Password does not meet requirements." /></div>,
            dontText: 'Don’t hide the rules until people fail them. They have to guess twice.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={col()}><TextField label="Full name" /><TextField label="Email" type="email" /><TextField label="Company" optional /></div>,
        doText: 'When most fields are required, mark only the optional ones.',
        dont: <div style={col()}><TextField label="Full name" required /><TextField label="Email" type="email" required /><TextField label="Company" required /></div>,
        dontText: 'Don’t put an asterisk on every field. The marks turn into noise and the one optional field gets missed.',
      },
      {
        do: <div style={col()}><TextField label="Tax ID" helper="Found on your W-9 or VAT certificate." /></div>,
        doText: 'Keep the helper to one short sentence.',
        dont: <div style={col()}><TextField label="Tax ID" helper="Your tax ID is the number issued by your local tax authority. In the US this is usually your SSN or EIN, found on your W-9. In the EU it is your VAT number. Contact support if you are unsure." /></div>,
        dontText: 'Don’t write a paragraph under the field. Link to a help article instead.',
      },
      {
        do: <div style={col()}><TextField label="Payout currency" defaultValue="USD" disabled helper="Set by your payout country." /></div>,
        doText: 'When a field is disabled, say why or where to change it.',
        dont: <div style={col()}><TextField label="Payout currency" defaultValue="USD" disabled /></div>,
        dontText: 'Don’t disable a field with no explanation. People think the form is broken.',
      },
      {
        do: <div style={col()}><TextField label="Discount code" size="lg" placeholder="e.g. SPRING20" /></div>,
        doText: 'Use Medium or Large on mobile and checkout so the field is easy to tap.',
        dont: <div style={col()}><TextField label="Discount code" size="sm" placeholder="e.g. SPRING20" /></div>,
        dontText: 'Don’t use Small on touch screens. At 36px it falls below the 44px touch target.',
      },
    ],
    content: [
      'Labels are 1–3 word nouns in sentence case with no colon: “Payout email”, not “Enter Your Payout Email:”.',
      'Use the placeholder only for an example of the format, starting with “e.g.”. Never put required information there.',
      'Helpers are one sentence that answers “where does this show up?” or “what format?”.',
      'Errors name the problem and the fix: “Enter an email like name@studio.com.” No “Oops”, no blame, no error codes.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus into the input. The border turns blue and the focus halo appears.'], ['Shift + Tab', 'Moves focus to the previous field.']],
    notes: [
      'Uses a native <input> with a <label htmlFor>, so the label is read and clicking it focuses the field.',
      'The helper or error is linked with aria-describedby. An error also sets aria-invalid="true".',
      'Required sets the native required attribute, so screen readers announce “required”. The asterisk itself is aria-hidden.',
      'The input border (border-strong) has 3:1 contrast with the surface. Errors pair the red border with an icon and text, so color is never the only signal.',
      'Text is 16px to stop iOS from zooming on focus. Medium and Large meet the 44px touch target.',
      'Border and halo change over 120ms with no movement, so nothing changes under prefers-reduced-motion.',
    ],
  },

  related: ['textarea', 'select', 'search-field', 'otp-input'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Narrow fields no longer overflow their column (the input container gets min-width: 0).' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Text field in React and HTML/CSS, matching the Figma component (3 sizes × default, hover, focus, filled, error and disabled).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Inputs became pills (radius-control), borders moved to pure-grey border-strong, and labels moved to Inter Display.' },
  ],
};
