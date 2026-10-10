export default {
  id: 'progress-bar',
  name: 'Progress bar',
  group: 'Feedback',
  order: 4,
  status: 'Stable',
  figma: '20:1466',
  exports: ['ProgressBar'],
  summary: 'A thin pill track that fills as a task with a known size moves forward, like an upload or a payout goal. It shows a label and the percentage so people know how far along it is.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass a value from 0 to 100 and a label that says what is happening. The percentage is rounded and shown on the right in tabular figures.',
      ...ex(`
<div style={{ width: 360 }}>
  <ProgressBar label="Uploading Orbit UI Kit.fig" value={64} />
</div>`),
    },
    {
      title: 'Complete',
      desc: 'Switch tone to success when the task finishes, and change the label to the past tense.',
      ...ex(`
<div style={{ width: 360 }}>
  <ProgressBar label="Uploaded Orbit UI Kit.fig" value={100} tone="success" />
</div>`),
    },
    {
      title: 'Without the label row',
      desc: 'Set showLabel to false when the bar sits inside something that already names it, like a file row. The label still becomes the bar’s aria-label.',
      ...ex(`
<div style={{ width: 360, display: 'grid', gap: 'var(--space-2xs)' }}>
  <span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Neon Icon Pack.zip</span>
  <ProgressBar label="Uploading Neon Icon Pack.zip" value={38} showLabel={false} />
  <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>14.2 of 37.5 MB · about 20 seconds left</span>
</div>`),
    },
    {
      title: 'Live upload',
      desc: 'Update value as the task moves. The fill eases to each new width over 320ms, so frequent updates look smooth.',
      ...ex(`function Example() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setValue(v => Math.min(v + 7, 100)), 300);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (value === 100) setRunning(false);
  }, [value]);

  const done = value === 100;
  return (
    <div style={{ width: 360, display: 'grid', gap: 'var(--space-md)', justifyItems: 'start' }}>
      <div style={{ width: '100%' }}>
        <ProgressBar label={done ? 'Uploaded Dashboard UI Kit.fig' : 'Uploading Dashboard UI Kit.fig'} value={value} tone={done ? 'success' : undefined} />
      </div>
      {running
        ? <Button variant="secondary" size="sm" onClick={() => setRunning(false)}>Pause upload</Button>
        : <Button size="sm" leadingIcon={done ? 'refresh' : 'upload-01'} onClick={() => { if (done) setValue(0); setRunning(true); }}>{done ? 'Upload again' : value ? 'Resume upload' : 'Start upload'}</Button>}
    </div>
  );
}`),
    },
    {
      title: 'Progress toward a goal',
      desc: 'Use the same bar for a goal with a known end, like the minimum payout. Put the real amounts in the label so the percentage is not the only number.',
      ...ex(`
<div style={{ width: 360 }}>
  <ProgressBar label="$78.00 of $100.00 to your next payout" value={78} />
</div>`),
    },
    {
      title: 'In an upload list',
      desc: 'File Row uses Progress bar while a file uploads, then swaps it for a status line when the upload completes or fails.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 400, display: 'grid', gap: 'var(--space-xs)' }}>
  <FileRow name="Orbit UI Kit.fig" status="uploading" progress={72} meta="1.4 of 1.9 GB · 1 min left" />
  <FileRow name="Cover image.png" status="complete" meta="2.4 MB · Uploaded" />
  <FileRow name="Preview video.mp4" status="error" meta="Over 2 GB. Compress it, then retry." />
</div>`),
    },
  ],

  props: {
    ProgressBar: [
      ['value', 'number', '0', 'Progress from 0 to 100. Values outside the range are clamped.'],
      ['label', 'ReactNode', '', 'What is happening. Shown above the bar and used as its aria-label (falls back to “Progress”).'],
      ['showLabel', 'boolean', 'true', 'Set to false to hide the label and percentage row. The aria-label stays.'],
      ['tone', "'success'", '', 'Fills the bar with feedback-success-icon. Use it only when the task is complete.'],
      ['className', 'string', '', 'Extra class on the wrapper.'],
    ],
  },

  usage: {
    when: [
      'For a task with a known size that takes more than about 2 seconds: uploads, exports, downloads.',
      'To show progress toward a fixed goal, like the minimum payout amount.',
    ],
    whenNot: [
      'When you can’t measure progress. Use a Spinner for short waits or a Skeleton while content loads.',
      'For steps in a flow, like checkout. Use a Stepper.',
      'For tasks under about 2 seconds. A bar that flashes past is noise; use the Button’s loading state.',
    ],
    anatomy: {
      render: <div style={{ width: 360 }}><ProgressBar label="Uploading Orbit UI Kit.fig" value={64} /></div>,
      parts: [
        'Label: label (Inter Display SemiBold 14/20) in text-primary. Says what is happening.',
        'Percentage: Inter Display Medium 14/20 in text-secondary, tabular figures, rounded to a whole number.',
        'Track: size-track-sm (4px) pill (radius-full) in bg-muted.',
        'Fill: action-primary-default, or feedback-success-icon when complete. Eases its width over 320ms.',
      ],
    },
    sections: [
      {
        title: 'Determinate or not',
        body: 'Use Progress bar only when you know how much is left. If you can’t measure it, a bar that stalls or jumps feels broken. Use a Spinner instead.',
        dos: [
          {
            do: <div style={{ width: 300 }}><ProgressBar label="Uploading Orbit UI Kit.fig" value={42} /></div>,
            doText: 'Show a bar for a long upload so people can decide whether to wait.',
            dont: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>
                <Spinner /> Uploading Orbit UI Kit.fig
              </div>
            ),
            dontText: 'Don’t use a Spinner for a 2 GB upload. People can’t tell if it will take 10 seconds or 10 minutes.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 300 }}><ProgressBar label="Exporting 48 icons as SVG" value={55} /></div>,
        doText: 'Say what is happening, with the object.',
        dont: <div style={{ width: 300 }}><ProgressBar label="Loading..." value={55} /></div>,
        dontText: 'Don’t use “Loading” or “Please wait”. People want to know what they are waiting for.',
      },
      {
        do: <div style={{ width: 300 }}><ProgressBar label="Uploaded Orbit UI Kit.fig" value={100} tone="success" /></div>,
        doText: 'Turn the bar green only when the task is done.',
        dont: <div style={{ width: 300 }}><ProgressBar label="Uploading Orbit UI Kit.fig" value={45} tone="success" /></div>,
        dontText: 'Don’t use the success tone halfway. Green tells people it is finished.',
      },
      {
        do: (
          <div style={{ width: 300, display: 'grid', gap: 'var(--space-2xs)' }}>
            <span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Neon Icon Pack.zip</span>
            <ProgressBar label="Uploading Neon Icon Pack.zip" value={38} showLabel={false} />
          </div>
        ),
        doText: 'Hide the label row only when something next to the bar names it.',
        dont: <div style={{ width: 300 }}><ProgressBar value={38} showLabel={false} /></div>,
        dontText: 'Don’t show a bare bar. Nobody can tell what it measures, and screen readers only hear “Progress”.',
      },
    ],
    content: [
      'Label in the present tense while it runs (“Uploading Orbit UI Kit.fig”), past tense when done (“Uploaded”).',
      'Add time or size left under the bar when you know it: “1.4 of 1.9 GB · 1 min left”.',
      'For goals, use real amounts: “$78.00 of $100.00 to your next payout”.',
    ],
  },

  a11y: {
    notes: [
      'Progress bar is not interactive and takes no focus. Put Pause or Cancel in a Button next to it.',
      'The track has role="progressbar" with aria-valuenow, aria-valuemin="0" and aria-valuemax="100".',
      'The label becomes aria-label. Without one, screen readers only hear “Progress”, so always pass a label, even with showLabel={false}.',
      'Screen readers do not announce every change. Announce the end with a Toast or by changing the label, like “Uploaded Orbit UI Kit.fig”.',
      'The fill (action-primary-default) has at least 3:1 contrast with the bg-muted track.',
      'The fill eases its width over 320ms. Keep updates at least 200ms apart so it does not flicker. Under prefers-reduced-motion it jumps straight to the new width.',
    ],
  },

  related: ['spinner', 'skeleton', 'file-upload', 'stepper'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'The fill no longer animates its width under prefers-reduced-motion.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Progress bar in React and HTML/CSS, matching the Figma component (with label, percentage and success tone).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'The fill moved to blue-600 (action-primary-default) to match primary actions.' },
  ],
};
