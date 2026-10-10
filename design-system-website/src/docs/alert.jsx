export default {
  id: 'alert',
  name: 'Alert',
  group: 'Feedback',
  order: 1,
  status: 'Stable',
  figma: '31:190',
  exports: ['Alert'],
  summary: 'An inline message that stays on the page until the problem is solved: a failed payout, a listing in review, a license about to expire. It pairs an icon, a title and one clear next step.',

  examples: [
    {
      title: 'Variants',
      desc: 'Info explains how something works. Success confirms a result people need to keep seeing. Warning flags a problem that is coming. Error says something failed and how to fix it. Each variant has its own icon, so the meaning never relies on color.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', maxWidth: 520 }}>
  <Alert variant="info" title="Reviews take about 2 days">
    We check every new listing before it goes live. You get an email when it is approved.
  </Alert>
  <Alert variant="success" title="Payout sent">
    $1,240.00 is on its way to the account ending 4821. It usually arrives in 1–3 business days.
  </Alert>
  <Alert variant="warning" title="Add a tax form by October 31">
    Without it, we hold your payouts from November 1.
  </Alert>
  <Alert variant="error" title="Upload failed">
    Orbit UI Kit.fig is over 2 GB. Split it into parts or compress it, then upload it again.
  </Alert>
</div>`),
    },
    {
      title: 'With an action',
      desc: 'Pass a Button in action when people can fix the problem right away. Use a small Secondary button that starts with a verb. Keep it to one action.',
      ...ex(`
<div style={{ maxWidth: 520 }}>
  <Alert
    variant="error"
    title="Payout failed"
    action={
      <div style={{ marginTop: 'var(--space-sm)' }}>
        <Button variant="secondary" size="sm" leadingIcon="credit-card">Update bank details</Button>
      </div>
    }
  >
    Your bank rejected the transfer of $860.00 because the account number does not match the name. Check your details and we will retry tonight.
  </Alert>
</div>`),
    },
    {
      title: 'Dismissible',
      desc: 'Add onDismiss when the message is only information and nothing breaks if people close it. Never make an error dismissible while the problem is still there.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(true);
  if (!open) {
    return <Button variant="secondary" onClick={() => setOpen(true)}>Show the tip again</Button>;
  }
  return (
    <div style={{ maxWidth: 520 }}>
      <Alert variant="info" title="New: bundle pricing" onDismiss={() => setOpen(false)}>
        Sell 2 or more listings together at a lower price. Set it up from any listing’s Pricing tab.
      </Alert>
    </div>
  );
}`),
    },
    {
      title: 'Body only',
      desc: 'Leave out the title when the message fits in one short sentence. The icon still carries the variant.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', maxWidth: 520 }}>
  <Alert variant="info">This listing is in review. You can still edit the description.</Alert>
  <Alert variant="warning">Only 2 of 3 preview images uploaded.</Alert>
