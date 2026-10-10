const fieldset = { margin: 0, padding: 0, border: 0, display: 'grid' };
const legend = { marginBottom: 'var(--space-2xs)' };
const panel = { width: 280, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' };
const title = { font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' };
const note = { font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' };

export default {
  id: 'checkbox',
  name: 'Checkbox',
  group: 'Selection',
  order: 1,
  status: 'Stable',
  figma: '20:1194',
  exports: ['Checkbox'],
  summary: 'A 20px box in a 44px row for turning an option on or off inside a form. Use it for independent choices and agreements that take effect when people press Save or Buy.',

  examples: [
    {
      title: 'Default',
      desc: 'Control it with checked and onChange, or leave it uncontrolled with defaultChecked. The whole row, label included, is the click target.',
      ...ex(`function Example() {
  const [source, setSource] = useState(true);
  return (
    <Checkbox
      label="Include source files"
      checked={source}
      onChange={e => setSource(e.target.checked)}
    />
  );
}`),
    },
    {
      title: 'States',
      desc: 'Unchecked, checked, disabled and disabled checked. Uncontrolled checkboxes take defaultChecked; the tick springs in from CSS when the box is checked.',
      ...ex(`
<div style={{ display: 'grid' }}>
  <Checkbox label="Unchecked" />
  <Checkbox label="Checked" defaultChecked />
  <Checkbox label="Disabled" disabled />
  <Checkbox label="Disabled and checked" disabled defaultChecked />
</div>`),
    },
    {
      title: 'Select all',
      desc: 'A parent checkbox shows indeterminate (a minus) when only some of its children are checked. Checking it selects them all.',
      ...ex(`function Example() {
  const listings = ['Orbit dashboard UI kit', 'Doodle icon pack', 'Pitch deck template'];
  const [picked, setPicked] = useState(['Doodle icon pack']);
  const all = picked.length === listings.length;
  const some = picked.length > 0 && !all;
  function toggle(name) {
    setPicked(picked.indexOf(name) >= 0 ? picked.filter(p => p !== name) : picked.concat(name));
  }
  return (
    <div style={{ display: 'grid' }}>
      <Checkbox
        label={'Select all listings (' + picked.length + ' of ' + listings.length + ')'}
        checked={all}
        indeterminate={some}
        onChange={() => setPicked(all ? [] : listings)}
      />
      <div style={{ display: 'grid', paddingLeft: 'var(--space-xl)' }}>
        {listings.map(name => (
          <Checkbox key={name} label={name} checked={picked.indexOf(name) >= 0} onChange={() => toggle(name)} />
        ))}
      </div>
    </div>
  );
}`),
    },
    {
      title: 'With a description',
      desc: 'label accepts any content, so you can add a muted line that explains the option.',
      ...ex(`function Example() {
  const [on, setOn] = useState(true);
  return (
    <Checkbox
      checked={on}
      onChange={e => setOn(e.target.checked)}
      label={
        <span style={{ display: 'grid' }}>
          <span>Email me when I make a sale</span>
          <span style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>
            One email per sale, with the license and buyer country.
          </span>
        </span>
      }
    />
  );
}`),
    },
    {
      title: 'Required agreement',
      desc: 'Leave agreements unchecked. If people press Buy without checking, keep the button enabled and say what to do next to the box.',
      ...ex(`function Example() {
  const [agreed, setAgreed] = useState(false);
  const [tried, setTried] = useState(false);
  return (
    <div style={{ width: 360, maxWidth: '100%', display: 'grid', gap: 'var(--space-xs)' }}>
      <Checkbox
        required
        checked={agreed}
        onChange={e => setAgreed(e.target.checked)}
        label={<span>I agree to the <Link href="#">Extended license terms</Link></span>}
      />
      {tried && !agreed && (
        <span style={{ display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center', font: '500 12px/16px var(--font-display)', color: 'var(--feedback-error-text)' }}>
          <Icon name="alert-circle" size={16} />Agree to the license terms to continue.
        </span>
      )}
      <Button size="lg" style={{ marginTop: 'var(--space-sm)' }} onClick={() => setTried(true)}>Buy for $249</Button>
    </div>
  );
}`),
    },
    {
      title: 'In a settings form',
      desc: 'Email preferences are saved together, so they use Checkboxes and a Save button.',
      stage: 'muted',
      ...ex(`
<form style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }} onSubmit={e => e.preventDefault()}>
  <fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid' }}>
    <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Email me about</legend>
    <Checkbox name="email" value="sales" label="New sales" defaultChecked />
    <Checkbox name="email" value="reviews" label="Reviews on my listings" defaultChecked />
    <Checkbox name="email" value="followers" label="New followers" />
    <Checkbox name="email" value="tips" label="Tips for creators" />
  </fieldset>
  <Button type="submit" style={{ justifySelf: 'end' }}>Save preferences</Button>
</form>`),
    },
  ],

  props: {
    Checkbox: [
      ['label', 'ReactNode', '', 'Text after the box. The whole row is the click target.'],
      ['checked', 'boolean', '', 'Controlled state. Pair with onChange.'],
      ['defaultChecked', 'boolean', '', 'Starting state when uncontrolled.'],
      ['indeterminate', 'boolean', 'false', 'Shows a minus and sets the native indeterminate property, so screen readers announce “mixed”. Use for a “select all” parent when only some children are checked.'],
      ['onChange', '(event) => void', '', 'Native change event. Read e.target.checked.'],
      ['disabled', 'boolean', 'false', 'Greys the box and label and blocks clicks.'],
      ['className', 'string', '', 'Added to the row <label>.'],
      ['...rest', 'InputHTMLAttributes', '', 'Passed to the <input type="checkbox">: name, value, required, aria-describedby.'],
    ],
  },

  usage: {
    when: [
      'To pick any number of options from a list, such as the file formats in a listing.',
      'For one opt-in or agreement, such as accepting license terms.',
      'For settings in a form that people save with a button.',
    ],
    whenNot: [
      'For a setting that applies the moment it changes. Use a Switch.',
      'When only one option can be chosen. Use Radio buttons.',
      'To filter a results grid. Use Chips.',
    ],
    anatomy: {
      render: <Checkbox label="Include source files" defaultChecked />,
      parts: [
        'Row: at least 44px tall (size-touch-target). The label and box share one click target.',
        'Box: 20px (size-icon-md), radius-xs, 2px border-strong, bg-surface.',
        'Checked: fill and border turn action-primary-default, and a 14px tick-02 in text-on-action springs in. Indeterminate shows minus-sign.',
        'Label: body 16/24 in text-primary, space-xs from the box.',
        'Focus: shadow-focus-ring around the box on keyboard focus.',
      ],
    },
    sections: [
      {
        title: 'Checkbox or switch',
        body: 'A Checkbox records a choice that takes effect when people press Save. A Switch changes the setting the moment it flips. Pick by what happens next.',
        dos: [
          {
            do: <div style={panel}><span style={title}>Email me about</span><div style={{ display: 'grid' }}><Checkbox label="New sales" defaultChecked /><Checkbox label="New followers" /></div><Button size="sm" style={{ justifySelf: 'end' }}>Save</Button></div>,
            doText: 'Use Checkboxes when the form has a Save button.',
            dont: <div style={panel}><span style={title}>Email me about</span><div style={{ display: 'grid' }}><Switch label="New sales" defaultChecked /><Switch label="New followers" /></div><Button size="sm" style={{ justifySelf: 'end' }}>Save</Button></div>,
            dontText: 'Don’t use Switches next to a Save button. People think the change is live, leave the page and lose it.',
          },
        ],
      },
      {
        title: 'Grouping',
        body: 'Put related checkboxes in a fieldset with a legend, one per row. The legend tells screen readers what the group is about.',
        dos: [
          {
            do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>File formats</legend><Checkbox label="Figma" defaultChecked /><Checkbox label="Sketch" /><Checkbox label="Adobe XD" /></fieldset>,
            doText: 'Stack options in one column under a legend.',
            dont: <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 'var(--space-2xs)', width: 240 }}><Checkbox label="Figma" defaultChecked /><Checkbox label="Sketch" /><Checkbox label="Adobe XD" /></div>,
            dontText: 'Don’t pack them into a wrapping row with no legend. It is hard to see which label goes with which box, and the group has no name.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Checkbox label="Email me about new followers" />,
        doText: 'Write the label so checking it turns something on.',
        dont: <Checkbox label="Don’t email me about new followers" />,
        dontText: 'Don’t use negative labels. People have to work out what an unchecked “don’t” means.',
      },
      {
        do: <div style={{ display: 'grid' }}><Checkbox label="I agree to the license terms" /><Checkbox label="Send me creator tips" /></div>,
        doText: 'Leave agreements and marketing opt-ins unchecked, so people choose them.',
        dont: <div style={{ display: 'grid' }}><Checkbox label="I agree to the license terms" defaultChecked /><Checkbox label="Send me creator tips" defaultChecked /></div>,
        dontText: 'Don’t pre-check consent. It isn’t a real choice, and in many regions it isn’t legal.',
      },
      {
        do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>License</legend><Radio name="cb-do-lic" label="Personal" defaultChecked /><Radio name="cb-do-lic" label="Commercial" /></fieldset>,
        doText: 'Use Radio buttons when only one option can be true.',
        dont: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>License</legend><Checkbox label="Personal" defaultChecked /><Checkbox label="Commercial" defaultChecked /></fieldset>,
        dontText: 'Don’t use Checkboxes for a single choice. People can tick both licenses, and you have to handle it.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}><Checkbox label="Instant payouts" disabled /><span style={note}>Available after your first 10 sales.</span></div>,
        doText: 'When an option is disabled, say why right below it.',
        dont: <Checkbox label="Instant payouts" disabled />,
        dontText: 'Don’t disable an option with no reason. People can’t tell how to unlock it.',
      },
    ],
    content: [
      'Labels are short and positive: “Include source files”, “Email me about new sales”.',
      'Use sentence case and no end punctuation, unless the label is a full sentence with a link.',
      'Legends name the group: “Email me about”, “File formats”.',
      'For a “select all” parent, show the count: “Select all listings (1 of 3)”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the checkbox and shows the focus ring on the box.'], ['Space', 'Checks or unchecks it.']],
    notes: [
      'Uses a native <input type="checkbox"> inside a <label>, so the label is read and clicking it toggles the box.',
      'The input is visually hidden, not display: none, so it stays in the tab order.',
      'Indeterminate sets the input’s native indeterminate property, so screen readers announce “mixed”, and shows a minus icon.',
      'Rows are at least 44px tall. The unchecked border (border-strong) has 3:1 contrast, and the checked fill is blue-600 with a white tick.',
      'The fill changes over 120ms and the tick springs in from 0.6 scale over 200ms.',
    ],
  },

  related: ['switch', 'radio', 'chip'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'The tick now shows from CSS on :checked, so uncontrolled checkboxes work, and it springs in. Indeterminate sets the native indeterminate property instead of aria-checked.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Checkbox in React and HTML/CSS, matching the Figma component (unchecked, checked, indeterminate × default, hover, focus, disabled).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Checked fill moved to blue-600 (action-primary-default) and the tick moved to the Hugeicons stroke tick-02.' },
  ],
};
