const col = (w) => ({ width: w || 280, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' });
const fieldset = { margin: 0, padding: 0, border: 0, display: 'grid' };
const legend = { marginBottom: 'var(--space-2xs)' };
const COUNTRIES = ['Brazil', 'Canada', 'Germany', 'India', 'Japan', 'Nigeria', 'United Kingdom', 'United States'];

export default {
  id: 'select',
  name: 'Select',
  group: 'Inputs',
  order: 2,
  status: 'Stable',
  figma: '20:529',
  exports: ['Select'],
  summary: 'A pill trigger that opens the native option list. Use it to pick one value from a long or familiar list, such as a category or a payout country.',

  examples: [
    {
      title: 'Default',
      desc: 'Add a placeholder that tells people what to choose. With no value or defaultValue, the placeholder shows until they pick.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <Select
    label="Category"
    placeholder="Choose a category"
    options={['UI kits', 'Icon packs', 'Illustrations', 'Templates', 'Fonts', '3D assets', 'Mockups']}
    helper="Buyers browse by category, so pick the closest match."
  />
</div>`),
    },
    {
      title: 'Labels and values',
      desc: 'Pass strings when the label is the value. Pass { value, label } objects when the stored value is a code.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <Select
    label="Payout currency"
    defaultValue="EUR"
    options={[
      { value: 'USD', label: 'US dollar (USD)' },
      { value: 'EUR', label: 'Euro (EUR)' },
      { value: 'GBP', label: 'British pound (GBP)' },
      { value: 'NGN', label: 'Nigerian naira (NGN)' },
    ]}
  />
</div>`),
    },
    {
      title: 'Sizes and icons',
      desc: 'Medium (44px) is the default. Use Small (36px) for toolbar controls like sorting on desktop, often with a leading icon and no visible label.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
  <Select size="sm" aria-label="Sort by" leadingIcon="arrow-up-down" defaultValue="popular" options={[
    { value: 'popular', label: 'Most popular' },
    { value: 'new', label: 'Newest' },
    { value: 'low', label: 'Price: low to high' },
  ]} />
  <Select label="Format" defaultValue="Figma" options={['Figma', 'Sketch', 'Adobe XD']} />
  <Select size="lg" label="License" defaultValue="Commercial" options={['Personal', 'Commercial', 'Extended']} />
</div>`),
    },
    {
      title: 'Controlled',
      desc: 'Read the value from onChange, which receives the native change event. Use it to update other parts of the form.',
      ...ex(`function Example() {
  const [country, setCountry] = useState('');
  const currency = { US: 'USD', GB: 'GBP', DE: 'EUR', NG: 'NGN', IN: 'INR' }[country];
  return (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <Select
        label="Payout country"
        placeholder="Choose a country"
        value={country}
        onChange={e => setCountry(e.target.value)}
        options={[
          { value: 'DE', label: 'Germany' },
          { value: 'IN', label: 'India' },
          { value: 'NG', label: 'Nigeria' },
          { value: 'GB', label: 'United Kingdom' },
          { value: 'US', label: 'United States' },
        ]}
        helper={currency ? 'You’ll be paid in ' + currency + '.' : 'Sets the currency of your payouts.'}
      />
    </div>
  );
}`),
    },
    {
      title: 'Error and disabled',
      desc: 'Show an error when people try to continue without choosing. Disable a Select only when the value comes from somewhere else, and say where.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <Select
    label="Category"
    placeholder="Choose a category"
    options={['UI kits', 'Icon packs', 'Templates']}
    error="Choose a category so buyers can find your listing."
  />
  <Select
    label="Payout currency"
    defaultValue="USD"
    options={['USD', 'EUR', 'GBP']}
    disabled
    helper="Set by your payout country."
  />
</div>`),
    },
    {
      title: 'In a results header',
      desc: 'A Small sort Select sits at the end of the results header, across from the count.',
      stage: 'plain',
      ...ex(`
<div style={{ width: 560, maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
  <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>
    UI kits <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>2,418</span>
  </span>
  <Select size="sm" aria-label="Sort by" leadingIcon="arrow-up-down" defaultValue="popular" options={[
    { value: 'popular', label: 'Most popular' },
    { value: 'new', label: 'Newest' },
    { value: 'low', label: 'Price: low to high' },
    { value: 'high', label: 'Price: high to low' },
  ]} />
</div>`),
    },
  ],

  props: {
    Select: [
      ['label', 'ReactNode', '', 'Visible label above the trigger. If you hide it, pass aria-label instead.'],
      ['options', "Array<string | { value: string, label: string }>", '[]', 'The choices, in the order shown.'],
      ['placeholder', 'string', '', 'Adds a disabled first option with an empty value. It shows until people pick, unless you pass value or defaultValue.'],
      ['helper', 'string', '', 'One line of help below, linked with aria-describedby.'],
      ['error', 'string', '', 'Replaces the helper, turns the border red and sets aria-invalid.'],
      ['required', 'boolean', 'false', 'Shows the red asterisk (hidden from screen readers) and sets native required on the select.'],
      ['optional', 'boolean', 'false', 'Adds “(optional)” after the label.'],
      ['size', "'sm' | 'md' | 'lg'", "'md'", 'Height 36 / 44 / 52px (size-control-*).'],
      ['leadingIcon', 'IconName', '', 'Decorative icon before the value.'],
      ['disabled', 'boolean', 'false', 'Disables the select and greys the container.'],
      ['id', 'string', '', 'Select id. Generated when omitted.'],
      ['className', 'string', '', 'Added to the outer wrapper.'],
      ['...rest', 'SelectHTMLAttributes', '', 'Passed to the <select>: value, defaultValue, onChange, name, aria-label.'],
    ],
  },

  usage: {
    when: [
      'To pick one value from 6 or more options, such as a category, a country or a currency.',
      'When the options are familiar and people know what they are looking for.',
      'For a compact control in a toolbar, such as sorting results.',
    ],
    whenNot: [
      'For 2–5 options that people should compare. Use Radio buttons so every option is visible.',
      'To pick a license with a price and a description. Use a License selector.',
      'To filter a results grid. Use Chips.',
      'To run an action like Edit or Delete. Use a Dropdown menu.',
    ],
    anatomy: {
      render: <div style={{ width: 300 }}><Select label="Category" defaultValue="Icon packs" options={['UI kits', 'Icon packs', 'Templates']} helper="Buyers browse by category." /></div>,
      parts: [
        'Label: label-md (Inter Display SemiBold 15/20) in text-primary.',
        'Trigger: pill (radius-control), 44px tall, bg-surface, 1px border-strong. Focus adds focus-ring and shadow-focus-halo.',
        'Value: body 16/24 in text-primary.',
        'Chevron: arrow-down-01, 20px in icon-secondary. It is decorative and lets clicks through.',
        'Option list: the platform’s native list, so it is a full-screen picker on phones.',
        'Helper: caption (500 12/16) in text-muted, or feedback-error-text with an icon for errors.',
      ],
    },
    sections: [
      {
        title: 'Select or radio',
        body: 'Show 2–5 options as Radio buttons so people can compare them without opening anything. Use a Select when the list is long or the options are familiar, like countries.',
        dos: [
          {
            do: <div style={col()}><Select label="Payout country" placeholder="Choose a country" options={COUNTRIES} /></div>,
            doText: 'Use a Select for a long, familiar list. People know what they are looking for.',
            dont: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout country</legend>{COUNTRIES.map(c => <Radio key={c} name="sel-dont-country" label={c} />)}</fieldset>,
            dontText: 'Don’t list every country as a Radio button. The form gets very long and the choice is buried.',
          },
          {
            do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout schedule</legend><Radio name="sel-do-sched" label="Weekly" defaultChecked /><Radio name="sel-do-sched" label="Monthly" /><Radio name="sel-do-sched" label="Manual" /></fieldset>,
            doText: 'Use Radio buttons for a few options so every one is visible.',
            dont: <div style={col()}><Select label="Payout schedule" defaultValue="Weekly" options={['Weekly', 'Monthly', 'Manual']} /></div>,
            dontText: 'Don’t hide three options behind a click. People can’t compare what they can’t see.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={col()}><Select label="Category" placeholder="Choose a category" options={['UI kits', 'Icon packs', 'Templates']} /></div>,
        doText: 'Start with a placeholder when there is no safe default, so people make a real choice.',
        dont: <div style={col()}><Select label="Category" options={['3D assets', 'Icon packs', 'Templates', 'UI kits']} /></div>,
        dontText: 'Don’t preselect the first option by accident. People skip the field and the listing lands in the wrong category.',
      },
      {
        do: <div style={col()}><Select label="Payout country" defaultValue="Nigeria" options={COUNTRIES} /></div>,
        doText: 'Keep a visible label above the trigger.',
        dont: <div style={col()}><Select aria-label="Payout country" placeholder="Payout country" defaultValue="Nigeria" options={COUNTRIES} /></div>,
        dontText: 'Don’t rely on the placeholder as the label. Once a value is picked, the field no longer says what it is.',
      },
      {
        do: <DropdownMenu label="Actions" items={[{ label: 'Edit listing', icon: 'edit-02' }, { label: 'Duplicate', icon: 'copy-01' }, { divider: true }, { label: 'Delete', icon: 'delete-02', destructive: true }]} />,
        doText: 'Use a Dropdown menu for actions. Picking an item does something right away.',
        dont: <div style={col()}><Select aria-label="Actions" placeholder="Choose an action" options={['Edit listing', 'Duplicate', 'Delete']} /></div>,
        dontText: 'Don’t use a Select to run actions. A Select stores a value; people expect to press Save after it.',
      },
      {
        do: <div style={col()}><Select label="Sort by" defaultValue="Most popular" options={['Most popular', 'Newest', 'Price: low to high', 'Price: high to low']} /></div>,
        doText: 'Write short options that start with the word people scan for.',
        dont: <div style={col()}><Select label="Sort by" defaultValue="a" options={[{ value: 'a', label: 'Show the most popular items first' }, { value: 'b', label: 'Show items that were published most recently' }]} /></div>,
        dontText: 'Don’t write sentences as options. They get cut off in the trigger and people can’t scan the list.',
      },
    ],
    content: [
      'Labels are short nouns in sentence case: “Payout country”.',
      'Placeholders start with a verb: “Choose a category”.',
      'Order options in a way people expect: alphabetical for countries, most used first for sorting, smallest to largest for sizes.',
      'Errors tell people what to pick and why: “Choose a category so buyers can find your listing.”',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to the select and shows the focus halo.'],
      ['Space / Enter / Alt + ↓', 'Opens the native option list (varies by browser and OS).'],
      ['↑ / ↓', 'Moves between options.'],
      ['Letter keys', 'Jumps to the first option that starts with that letter.'],
      ['Esc', 'Closes the list without changing the value.'],
    ],
    notes: [
      'Uses a native <select>, so keyboard, screen reader and mobile pickers work everywhere without extra code.',
      'The label is linked with htmlFor. The helper or error is linked with aria-describedby, and an error sets aria-invalid. Required sets native required, so screen readers announce it.',
      'When you hide the label in a toolbar, pass aria-label so the control still has a name.',
      'The chevron is decorative and has pointer-events: none, so clicks reach the select.',
      'The border (border-strong) has 3:1 contrast. Errors pair red with an icon and text.',
    ],
  },

  related: ['radio', 'license-selector', 'text-field', 'dropdown-menu'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'required now reaches the native select. A placeholder shows by default when there is no value. Long options no longer push the trigger past its column.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Select in React and HTML/CSS, matching the Figma component (3 sizes × default, focus, filled, error and disabled).' },
  ],
};