</div>`),
    },
    {
      title: 'At the top of a form',
      desc: 'When a form fails, put one error Alert above it that says how many fields need attention. Each field still shows its own error.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-md)', width: 400 }}>
  <Alert variant="error" title="Fix 2 fields to publish">
    The title and the price need changes before your listing can go live.
  </Alert>
  <TextField label="Title" defaultValue="UI kit" error="Use at least 10 characters so buyers know what it is." />
  <TextField label="Price" defaultValue="$0.50" leadingIcon="dollar-01" error="Set a price of $1 or more, or mark the listing as free." />
</div>`),
    },
    {
      title: 'Updates in place',
      desc: 'An Alert can change variant when the situation changes. Here the retry turns the error into a success, so people see the result where they looked.',
      ...ex(`function Example() {
  const [state, setState] = useState('error');
  function retry() {
    setState('loading');
    setTimeout(() => setState('success'), 1400);
  }
  if (state === 'success') {
    return (
      <div style={{ maxWidth: 520 }}>
        <Alert variant="success" title="Preview images uploaded">All 3 images are live on Neon Icon Pack.</Alert>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 520 }}>
      <Alert
        variant="error"
        title="2 preview images did not upload"
        action={
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <Button variant="secondary" size="sm" leadingIcon="refresh" loading={state === 'loading'} onClick={retry}>Retry upload</Button>
          </div>
        }
      >
        The connection dropped. Check you are online, then retry.
      </Alert>
    </div>
  );
}`),
    },
  ],

  props: {
    Alert: [
      ['variant', "'info' | 'success' | 'warning' | 'error'", "'info'", 'Sets the colors and icon. Error uses role="alert" so it is announced at once; the others use role="status".'],
      ['title', 'ReactNode', '', 'Short bold line that says what happened. Optional for one-sentence messages.'],
      ['children', 'ReactNode', '', 'The body: what it means and what to do next.'],
      ['action', 'ReactNode', '', 'Rendered under the body. Usually one small Secondary Button. Wrap it to add top spacing (space-sm).'],
      ['onDismiss', '() => void', '', 'Shows a close button (cancel-01, aria-label “Dismiss”) and calls this when pressed.'],
      ['className', 'string', '', 'Extra class on the container.'],
    ],
  },

  usage: {
    when: [
      'To explain a problem or state that affects a whole page or section: a failed payout, a listing in review.',
      'To warn about something that will happen unless people act: an expiring license, a missing tax form.',
      'To summarize form errors above the form.',
    ],
    whenNot: [
      'To confirm a quick action like “Saved”. Use a Toast; it goes away on its own.',
      'For an error on one field. Use the field’s error message.',
      'To ask for a decision that blocks the task. Use a Modal.',
      'For marketing or promotions. Use a card or banner from the page layout.',
    ],
    anatomy: {
      render: (
        <div style={{ width: 420 }}>
          <Alert
            variant="warning"
            title="Add a tax form by October 31"
            onDismiss={() => {}}
            action={<div style={{ marginTop: 'var(--space-sm)' }}><Button variant="secondary" size="sm">Add tax form</Button></div>}
          >
            Without it, we hold your payouts from November 1.
          </Alert>
        </div>
      ),
      parts: [
        'Container: radius-lg, feedback-{variant}-bg, 1px feedback-{variant}-border, padded with space-md. Three columns with a space-sm gap.',
        'Icon: 20px, feedback-{variant}-icon. information-circle, checkmark-circle-02, alert-02 or alert-circle.',
        'Title (optional): body-sm SemiBold (Inter Display 600 14/20), text-primary.',
        'Body: body-sm (Inter Display 400 14/20), text-secondary.',
        'Action (optional): one small Secondary Button, space-sm above it.',
        'Dismiss (optional): 20px cancel-01 in icon-secondary, with shadow-focus-ring on keyboard focus.',
      ],
    },
    sections: [
      {
        title: 'Choosing a variant',
        body: 'Pick the variant from what happened, then let the icon and title say it. Red means something failed. Using it for news or tips teaches people to ignore it.',
        dos: [
          {
            do: <div style={{ width: 320 }}><Alert variant="error" title="Payout failed">Your bank rejected the transfer. Update your bank details to retry.</Alert></div>,
            doText: 'Use Error when something failed and people have to act.',
            dont: <div style={{ width: 320 }}><Alert variant="info" title="Payout failed">Your bank rejected the transfer. Update your bank details to retry.</Alert></div>,
            dontText: 'Don’t soften a failure with Info. People skim past grey-blue messages and miss the money.',
          },
          {
            do: <div style={{ width: 320 }}><Alert variant="info" title="New: bundle pricing">Sell 2 or more listings together at a lower price.</Alert></div>,
            doText: 'Use Info for news and tips.',
            dont: <div style={{ width: 320 }}><Alert variant="error" title="New: bundle pricing">Sell 2 or more listings together at a lower price.</Alert></div>,
            dontText: 'Don’t use Error to grab attention. Red should only ever mean something broke.',
          },
        ],
      },
      {
        title: 'Placement',
        body: 'Put the Alert at the top of the area it is about, under the page title or above the form. Show one at a time. If several things need attention, group them in one Alert.',
        dos: [
          {
            do: <div style={{ width: 320 }}><Alert variant="warning" title="2 listings need changes">Add preview images to Orbit UI Kit and a license to Neon Icon Pack.</Alert></div>,
            doText: 'Group related problems into one Alert with one title.',
            dont: (
              <div style={{ width: 320, display: 'grid', gap: 'var(--space-xs)' }}>
                <Alert variant="warning">Orbit UI Kit needs preview images.</Alert>
                <Alert variant="warning">Neon Icon Pack needs a license.</Alert>
                <Alert variant="info">Reviews take about 2 days.</Alert>
              </div>
            ),
            dontText: 'Don’t stack Alerts. A wall of colored boxes pushes the content down and nothing stands out.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 320 }}><Alert variant="error" title="Upload failed">The file is over 2 GB. Compress it or split it into parts, then upload it again.</Alert></div>,
        doText: 'Say what went wrong and how to fix it.',
        dont: <div style={{ width: 320 }}><Alert variant="error" title="Oops!">Something went wrong. Please try again later.</Alert></div>,
        dontText: 'Don’t write “Something went wrong”. People can’t fix what you don’t name, and “Oops” and “Sorry” add nothing.',
      },
      {
        do: (
          <div style={{ width: 320 }}>
            <Alert variant="warning" title="License expires in 7 days" action={<div style={{ marginTop: 'var(--space-sm)' }}><Button variant="secondary" size="sm">Renew license</Button></div>}>
              Renew to keep selling templates built with Orbit UI Kit.
            </Alert>
          </div>
        ),
        doText: 'Give one action button that starts with a verb.',
        dont: (
          <div style={{ width: 320 }}>
            <Alert variant="warning" title="License expires in 7 days">
              Renew to keep selling templates. <Link href="#">Click here</Link> to renew, or <Link href="#">here</Link> to compare licenses.
            </Alert>
          </div>
        ),
        dontText: 'Don’t hide the fix in “click here” links. People scan for a button and miss it.',
      },
      {
        do: <div style={{ width: 320 }}><Alert variant="info" title="Reviews take about 2 days">You get an email when your listing is approved.</Alert></div>,
        doText: 'Keep it to a title and one or two short sentences.',
        dont: (
          <div style={{ width: 320 }}>
            <Alert variant="info" title="About the review process">
              Every listing is checked by our team for quality, licensing and originality, which can take anywhere from a few hours to several days depending on volume, the time of year and how complete your listing is, and you will be notified by email.
            </Alert>
          </div>
        ),
        dontText: 'Don’t put a paragraph in an Alert. Link to a help article for the details.',
      },
      {
        do: <Toast message="Added to Dashboard kits" />,
        doText: 'Confirm a small action with a Toast that leaves on its own.',
        dont: <div style={{ width: 320 }}><Alert variant="success" title="Success" onDismiss={() => {}}>The item was added to your collection.</Alert></div>,
        dontText: 'Don’t leave a success Alert on the page for a quick action. People have to close it by hand.',
      },
    ],
    content: [
      'Title: say what happened in 2–6 words, in sentence case. “Payout failed”, “Upload failed”, “Reviews take about 2 days”.',
      'Body: one or two sentences. For errors, say what went wrong, then how to fix it. No apologies and no blame.',
      'Action: a verb plus the object, like “Update bank details” or “Renew license”.',
      'Use real numbers: “$1,240.00”, “7 days”, “2 GB”. Never “some” or “soon”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to the action button, then to the dismiss button.'],
      ['Enter / Space', 'Activates the focused button.'],
    ],
    notes: [
      'Error Alerts use role="alert", so screen readers read them as soon as they appear. The other variants use role="status" and are read politely.',
      'Render the Alert when the event happens. An Alert that is already on the page at load is not announced, so it must sit where people read first.',
      'The icon is decorative (aria-hidden). The title has to carry the meaning in words, so color is never the only signal.',
      'Text is text-primary and text-secondary on the feedback backgrounds, at least 4.5:1 in light and dark themes.',
      'The dismiss button has aria-label “Dismiss” and shows shadow-focus-ring on keyboard focus.',
    ],
  },

  related: ['toast', 'modal', 'text-field', 'empty-state'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Alert in React and HTML/CSS, matching the Figma component (4 variants, with optional title, action and dismiss).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Neutrals became pure grey and Inter Display became the only typeface.' },
  ],
};
