const w = { width: 300, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' };
const LICENSES = [
  { value: 'personal', title: 'Personal', description: 'For your own projects and portfolio. No client work.', price: '$49' },
  { value: 'commercial', title: 'Commercial', description: 'For client work and one product you sell.', price: '$99' },
  { value: 'extended', title: 'Extended', description: 'For products you sell to many people, like templates or apps.', price: '$249' },
];

export default {
  id: 'license-selector',
  name: 'License selector',
  group: 'Selection',
  order: 4,
  status: 'Stable',
  figma: '20:1404',
  exports: ['LicenseSelector'],
  summary: 'A stack of radio cards for choosing how a buyer may use an asset. Each card shows the license name, what it allows and its price.',

  examples: [
    {
      title: 'Default',
      desc: 'Three licenses with what each allows and its price. The first option is selected unless you set defaultValue.',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%' }}>
  <LicenseSelector
    legend="License"
    options={[
      { value: 'personal', title: 'Personal', description: 'For your own projects and portfolio. No client work.', price: '$49' },
      { value: 'commercial', title: 'Commercial', description: 'For client work and one product you sell.', price: '$99' },
      { value: 'extended', title: 'Extended', description: 'For products you sell to many people, like templates or apps.', price: '$249' },
    ]}
  />
</div>`),
    },
    {
      title: 'Price in the buy button',
      desc: 'Control it with value and onChange (which gets the option value), and put the price of the chosen license in the button.',
      ...ex(`function Example() {
  const options = [
    { value: 'personal', title: 'Personal', description: 'For your own projects and portfolio.', price: '$49' },
    { value: 'commercial', title: 'Commercial', description: 'For client work and one product you sell.', price: '$99' },
    { value: 'extended', title: 'Extended', description: 'For products you sell to many people.', price: '$249' },
  ];
  const [license, setLicense] = useState('personal');
  const chosen = options.filter(o => o.value === license)[0];
  return (
    <div style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
      <LicenseSelector legend="License" options={options} value={license} onChange={setLicense} />
      <Button size="lg" leadingIcon="shopping-bag-01" style={{ width: '100%' }}>{'Buy for ' + chosen.price}</Button>
    </div>
  );
}`),
    },
    {
      title: 'Unavailable license',
      desc: 'Set disabled on an option the creator doesn’t offer, and say so in its description.',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%' }}>
  <LicenseSelector
    legend="License"
    defaultValue="commercial"
    options={[
      { value: 'personal', title: 'Personal', description: 'For your own projects and portfolio.', price: '$19' },
      { value: 'commercial', title: 'Commercial', description: 'For client work and one product you sell.', price: '$39' },
      { value: 'extended', title: 'Extended', description: 'Mira doesn’t offer this license for this pack.', price: '', disabled: true },
    ]}
  />
</div>`),
    },
    {
      title: 'Free and paid',
      desc: 'Free items can still offer a paid Commercial license. Write “Free” as the price, not $0.',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%' }}>
  <LicenseSelector
    legend="License"
    options={[
      { value: 'personal', title: 'Personal', description: 'For your own projects. Credit the creator.', price: 'Free' },
      { value: 'commercial', title: 'Commercial', description: 'For client work. No credit needed.', price: '$29' },
    ]}
  />
</div>`),
    },
    {
      title: 'Purchase panel',
      desc: 'The side panel on a listing page: title, creator, licenses, the buy action and a link to compare licenses in full.',
      stage: 'muted',
      ...ex(`function Example() {
  const options = [
    { value: 'personal', title: 'Personal', description: 'For your own projects and portfolio.', price: '$49' },
    { value: 'commercial', title: 'Commercial', description: 'For client work and one product you sell.', price: '$99' },
    { value: 'extended', title: 'Extended', description: 'For products you sell to many people.', price: '$249' },
  ];
  const [license, setLicense] = useState('commercial');
  const price = options.filter(o => o.value === license)[0].price;
  return (
    <div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
        <span style={{ font: '600 24px/32px var(--font-display)', color: 'var(--text-primary)' }}>Orbit dashboard UI kit</span>
        <span style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
          <Avatar size="xs" initials="MO" color="pop-violet" />Mira Okafor
          <Rating value={4.8} count={312} size="sm" />
        </span>
      </div>
      <LicenseSelector legend="License" options={options} value={license} onChange={setLicense} />
      <Button size="lg" leadingIcon="shopping-bag-01" style={{ width: '100%' }}>{'Buy for ' + price}</Button>
      <Link href="#" style={{ justifySelf: 'center' }}>Compare licenses</Link>
    </div>
  );
}`),
    },
  ],

  props: {
    LicenseSelector: [
      ['options', 'Array<{ value: string, title: string, description: string, price: ReactNode, disabled?: boolean }>', '', 'One card per license, in the order shown.'],
      ['legend', 'string', '', 'Group label above the cards, rendered as the fieldset <legend>.'],
      ['value', 'string', '', 'Controlled selection. Pair with onChange.'],
      ['defaultValue', 'string', 'options[0].value', 'Starting selection when uncontrolled.'],
      ['onChange', '(value: string) => void', '', 'Called with the value of the chosen option.'],
      ['name', 'string', '', 'Shared radio name. Generated when omitted; set it when the form posts the value.'],
      ['className', 'string', '', 'Added to the <fieldset>.'],
    ],
  },

  usage: {
    when: [
      'To pick a license before buying or downloading an asset.',
      'For any single choice where each option needs a short description and a price.',
    ],
    whenNot: [
      'For plain options without descriptions or prices. Use Radio buttons.',
      'For add-ons people can combine, like extra seats or source files. Use Checkboxes.',
      'To compare many features across licenses. Link to a full comparison table.',
    ],
    anatomy: {
      render: <div style={{ width: 360 }}><LicenseSelector legend="License" options={LICENSES.slice(0, 2)} /></div>,
      parts: [
        'Legend: label-md (Inter Display SemiBold 15/20) in text-primary.',
        'Card: radius-lg, 1px border-default, bg-surface, padded space-md. Hover uses border-hover.',
        'Selected card: 2px border-selected, with the radio filled in action-primary-default and a springing dot.',
        'Title: Inter Display SemiBold 15/20 in text-primary.',
        'Description: 400 14/20 in text-secondary.',
        'Price: Inter Display SemiBold 15/20 with tabular-nums, aligned right.',
      ],
    },
    sections: [
      {
        title: 'Write descriptions people can decide with',
        body: 'Buyers choose by what they are allowed to do. Say it in concrete terms: who it is for and the limit that matters.',
        dos: [
          {
            do: <div style={w}><LicenseSelector legend="License" options={LICENSES.slice(0, 2)} /></div>,
            doText: 'Describe what each license allows, in the buyer’s words.',
            dont: <div style={w}><LicenseSelector legend="License" options={[{ value: 'p', title: 'Personal', description: 'Standard usage rights apply.', price: '$49' }, { value: 'c', title: 'Commercial', description: 'See terms for details.', price: '$99' }]} /></div>,
            dontText: 'Don’t use legal shorthand. “Standard usage rights apply” doesn’t help anyone choose.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={w}><LicenseSelector legend="License" defaultValue="personal" options={LICENSES} /></div>,
        doText: 'Preselect the license most buyers need, usually the cheapest.',
        dont: <div style={w}><LicenseSelector legend="License" defaultValue="extended" options={LICENSES} /></div>,
        dontText: 'Don’t preselect the most expensive license. It reads as an upsell trick and buyers lose trust.',
      },
      {
        do: <div style={w}><LicenseSelector legend="License" options={LICENSES.slice(0, 2)} /></div>,
        doText: 'Show a price on every card, so people can compare.',
        dont: <div style={w}><LicenseSelector legend="License" options={LICENSES.slice(0, 2).map(o => ({ ...o, price: '' }))} /></div>,
        dontText: 'Don’t hide prices until checkout. People pick blind, then abandon the cart.',
      },
      {
        do: <div style={w}><LicenseSelector legend="License" options={LICENSES.slice(0, 2)} /></div>,
        doText: 'Use the License selector so every term is visible before people buy.',
        dont: <div style={w}><Select label="License" defaultValue="commercial" options={[{ value: 'personal', label: 'Personal – $49' }, { value: 'commercial', label: 'Commercial – $99' }]} /></div>,
        dontText: 'Don’t put licenses in a Select. The descriptions disappear and people buy the wrong one.',
      },
      {
        do: <div style={w}><LicenseSelector legend="License" options={LICENSES} /></div>,
        doText: 'Offer 2–3 licenses with clear steps between them.',
        dont: <div style={w}><LicenseSelector legend="License" options={[{ value: 'a', title: 'Personal', description: 'Own projects.', price: '$49' }, { value: 'b', title: 'Personal Plus', description: 'Own projects, 2 seats.', price: '$59' }, { value: 'c', title: 'Commercial', description: 'Client work.', price: '$99' }, { value: 'd', title: 'Commercial Plus', description: 'Client work, 5 seats.', price: '$129' }, { value: 'e', title: 'Extended', description: 'Products for sale.', price: '$249' }]} /></div>,
        dontText: 'Don’t offer near-identical tiers. Five similar cards turn a purchase into homework.',
      },
    ],
    content: [
      'Titles are the license names used everywhere else: Personal, Commercial, Extended.',
      'Descriptions are one sentence that starts with who it is for: “For client work and one product you sell.”',
      'Prices include the currency symbol: “$99”. Use “Free”, never “$0”.',
      'Repeat the chosen price in the buy button: “Buy for $99”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus into the group, onto the selected license.'],
      ['↑ / ↓', 'Moves to the previous or next license and selects it.'],
      ['Tab (again)', 'Leaves the group. The whole group is one tab stop.'],
    ],
    notes: [
      'Each card is a <label> around a native radio, inside a <fieldset> with a <legend>. Screen readers read “License, Commercial, 2 of 3”.',
      'The title, description and price are all inside the label, so they are read with the option.',
      'The selected card has a 2px border and a filled radio, so selection never depends on color alone.',
      'The focus ring shows on the radio circle. Disabled options are skipped by arrow keys.',
      'The dot springs in over 200ms. Under prefers-reduced-motion, it appears without motion.',
    ],
  },

  related: ['radio', 'button', 'price-tag'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'License selector in React and HTML/CSS, matching the Figma component (default, hover, selected, disabled cards).' },
  ],
};
