export default {
  id: 'stepper',
  name: 'Stepper',
  group: 'Navigation',
  order: 7,
  status: 'Beta',
  figma: '42:2275',
  exports: ['Stepper'],
  summary: 'Shows where someone is in a multi-step flow, like publishing a listing: which steps are done, which one is open and what comes next. Pair it with Back and Next.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass the steps and the index of the current one. Steps before it show a check, the current one gets a blue ring, and the rest stay muted.',
      ...ex(`
<div style={{ width: 640 }}>
  <Stepper
    current={1}
    steps={[
      { label: 'Details' },
      { label: 'Files' },
      { label: 'Pricing' },
      { label: 'Review' },
    ]}
  />
</div>`),
    },
    {
      title: 'With descriptions',
      desc: 'Add a short description under a label when the name alone doesn’t say what the step asks for.',
      ...ex(`
<div style={{ width: 640 }}>
  <Stepper
    current={2}
    steps={[
      { label: 'Details', description: 'Name and category' },
      { label: 'Files', description: 'Source and previews' },
      { label: 'Pricing', description: 'Price and license' },
      { label: 'Review', description: 'Check and publish' },
    ]}
  />
</div>`),
    },
    {
      title: 'Start, middle and finished',
      desc: 'current={0} opens the first step. Set current to the number of steps to mark everything done after the last step succeeds.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-xl)', width: 560 }}>
  <Stepper current={0} steps={[{ label: 'Account' }, { label: 'Payout method' }, { label: 'Tax info' }]} />
  <Stepper current={1} steps={[{ label: 'Account' }, { label: 'Payout method' }, { label: 'Tax info' }]} />
  <Stepper current={3} steps={[{ label: 'Account' }, { label: 'Payout method' }, { label: 'Tax info' }]} />
