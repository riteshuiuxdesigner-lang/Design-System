const stack = { display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' };

export default {
  id: 'otp-input',
  name: 'OTP input',
  group: 'Inputs',
  order: 5,
  status: 'Stable',
  figma: '22:87',
  exports: ['OtpInput'],
  summary: 'A row of single-digit cells for one-time codes sent by email or text. Focus moves on as people type, and pasting fills every cell.',

  examples: [
    {
      title: 'Default',
      desc: 'Six cells by default. Use label to say where the code was sent. It sits above the cells and names the group for screen readers.',
      ...ex(`
<OtpInput label="Enter the 6-digit code we sent to mira@studio.com" />`),
    },
    {
      title: 'Length',
      desc: 'Match length to the code you send. A shorter code needs fewer cells.',
      ...ex(`
<OtpInput length={4} label="Enter the 4-digit code from your text message" />`),
    },
    {
      title: 'Verify on complete',
      desc: 'onComplete fires as soon as every cell is filled, so people don’t need a Verify button. Disable the cells while checking. For this demo, the right code is 135790.',
      ...ex(`function Example() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  function verify(value) {
    setStatus('checking');
    setTimeout(() => setStatus(value === '135790' ? 'ok' : 'wrong'), 900);
  }
  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' }}>
      <OtpInput
        label="Enter the code we sent to mira@studio.com"
        value={code}
        onChange={v => { setCode(v); if (status === 'wrong') setStatus('idle'); }}
        onComplete={verify}
        disabled={status === 'checking' || status === 'ok'}
        error={status === 'wrong' ? 'That code doesn’t match. Check your latest email or send a new code.' : ''}
      />
      {status === 'checking' && <span style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}><Spinner size="sm" label="Checking code" />Checking code</span>}
      {status === 'ok' && <Badge variant="success" icon="checkmark-circle-02">Verified</Badge>}
    </div>
  );
}`),
    },
    {
      title: 'Error',
      desc: 'Every cell turns red and the message below says what to do next.',
      ...ex(`
<OtpInput label="Verification code" defaultValue="482915" error="That code has expired. Send a new code to try again." />`),
    },
    {
      title: 'Disabled',
      desc: 'Disable the cells while the code is being checked, so people can’t change it halfway.',
      ...ex(`
<OtpInput label="Verification code" defaultValue="135790" disabled />`),
    },
    {
      title: 'Confirm a payout change',
      desc: 'A full verification step: the reason, where the code went, the cells and a way to get a new code after a short wait.',
      stage: 'muted',
      ...ex(`function Example() {
  const [wait, setWait] = useState(30);
  useEffect(() => {
    if (wait === 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);
  return (
    <div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Confirm your new payout account</span>
      <span style={{ font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>
        To keep your earnings safe, we sent a 6-digit code to mira@studio.com.
      </span>
      <OtpInput label="Verification code" />
      {wait > 0
        ? <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>You can send a new code in 0:{(wait < 10 ? '0' : '') + wait}</span>
        : <Link href="#" onClick={e => { e.preventDefault(); setWait(30); }}>Send a new code</Link>}
    </div>
  );
}`),
    },
  ],

  props: {
    OtpInput: [
      ['label', 'ReactNode', '', 'Instruction above the cells, e.g. “Enter the 6-digit code we sent to mira@studio.com”. It also names the role="group". Without it, the group is named “Verification code”.'],
      ['length', 'number', '6', 'Number of cells. Match it to the code you send.'],
      ['value', 'string', '', 'Controlled code. Pair with onChange.'],
      ['defaultValue', 'string', "''", 'Starting code when uncontrolled.'],
      ['onChange', '(code: string) => void', '', 'Called with the digits typed so far. Letters and spaces are stripped.'],
      ['onComplete', '(code: string) => void', '', 'Called once every cell is filled. Verify here.'],
      ['error', 'string', '', 'Turns every cell red, sets aria-invalid on each and shows the message below, linked with aria-describedby.'],
      ['disabled', 'boolean', 'false', 'Disables every cell. Use it while the code is being checked.'],
      ['className', 'string', '', 'Added to the outer wrapper.'],
    ],
  },

  usage: {
    when: [
      'To confirm a one-time code sent by email or text: signing in, changing payout details, turning on 2-step verification.',
    ],
    whenNot: [
      'For passwords. Use a Text field with type="password".',
      'For long codes or codes with letters, like license keys or discount codes. Use a Text field; this input keeps digits only.',
    ],
    anatomy: {
      render: <OtpInput label="Enter the code we sent to mira@studio.com" defaultValue="135" />,
      parts: [
        'Label: label-md (Inter Display SemiBold 15/20) in text-primary. Names the group.',
        'Cell: 52px square (size-control-lg), radius-lg, bg-surface, 1px border-strong.',
        'Digit: Inter Display SemiBold 20/28 with tabular-nums, centered in text-primary.',
        'Focus: the cell border turns focus-ring, shadow-focus-halo appears and the cell lifts 2px with a spring.',
        'Gap: space-xs between cells.',
        'Error: every cell uses feedback-error-solid, and the message below uses feedback-error-text with an icon.',
      ],
    },
    sections: [
      {
        title: 'Paste and autofill',
        body: 'Most people paste the code or tap the suggestion their phone shows. The first cell sets autocomplete="one-time-code" for that suggestion, and a paste fills every cell at once.',
        dos: [
          {
            do: <OtpInput label="Enter the code we sent to mira@studio.com" />,
            doText: 'Use the OTP input, so paste and the phone’s code suggestion fill every cell.',
            dont: <div style={stack}><span className="mds-field__label">Enter the code we sent to mira@studio.com</span><div style={{ display: 'flex', gap: 'var(--space-xs)' }}>{[1, 2, 3, 4, 5, 6].map(n => <TextField key={n} size="sm" aria-label={'Digit ' + n} style={{ width: 'var(--space-sm)' }} />)}</div></div>,
            dontText: 'Don’t build it from separate Text fields. A paste lands in one box and focus doesn’t move on.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <OtpInput label="Enter the 6-digit code we sent to mira@studio.com" />,
        doText: 'Use label to say where the code was sent, so people know where to look.',
        dont: <div style={stack}><OtpInput /></div>,
        dontText: 'Don’t show the cells with no instruction. People don’t know which inbox or phone to check.',
      },
      {
        do: <OtpInput label="Verification code" defaultValue="482915" error="That code has expired. Send a new code to try again." />,
        doText: 'Say what went wrong and what to do next.',
        dont: <OtpInput label="Verification code" defaultValue="482915" error="Error 401" />,
        dontText: 'Don’t show error codes. People can’t tell whether to retype or ask for a new code.',
      },
      {
        do: <div style={stack}><OtpInput label="Verification code" /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>You can send a new code in 0:24</span></div>,
        doText: 'Offer a new code after a short wait, and show the countdown.',
        dont: <OtpInput label="Verification code" />,
        dontText: 'Don’t leave people stuck when the code never arrives. Without a resend link, they have to start over.',
      },
      {
        do: <OtpInput length={4} label="Enter the 4-digit code from your text" />,
        doText: 'Show exactly as many cells as the code has digits.',
        dont: <OtpInput length={6} label="Enter the 4-digit code from your text" defaultValue="4829" />,
        dontText: 'Don’t add spare cells. People think digits are missing and wait for a longer code.',
      },
    ],
    content: [
      'Name the channel and the address: “Enter the 6-digit code we sent to mira@studio.com.”',
      'Say why you are asking when it isn’t obvious: “To keep your earnings safe…”.',
      'Errors give the next step: “That code has expired. Send a new code to try again.”',
      'Resend links start with a verb: “Send a new code”.',
    ],
  },

  a11y: {
    keyboard: [
      ['0–9', 'Fills the cell, replacing any digit already there, and moves focus to the next one. Focusing a cell selects its digit.'],
      ['← / →', 'Moves to the previous or next cell.'],
      ['Backspace', 'Deletes the digit in the cell, shifts the later digits left and moves focus back one cell.'],
      ['Tab / Shift + Tab', 'Moves between cells.'],
      ['⌘V / Ctrl+V', 'Pastes the code into every cell. Non-digits are removed.'],
    ],
    notes: [
      'Each cell is a native input labelled “Digit 1 of 6” and so on, with inputMode="numeric" for the number keypad.',
      'The first cell sets autocomplete="one-time-code" so iOS and Android offer the code from messages.',
      'The cells sit in a role="group" named by label (or “Verification code”), so screen readers read the instruction before the first digit.',
      'An error sets aria-invalid on every cell and is linked to the group with aria-describedby.',
      'Cell borders (border-strong) have 3:1 contrast. Errors pair the red border with an icon and text.',
      'The focused cell lifts 2px with a spring. Under prefers-reduced-motion, it only changes color.',
    ],
  },

  related: ['text-field', 'button', 'link'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'New label prop that names the cell group. Errors are linked with aria-describedby and set aria-invalid. ← and → move between cells, focus selects the digit, and typing into a filled cell replaces it.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'OTP input in React and HTML/CSS, matching the Figma component (4 and 6 cells × empty, focus, filled, error, disabled).' },
  ],
};
