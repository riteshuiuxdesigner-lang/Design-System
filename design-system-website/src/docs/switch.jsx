const panel = { width: 280, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' };
const title = { font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' };
const note = { font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' };

export default {
  id: 'switch',
  name: 'Switch',
  group: 'Selection',
  order: 3,
  status: 'Stable',
  figma: '20:1262',
  exports: ['Switch'],
  summary: 'A pill toggle for a setting that takes effect the moment it flips, like vacation mode or showing your sales count. There is no Save step.',

  examples: [
    {
      title: 'Default',
      desc: 'Control it with checked and onChange, and show the effect right away. Here, vacation mode pauses the store.',
      ...ex(`function Example() {
  const [away, setAway] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
      <Switch label="Vacation mode" checked={away} onChange={e => setAway(e.target.checked)} />
      {away ? <Badge variant="warning" icon="moon-02">Store paused</Badge> : <Badge variant="success" icon="store-01">Store open</Badge>}
    </div>
  );
}`),
    },
    {
      title: 'States',
      desc: 'Off, on, disabled off and disabled on. Because the look comes from the native checkbox, defaultChecked works without state.',
      ...ex(`
<div style={{ display: 'grid' }}>
  <Switch label="Off" />
  <Switch label="On" defaultChecked />
  <Switch label="Disabled off" disabled />
  <Switch label="Disabled on" disabled defaultChecked />
</div>`),
    },
    {
      title: 'Confirm with a Toast',
      desc: 'A change that saves on its own should still answer. Show a short Toast in the past tense.',
      ...ex(`function Example() {
  const [custom, setCustom] = useState(true);
  const [toast, setToast] = useState('');
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'start' }}>
      <Switch
        label="Accept custom requests"
        checked={custom}
        onChange={e => { setCustom(e.target.checked); setToast(e.target.checked ? 'Custom requests turned on' : 'Custom requests turned off'); }}
      />
      {toast && <Toast message={toast} />}
    </div>
  );
}`),
    },
    {
      title: 'Settings rows',
      desc: 'In a settings list, put the text on the left and the switch on the right. Link the switch to its title with aria-labelledby.',
      ...ex(`function Example() {
  const [on, setOn] = useState({ count: true, reviews: false });
  const row = (key, title, detail) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', justifyContent: 'space-between' }}>
      <span style={{ display: 'grid' }}>
        <span id={'set-' + key} style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>{detail}</span>
      </span>
      <Switch aria-labelledby={'set-' + key} checked={on[key]} onChange={e => setOn(Object.assign({}, on, { [key]: e.target.checked }))} />
    </div>
  );
  return (
    <div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
      {row('count', 'Show sales count', 'Buyers see “1,204 sales” on your listings.')}
      <Divider />
      {row('reviews', 'Hide reviews under 3 stars', 'They stay in your dashboard.')}
    </div>
  );
}`),
    },
    {
      title: 'Store settings',
      desc: 'Each switch saves on its own, so the panel has no Save button.',
      stage: 'muted',
      ...ex(`function Example() {
  const [s, setS] = useState({ away: false, messages: true, followers: true });
  const set = key => e => setS(Object.assign({}, s, { [key]: e.target.checked }));
  return (
    <div style={{ width: 380, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Store</span>
      <div style={{ display: 'grid' }}>
        <Switch label="Vacation mode" checked={s.away} onChange={set('away')} />
        <Switch label="Let buyers message me" checked={s.messages} onChange={set('messages')} />
        <Switch label="Show my follower count" checked={s.followers} onChange={set('followers')} />
      </div>
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Changes save automatically.</span>
    </div>
  );
}`),
    },
  ],

  props: {
    Switch: [
      ['label', 'ReactNode', '', 'Text after the track. The whole row is the click target. Leave it out only when you pass aria-label or aria-labelledby.'],
      ['checked', 'boolean', '', 'Controlled state. Pair with onChange.'],
      ['defaultChecked', 'boolean', '', 'Starting state when uncontrolled.'],
      ['onChange', '(event) => void', '', 'Native change event. Read e.target.checked and apply the setting right away.'],
      ['disabled', 'boolean', 'false', 'Greys the track and label and blocks clicks.'],
      ['className', 'string', '', 'Added to the row <label>.'],
      ['...rest', 'InputHTMLAttributes', '', 'Passed to the <input role="switch">: name, aria-label, aria-labelledby, aria-describedby.'],
    ],
  },

  usage: {
    when: [
      'For a setting that applies right away: vacation mode, showing your sales count, letting buyers message you.',
      'In settings lists where each row saves on its own.',
    ],
    whenNot: [
      'When the change waits for a Save or Submit button. Use a Checkbox.',
      'To choose between two named options, like Monthly and Yearly. Use Tabs or Radio buttons.',
      'For an agreement, like accepting license terms. Use a Checkbox.',
    ],
    anatomy: {
      render: <Switch label="Vacation mode" defaultChecked />,
      parts: [
        'Track: 44 × 24px (size-control-md by size-icon-lg), radius-full. Off uses border-strong, on uses action-primary-default.',
        'Knob: 20px (size-icon-md) circle in control-knob with elevation-1. Slides 20px with a spring over 320ms.',
        'Label: body 16/24 in text-primary, space-xs from the track.',
        'Row: at least 44px tall (size-touch-target). Focus shows shadow-focus-ring around the track.',
      ],
    },
    sections: [
      {
        title: 'Switch or checkbox',
        body: 'A Switch is a promise that the change happens now. If the setting waits for a button, use a Checkbox instead.',
        dos: [
          {
            do: <div style={panel}><span style={title}>Store</span><div style={{ display: 'grid' }}><Switch label="Vacation mode" /><Switch label="Let buyers message me" defaultChecked /></div><span style={note}>Changes save automatically.</span></div>,
            doText: 'Use Switches where each change applies right away, with no Save button.',
            dont: <div style={panel}><span style={title}>Store</span><div style={{ display: 'grid' }}><Switch label="Vacation mode" /><Switch label="Let buyers message me" defaultChecked /></div><Button size="sm" style={{ justifySelf: 'end' }}>Save changes</Button></div>,
            dontText: 'Don’t make people press Save after flipping a Switch. They expect it already worked, leave, and lose the change.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Switch label="Vacation mode" defaultChecked />,
        doText: 'Name the setting. The track already shows whether it is on.',
        dont: <Switch label="On" defaultChecked />,
        dontText: 'Don’t label a Switch with its state. “On” doesn’t say what is on, and it reads wrong once flipped.',
      },
      {
        do: <Tabs label="Billing period" items={[{ value: 'm', label: 'Monthly' }, { value: 'y', label: 'Yearly' }]} defaultValue="y" />,
        doText: 'Use Tabs or Radio buttons to choose between two named options.',
        dont: <Switch label="Monthly / Yearly" defaultChecked />,
        dontText: 'Don’t use a Switch for two options. People can’t tell which side “on” means.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}><Switch label="Accept tips" disabled /><span style={note}>Connect a payout account to accept tips.</span></div>,
        doText: 'When a Switch is disabled, say what unlocks it.',
        dont: <Switch label="Accept tips" disabled />,
        dontText: 'Don’t disable a Switch with no reason. It looks broken.',
      },
    ],
    content: [
      'Labels name the setting in a few words: “Vacation mode”, “Show my sales count”.',
      'Avoid “Enable” and “Turn on” in labels; the Switch already says that.',
      'Confirm the change in the past tense with a Toast when it has a visible effect elsewhere: “Store paused”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the switch and shows the focus ring on the track.'], ['Space', 'Turns it on or off.']],
    notes: [
      'A native checkbox with role="switch", so screen readers announce “switch, on” or “switch, off”.',
      'The label wraps the input, so the label is read and clicking it toggles. Without a visible label, pass aria-label or aria-labelledby.',
      'Rows are at least 44px tall. The off track (border-strong) and the on track (blue-600) both have 3:1 contrast against the surface.',
      'The knob slides with a spring over 320ms. Under prefers-reduced-motion, it moves without animation.',
    ],
  },

  related: ['checkbox', 'radio', 'toast'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Switch in React and HTML/CSS, matching the Figma component (off, on × default, hover, focus, disabled).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'The on track moved to blue-600 (action-primary-default).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'The off track moved to pure-grey border-strong and the label moved to Inter Display.' },
  ],
};