</div>`),
    },
    {
      title: 'Publish a listing',
      desc: 'The full pattern. Keep the step in state, show that step’s fields under the Stepper, and move with Back and Next. The last step’s button says what happens: Publish listing.',
      stage: 'muted',
      ...ex(`function Example() {
  const steps = [
    { label: 'Details', description: 'Name and category' },
    { label: 'Files', description: 'Source and previews' },
    { label: 'Pricing', description: 'Price and license' },
    { label: 'Review', description: 'Check and publish' },
  ];
  const [step, setStep] = useState(0);
  const done = step === steps.length;
  const last = step === steps.length - 1;
  return (
    <div style={{ display: 'grid', gap: 'var(--space-xl)', width: 640, padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <Stepper steps={steps} current={step} />
      <div style={{ minHeight: 120 }}>
        {step === 0 && <TextField label="Listing name" defaultValue="Neon dashboard UI kit" helper="Buyers see this first. Keep it under 60 characters." />}
        {step === 1 && <FileRow name="neon-dashboard.fig" status="complete" meta="184 MB · Uploaded" />}
        {step === 2 && <TextField label="Price" leadingIcon="dollar-01" defaultValue="49" helper="You keep 85% of every sale." />}
        {step === 3 && <Alert variant="info" title="Ready to publish">Neon dashboard UI kit will go live at $49 with a commercial license.</Alert>}
        {done && <Alert variant="success" title="Published">Your listing is live. Share it from your dashboard.</Alert>}
      </div>
      {!done && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
          {step > 0 ? <Button variant="secondary" leadingIcon="arrow-left-01" onClick={() => setStep(step - 1)}>Back</Button> : <span />}
          <Button trailingIcon={last ? undefined : 'arrow-right-01'} onClick={() => setStep(step + 1)}>
            {last ? 'Publish listing' : 'Next'}
          </Button>
        </div>
      )}
      {done && <Button variant="secondary" onClick={() => setStep(0)} style={{ justifySelf: 'start' }}>Start a new listing</Button>}
    </div>
  );
}`),
    },
    {
      title: 'Payout setup',
      desc: 'Three steps are enough for most flows. Here a creator sets up payouts before their first sale.',
      ...ex(`
<div style={{ width: 520 }}>
  <Stepper
    current={1}
    steps={[
      { label: 'Account', description: 'Verified' },
      { label: 'Payout method', description: 'Bank or PayPal' },
      { label: 'Tax info', description: 'W-9 or W-8BEN' },
    ]}
  />
</div>`),
    },
  ],

  props: {
    Stepper: [
      ['steps', '{ label: string; description?: string }[]', '[]', 'The steps, in order. Keep labels to one or two words.'],
      ['current', 'number', '0', 'Index of the open step. Earlier steps show as done. Set it to steps.length when the flow is complete.'],
      ['className', 'string', '', 'Extra class on the list.'],
    ],
  },

  usage: {
    when: [
      'For a task split into 3–5 steps that must happen in order: publishing a listing, setting up payouts, onboarding a creator.',
      'When knowing how much is left helps people finish.',
    ],
    whenNot: [
      'For views people can open in any order, like a listing’s details and reviews. Use Tabs.',
      'For a short form that fits on one screen. Show it all at once.',
      'For page-by-page results. Use Pagination.',
      'To show upload or loading progress. Use a Progress bar.',
    ],
    anatomy: {
      render: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Details', description: 'Name' }, { label: 'Files', description: 'Upload' }, { label: 'Review' }]} /></div>,
      parts: [
        'Marker: 32px circle (size-avatar-sm) with a 2px border. Done fills action-primary-default with a white tick-02. Current has a blue border. Upcoming stays border-default with a muted number.',
        'Connector: 24px line before each step, 2px tall. Blue once the step before it is done.',
        'Label: 14/20 SemiBold in text-primary, or text-muted when upcoming.',
        'Description (optional): 12/16 Medium in text-muted.',
      ],
    },
    sections: [
      {
        title: 'Pair it with Back and Next',
        body: 'The Stepper shows progress. It is not clickable. Put Back (Secondary) and Next (Primary) under the step’s content, and name the last button after what happens, such as “Publish listing”.',
        dos: [
          {
            do: <div style={{ display: 'grid', gap: 'var(--space-lg)', width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Details' }, { label: 'Files' }, { label: 'Review' }]} /><div style={{ display: 'flex', justifyContent: 'space-between' }}><Button variant="secondary">Back</Button><Button>Next</Button></div></div>,
            doText: 'Let people go back to fix an earlier step.',
            dont: <div style={{ display: 'grid', gap: 'var(--space-lg)', width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Details' }, { label: 'Files' }, { label: 'Review' }]} /><div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button>Next</Button></div></div>,
            dontText: 'Don’t offer only Next. People who spot a mistake have to start over.',
          },
        ],
      },
      {
        title: 'Steps, not views',
        body: 'Every step depends on the one before it. If people can visit the parts in any order, they are views. Use Tabs.',
        dos: [
          {
            do: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Details' }, { label: 'Files' }, { label: 'Pricing' }]} /></div>,
            doText: 'Use a Stepper for a flow that has to happen in order.',
            dont: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Overview' }, { label: 'Reviews' }, { label: 'License' }]} /></div>,
            dontText: 'Don’t use it for parts of a listing page. Marking Overview as done makes no sense.',
          },
        ],
      },
      {
        title: 'Responsive behavior',
        body: 'Under 640px the steps stack vertically and the connectors hide, so long flows still fit on a phone. Keep labels short so each step stays on one line at every size.',
      },
    ],
    dos: [
      {
        do: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Details' }, { label: 'Files' }, { label: 'Review' }]} /></div>,
        doText: 'Name each step with one or two words.',
        dont: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={1} steps={[{ label: 'Tell us about your asset' }, { label: 'Upload all of your source files' }, { label: 'Check everything and publish' }]} /></div>,
        dontText: 'Don’t write sentences. They wrap into tall columns that are hard to scan.',
      },
      {
        do: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={2} steps={[{ label: 'Details' }, { label: 'Files' }, { label: 'Pricing' }, { label: 'Review' }]} /></div>,
        doText: 'Keep the flow to 3–5 steps.',
        dont: <div style={{ width: 440, zoom: 0.8, overflowX: 'auto' }}><Stepper current={2} steps={[{ label: 'Name' }, { label: 'Category' }, { label: 'Tags' }, { label: 'Files' }, { label: 'Previews' }, { label: 'Price' }, { label: 'License' }, { label: 'Review' }]} /></div>,
        dontText: 'Don’t split a flow into 8 steps. The labels collide and the task looks longer than it is. Group fields instead.',
      },
      {
        do: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={0} steps={[{ label: 'Details', description: 'Name and category' }, { label: 'Pricing', description: 'Price and license' }, { label: 'Review' }]} /></div>,
        doText: 'Keep descriptions to a few words.',
        dont: <div style={{ width: 440, zoom: 0.8 }}><Stepper current={0} steps={[{ label: 'Details', description: 'Give your asset a name, pick a category and add up to ten tags' }, { label: 'Pricing', description: 'Choose a price and the licenses buyers can pick' }, { label: 'Review' }]} /></div>,
        dontText: 'Don’t put instructions in descriptions. Put them next to the fields in the step itself.',
      },
    ],
    content: [
      'Use nouns for steps: “Details”, “Files”, “Pricing”, “Review”.',
      'Make the last step “Review” and its button say what happens: “Publish listing”, “Set up payouts”.',
      'After the last step, confirm with a Toast or Alert in the past tense: “Published”.',
      'Keep the same steps in the same order every time someone runs the flow.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Skips the Stepper, which is not interactive, and moves through the step’s fields and the Back and Next buttons.']],
    notes: [
      'Renders an ordered list (<ol>), so screen readers announce “list, 4 items” and each position.',
      'The open step has aria-current="step". Done markers carry a tick icon labelled “Completed”.',
      'States differ by shape as well as color: a filled circle with a tick, a ring, and a plain number.',
      'When the step changes, move focus to the new step’s heading so screen reader users hear where they are.',
    ],
  },

  related: ['tabs', 'progress-bar', 'button-group'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Stepper in React and HTML/CSS, matching the Figma component (done, current and upcoming steps, descriptions, vertical on mobile).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Done steps use the blue-600 primary and the Hugeicons tick-02.' },
  ],
};
