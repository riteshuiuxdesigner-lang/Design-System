const col = (w) => ({ width: w || 290, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' });
const DESC = 'A 64-screen dashboard kit for Figma with light and dark themes, auto layout and 400 components.';

export default {
  id: 'textarea',
  name: 'Textarea',
  group: 'Inputs',
  order: 4,
  status: 'Stable',
  figma: '20:1332',
  exports: ['Textarea'],
  summary: 'A multi-line input for longer text such as listing descriptions, reviews and messages. It can show a live character count.',

  examples: [
    {
      title: 'Default',
      desc: 'Four rows tall by default. People can drag the corner to make it taller. The helper says what a good answer includes.',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%' }}>
  <Textarea
    label="Listing description"
    helper="Mention file formats, the number of screens and what’s included."
  />
</div>`),
    },
    {
      title: 'Character count',
      desc: 'Set maxLength to show a live count in the corner. The browser stops typing at the limit, so people never lose text to an error.',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%' }}>
  <Textarea
    label="Short description"
    maxLength={160}
    rows={3}
    defaultValue="A 64-screen dashboard kit for Figma with light and dark themes."
    helper="Shown under the title in search results."
  />
</div>`),
    },
    {
      title: 'Required and optional',
      desc: 'Mark the exception. In a review form most fields are optional, so mark the required one.',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <Textarea label="Your review" required rows={3} />
  <Textarea label="Note to the creator" optional rows={2} helper="Only Mira can see this." />
</div>`),
    },
    {
      title: 'Error and disabled',
      desc: 'An error turns the border and the count red. A disabled textarea keeps its text readable.',
      ...ex(`
<div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
  <Textarea
    label="Refund reason"
    rows={3}
    defaultValue="Broken"
    error="Add at least 20 characters so we can look into it."
  />
  <Textarea
    label="Original message"
    rows={2}
    disabled
    defaultValue="Hi Mira, does the kit include the Sketch source too?"
  />
</div>`),
    },
    {
      title: 'Controlled with validation',
      desc: 'Read the text from onChange (a native event). Check the minimum when people leave the field and clear the error as soon as it is met.',
      ...ex(`function Example() {
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);
  const short = text.trim().length < 20;
  return (
    <div style={{ width: 400, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' }}>
      <Textarea
        label="Your review"
        maxLength={500}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => setTouched(true)}
        error={touched && short ? 'Write at least 20 characters so other buyers learn something.' : ''}
        helper="What did you build with it? What would you change?"
      />
      <Button style={{ justifySelf: 'end' }} onClick={() => setTouched(true)}>Post review</Button>
    </div>
  );
}`),
    },
    {
      title: 'Reply to a buyer',
      desc: 'A message thread in the seller inbox. The textarea sits under the buyer’s question with the send action below it.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 420, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
    <Avatar initials="JL" color="pop-lime" />
    <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
      <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Jonas Lind</span>
      <span style={{ font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>Does the Orbit kit include the Sketch source files too?</span>
    </div>
  </div>
  <Textarea label="Your reply" rows={3} placeholder="e.g. Yes, the Sketch file is in the download." />
  <ButtonGroup>
    <Button variant="ghost">Cancel</Button>
    <Button leadingIcon="message-01">Send reply</Button>
  </ButtonGroup>
</div>`),
    },
  ],

  props: {
    Textarea: [
      ['label', 'ReactNode', '', 'Visible label above the box, linked with htmlFor.'],
      ['helper', 'string', '', 'One line of help below, linked with aria-describedby.'],
      ['error', 'string', '', 'Replaces the helper, turns the border and the count red, and sets aria-invalid.'],
      ['maxLength', 'number', '', 'Shows a “n / max” count, linked with aria-describedby, and is passed to the textarea, so typing stops at the limit.'],
      ['rows', 'number', '4', 'Starting height in rows. The box is never shorter than 96px and can be resized vertically.'],
      ['value', 'string', '', 'Controlled text. Pair with onChange.'],
      ['defaultValue', 'string', "''", 'Starting text when uncontrolled.'],
      ['onChange', '(event) => void', '', 'Native change event. Read e.target.value.'],
      ['required', 'boolean', 'false', 'Shows the red asterisk (hidden from screen readers) and sets native required on the textarea.'],
      ['optional', 'boolean', 'false', 'Adds “(optional)” after the label.'],
      ['disabled', 'boolean', 'false', 'Disables the textarea and greys the container.'],
      ['id', 'string', '', 'Textarea id. Generated when omitted.'],
      ['className', 'string', '', 'Added to the outer wrapper.'],
      ['...rest', 'TextareaHTMLAttributes', '', 'Passed to the <textarea>: placeholder, name, onBlur, autoFocus.'],
    ],
  },

  usage: {
    when: [
      'For text longer than one line: listing descriptions, reviews, refund reasons, messages to creators.',
      'When people need to see everything they wrote before they send it.',
    ],
    whenNot: [
      'For a short value like a title or an email. Use a Text field.',
      'For content that needs headings, links or lists. A Textarea is plain text only.',
      'To search. Use a Search field.',
    ],
    anatomy: {
      render: <div style={{ width: 340 }}><Textarea label="Short description" maxLength={160} rows={3} defaultValue="A 64-screen dashboard kit for Figma." helper="Shown in search results." /></div>,
      parts: [
        'Label: label-md (Inter Display SemiBold 15/20) in text-primary.',
        'Container: radius-lg (not a pill, because the text wraps), bg-surface, 1px border-strong, padded space-sm by space-md.',
        'Text: body 16/24 in text-primary, at least 96px tall, resizable vertically.',
        'Count (optional): caption with tabular-nums in text-muted, bottom right. Turns red with an error.',
        'Helper: caption (500 12/16) in text-muted, or feedback-error-text with an icon.',
        'Focus: border turns focus-ring and shadow-focus-halo appears.',
      ],
    },
    sections: [
      {
        title: 'Textarea or text field',
        body: 'Match the box to the answer. When the answer is more than a sentence, people need to see all of it while they write.',
        dos: [
          {
            do: <div style={col()}><Textarea label="Listing description" rows={3} defaultValue={DESC} /></div>,
            doText: 'Use a Textarea for descriptions, so the whole text is visible while people edit it.',
            dont: <div style={col()}><TextField label="Listing description" defaultValue={DESC} /></div>,
            dontText: 'Don’t use a one-line Text field for long text. It scrolls sideways and people can’t check what they wrote.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={col()}><Textarea label="Short description" maxLength={160} rows={3} defaultValue={DESC} /></div>,
        doText: 'Show a count when there is a limit, so people can plan their words.',
        dont: <div style={col()}><Textarea label="Short description" rows={3} defaultValue={DESC + ' Includes 1,200 icons and a style guide.'} error="Too long." /></div>,
        dontText: 'Don’t hide the limit until people pass it. “Too long” doesn’t say by how much.',
      },
      {
        do: <div style={col()}><Textarea label="Listing description" rows={3} helper="Mention file formats, the number of screens and what’s included." /></div>,
        doText: 'Put writing tips in the helper, where they stay visible.',
        dont: <div style={col()}><Textarea aria-label="Listing description" rows={3} placeholder="Describe your product. Mention file formats, the number of screens, fonts used and what’s included in the download." /></div>,
        dontText: 'Don’t put instructions in the placeholder. They vanish on the first keystroke and there is no label.',
      },
      {
        do: <div style={col()}><Textarea label="Refund reason" rows={2} defaultValue="Broken" error="Add at least 20 characters so we can look into it." /></div>,
        doText: 'Say what is missing and why it matters.',
        dont: <div style={col()}><Textarea label="Refund reason" rows={2} defaultValue="Broken" error="Error: field validation failed." /></div>,
        dontText: 'Don’t show system errors. People can’t act on them.',
      },
    ],
    content: [
      'Labels are short nouns: “Your review”, “Refund reason”.',
      'Helpers suggest what a good answer includes: “What did you build with it?”.',
      'If you need a minimum length, say it up front in the helper and repeat it in the error with the reason.',
      'Use placeholders only for an example answer, starting with “e.g.”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus into the textarea.'],
      ['Enter', 'Adds a new line. It never submits the form.'],
      ['Shift + Tab', 'Moves focus to the previous field.'],
    ],
    notes: [
      'Uses a native <textarea> with a <label htmlFor>. The helper or error is linked with aria-describedby, and an error sets aria-invalid.',
      'The count is linked with aria-describedby, so screen readers read it when people reach the field, without interrupting every keystroke. Required sets native required.',
      'maxLength is native, so assistive tech and the browser both enforce it.',
      'The border (border-strong) has 3:1 contrast. Errors pair red with an icon and text.',
      'Focus changes color only, so nothing moves under prefers-reduced-motion.',
    ],
  },

  related: ['text-field', 'search-field', 'button'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'required now reaches the native textarea. The count is linked with aria-describedby and is no longer a live region.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Textarea in React and HTML/CSS, matching the Figma component (default, focus, filled, error, disabled, with and without count).' },
  ],
};
