const fieldset = { margin: 0, padding: 0, border: 0, display: 'grid' };
const legend = { marginBottom: 'var(--space-2xs)' };
const COUNTRIES = ['Brazil', 'Canada', 'Germany', 'India', 'Japan', 'Nigeria', 'United Kingdom', 'United States'];

export default {
  id: 'radio',
  name: 'Radio',
  group: 'Selection',
  order: 2,
  status: 'Stable',
  figma: '20:1226',
  exports: ['Radio'],
  summary: 'A round control for picking exactly one option from a short list. Group 2–5 radios in a fieldset with a legend so every choice is visible at once.',

  examples: [
    {
      title: 'Group with a legend',
      desc: 'Wrap the radios in a fieldset with a legend, give them the same name and control the group with one piece of state.',
      ...ex(`function Example() {
  const [format, setFormat] = useState('figma');
  return (
    <fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid' }}>
      <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Main file format</legend>
      <Radio name="format" value="figma" label="Figma" checked={format === 'figma'} onChange={e => setFormat(e.target.value)} />
      <Radio name="format" value="sketch" label="Sketch" checked={format === 'sketch'} onChange={e => setFormat(e.target.value)} />
      <Radio name="format" value="xd" label="Adobe XD" checked={format === 'xd'} onChange={e => setFormat(e.target.value)} />
    </fieldset>
  );
}`),
    },
    {
      title: 'Uncontrolled',
      desc: 'For a plain form, use defaultChecked and read the value on submit through the shared name.',
      ...ex(`
<fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid' }}>
  <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Payout schedule</legend>
  <Radio name="schedule" value="weekly" label="Weekly" defaultChecked />
  <Radio name="schedule" value="monthly" label="Monthly" />
  <Radio name="schedule" value="manual" label="Only when I ask" />
</fieldset>`),
    },
    {
      title: 'With descriptions',
      desc: 'label accepts any content. Add a muted second line when the options need a word of explanation.',
      ...ex(`function Example() {
  const [speed, setSpeed] = useState('standard');
  const option = (value, title, detail) => (
    <Radio
      name="speed"
      value={value}
      checked={speed === value}
      onChange={e => setSpeed(e.target.value)}
      label={
        <span style={{ display: 'grid' }}>
          <span>{title}</span>
          <span style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>{detail}</span>
        </span>
      }
    />
  );
  return (
    <fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid', gap: 'var(--space-xs)' }}>
      <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Payout speed</legend>
      {option('standard', 'Standard', 'Free · arrives in 3–5 business days')}
      {option('express', 'Express', '$2 fee · arrives next business day')}
    </fieldset>
  );
}`),
    },
    {
      title: 'Disabled option',
      desc: 'Disable an option people can’t pick yet, and say how to unlock it in the label.',
      ...ex(`
<fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid' }}>
  <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Payout method</legend>
  <Radio name="method" value="bank" label="Bank transfer" defaultChecked />
  <Radio name="method" value="paypal" label="PayPal" />
  <Radio name="method" value="instant" label="Instant to card (after 10 sales)" disabled />
</fieldset>`),
    },
    {
      title: 'Horizontal',
      desc: 'Two or three very short options can sit in a row. Keep space-lg between them so each label clearly belongs to its circle.',
      ...ex(`
<fieldset style={{ margin: 0, padding: 0, border: 0 }}>
  <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>Show prices in</legend>
  <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
    <Radio name="currency" value="USD" label="USD" defaultChecked />
    <Radio name="currency" value="EUR" label="EUR" />
    <Radio name="currency" value="GBP" label="GBP" />
  </div>
</fieldset>`),
    },
    {
      title: 'Refund request',
      desc: 'A refund form: one reason from a short list, then details and the action.',
      stage: 'muted',
      ...ex(`function Example() {
  const [reason, setReason] = useState('');
  const reasons = ['Files are missing or broken', 'It isn’t what the preview showed', 'I bought it by mistake', 'Something else'];
  return (
    <form style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }} onSubmit={e => e.preventDefault()}>
      <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Request a refund</span>
      <fieldset style={{ margin: 0, padding: 0, border: 0, display: 'grid' }}>
        <legend className="mds-field__label" style={{ marginBottom: 'var(--space-2xs)' }}>What went wrong?</legend>
        {reasons.map(r => (
          <Radio key={r} name="refund-reason" value={r} label={r} checked={reason === r} onChange={e => setReason(e.target.value)} />
        ))}
      </fieldset>
      <Textarea label="Details" optional rows={3} />
      <Button type="submit" style={{ justifySelf: 'end' }}>Send request</Button>
    </form>
  );
}`),
    },
  ],

  props: {
    Radio: [
      ['label', 'ReactNode', '', 'Text after the circle. The whole row is the click target.'],
      ['name', 'string', '', 'Shared by every radio in a group. It links them, so only one can be checked and arrow keys move between them.'],
      ['value', 'string', '', 'The value submitted and read in onChange as e.target.value.'],
      ['checked', 'boolean', '', 'Controlled state. Pair with onChange.'],
      ['defaultChecked', 'boolean', '', 'Starting state when uncontrolled.'],
      ['onChange', '(event) => void', '', 'Native change event. Fires on the radio that becomes checked.'],
      ['disabled', 'boolean', 'false', 'Greys the circle and label and blocks clicks.'],
      ['className', 'string', '', 'Added to the row <label>.'],
      ['...rest', 'InputHTMLAttributes', '', 'Passed to the <input type="radio">: required, aria-describedby.'],
    ],
  },

  usage: {
    when: [
      'To pick exactly one option from 2–5 that people should compare: a payout schedule, a file format, a refund reason.',
      'When one option is a sensible default you can preselect.',
    ],
    whenNot: [
      'For more than 5 options or a familiar list like countries. Use a Select.',
      'For a single on/off setting. Use a Switch or a Checkbox.',
      'To pick a license with a description and price. Use the License selector.',
      'To filter results. Use Chips.',
    ],
    anatomy: {
      render: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout schedule</legend><Radio name="anat-sched" label="Weekly" defaultChecked /><Radio name="anat-sched" label="Monthly" /></fieldset>,
      parts: [
        'Legend: label-md (Inter Display SemiBold 15/20) in text-primary. Names the group.',
        'Circle: 20px (size-icon-md), radius-full, 2px border-strong, bg-surface.',
        'Selected: fill turns action-primary-default and an 8px control-knob dot springs from 0 to full size.',
        'Label: body 16/24 in text-primary, space-xs from the circle.',
        'Row: at least 44px tall (size-touch-target). Focus shows shadow-focus-ring around the circle.',
      ],
    },
    sections: [
      {
        title: 'Radio or select',
        body: 'Show 2–5 options as Radio buttons so people can compare them without opening anything. Switch to a Select when the list is long or the options are familiar.',
        dos: [
          {
            do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout schedule</legend><Radio name="rd-do-sched" label="Weekly" defaultChecked /><Radio name="rd-do-sched" label="Monthly" /><Radio name="rd-do-sched" label="Only when I ask" /></fieldset>,
            doText: 'Use Radio buttons for 2–5 options so every choice is visible.',
            dont: <div style={{ width: 260 }}><Select label="Payout schedule" defaultValue="Weekly" options={['Weekly', 'Monthly', 'Only when I ask']} /></div>,
            dontText: 'Don’t hide three options in a Select. People have to open it to learn what they can pick.',
          },
          {
            do: <div style={{ width: 260 }}><Select label="Payout country" placeholder="Choose a country" options={COUNTRIES} /></div>,
            doText: 'Use a Select for long, familiar lists like countries.',
            dont: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout country</legend>{COUNTRIES.map(c => <Radio key={c} name="rd-dont-country" label={c} />)}</fieldset>,
            dontText: 'Don’t list 8 or more options as radios. The form gets long and the one answer is hard to find.',
          },
        ],
      },
      {
        title: 'Group with a fieldset',
        body: 'Wrap every group in a fieldset with a legend. Screen readers read the legend with each option, and the shared name lets arrow keys move through the group.',
        dos: [
          {
            do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Allow buyers to message you?</legend><Radio name="rd-do-msg" label="Yes" defaultChecked /><Radio name="rd-do-msg" label="No" /></fieldset>,
            doText: 'Give the group a legend that asks the question.',
            dont: <div style={{ display: 'grid' }}><Radio name="rd-dont-msg" label="Yes" defaultChecked /><Radio name="rd-dont-msg" label="No" /></div>,
            dontText: 'Don’t leave a group without a legend. “Yes” and “No” mean nothing on their own.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout schedule</legend><Radio name="rd-do-def" label="Weekly" defaultChecked /><Radio name="rd-do-def" label="Monthly" /></fieldset>,
        doText: 'Preselect the option most people want, when there is a safe default.',
        dont: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Payout schedule</legend><Radio name="rd-dont-def" label="Weekly" /><Radio name="rd-dont-def" label="Monthly" /></fieldset>,
        dontText: 'Don’t leave a group empty when one answer is clearly the usual one. People stop to decide something that didn’t need deciding.',
      },
      {
        do: <Switch label="Show my sales count" defaultChecked />,
        doText: 'Use a Switch for a single setting that is on or off.',
        dont: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Show my sales count</legend><Radio name="rd-dont-onoff" label="On" defaultChecked /><Radio name="rd-dont-onoff" label="Off" /></fieldset>,
        dontText: 'Don’t use a pair of radios for on and off. It takes twice the space for one decision.',
      },
      {
        do: <fieldset style={fieldset}><legend className="mds-field__label" style={legend}>Main file format</legend><Radio name="rd-do-par" label="Figma" defaultChecked /><Radio name="rd-do-par" label="Sketch" /><Radio name="rd-do-par" label="Adobe XD" /></fieldset>,
        doText: 'Keep options short and parallel so they are easy to scan.',
        dont: <fieldset style={{ ...fieldset, width: 260 }}><legend className="mds-field__label" style={legend}>Main file format</legend><Radio name="rd-dont-par" label="Figma" defaultChecked /><Radio name="rd-dont-par" label="I designed it in Sketch and exported it" /><Radio name="rd-dont-par" label="XD" /></fieldset>,
        dontText: 'Don’t mix lengths and styles. The odd one out pulls focus and the list is harder to compare.',
      },
    ],
    content: [
      'Legends ask the question or name the setting: “What went wrong?”, “Payout schedule”.',
      'Options are short, parallel and in sentence case with no end punctuation.',
      'Order options logically: most common first, or smallest to largest.',
      'Explain a disabled option in its label or right below it: “Instant to card (after 10 sales)”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus into the group, onto the checked radio (or the first one).'],
      ['↑ / ← and ↓ / →', 'Moves to the previous or next radio in the group and checks it.'],
      ['Space', 'Checks the focused radio if none is checked.'],
      ['Tab (again)', 'Leaves the group. The whole group is one tab stop.'],
    ],
    notes: [
      'Uses native <input type="radio"> inside a <label>. Radios with the same name form one group, so arrow keys and “1 of 3” announcements work for free.',
      'Wrap each group in <fieldset> with a <legend>; there is no group component, so this markup is up to you.',
      'Rows are at least 44px tall. The circle border (border-strong) has 3:1 contrast; the selected state adds a filled circle and a dot, not color alone.',
      'The dot springs in over 200ms. Under prefers-reduced-motion, it appears without motion.',
    ],
  },

  related: ['checkbox', 'select', 'license-selector', 'switch'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Radio in React and HTML/CSS, matching the Figma component (unselected, selected × default, hover, focus, disabled).' },
  ],
};
