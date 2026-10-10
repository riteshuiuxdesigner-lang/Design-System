const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const inDays = (n) => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + n);
const isPast = (d) => d < TODAY;
const err = { display: 'flex', gap: 'var(--space-2xs)', alignItems: 'center', font: '500 12px/16px var(--font-display)', color: 'var(--feedback-error-text)' };

export default {
  id: 'date-picker',
  name: 'Date picker',
  group: 'Inputs',
  order: 6,
  status: 'Beta',
  figma: '24:329',
  exports: ['DatePicker', 'Calendar'],
  summary: 'A field that opens a month calendar for picking a date, such as when a sale ends or a listing goes live. Calendar is the month grid on its own, for inline use and ranges.',

  examples: [
    {
      title: 'Default',
      desc: 'Focusing or clicking the field opens the calendar below it. Picking a day fills the field and closes the calendar.',
      ...ex(`function Example() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ minHeight: 420 }}>
      <DatePicker
        label="Sale ends"
        value={date}
        onChange={setDate}
        helper="The discount stops at midnight in your time zone."
      />
    </div>
  );
}`),
    },
    {
      title: 'Disable dates',
      desc: 'isDisabled greys out and strikes through days that can’t be picked. Here, a launch can’t be scheduled in the past.',
      ...ex(`function Example() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(null);
  return (
    <div style={{ minHeight: 420 }}>
      <DatePicker
        label="Launch date"
        placeholder="Choose a launch date"
        value={date}
        onChange={setDate}
        isDisabled={d => d < today}
      />
    </div>
  );
}`),
    },
    {
      title: 'Inline calendar',
      desc: 'Use Calendar on its own when the date is the main task of the panel, such as a scheduling step.',
      ...ex(`function Example() {
  const [date, setDate] = useState(new Date());
  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <Calendar value={date} onChange={setDate} />
      <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>
        Goes live {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </span>
    </div>
  );
}`),
    },
    {
      title: 'Date range',
      desc: 'Calendar shows a range when you pass value (start) and rangeEnd. onChange gives you each clicked day; your code decides whether it starts a new range or ends the current one.',
      ...ex(`function Example() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  function pick(d) {
    if (!start || end || d < start) { setStart(d); setEnd(null); }
    else setEnd(d);
  }
  const fmt = d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>
        {start && end ? 'Sales from ' + fmt(start) + ' to ' + fmt(end) : start ? 'Now pick the last day' : 'Pick the first day'}
      </span>
      <Calendar value={start} rangeEnd={end} onChange={pick} />
    </div>
  );
}`),
    },
    {
      title: 'Business days only',
      desc: 'Payouts only go out on weekdays, so weekends are disabled. Say why in text next to the calendar.',
      ...ex(`function Example() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
      <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Payout date</span>
      <span style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Payouts go out on business days.</span>
      <Calendar value={date} onChange={setDate} isDisabled={d => d.getDay() === 0 || d.getDay() === 6} />
    </div>
  );
}`),
    },
    {
      title: 'Schedule a sale',
      desc: 'A sale form in the seller dashboard. The end date is required; pressing Schedule sale without one shows an error on the field.',
      stage: 'muted',
      ...ex(`function Example() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [ends, setEnds] = useState(null);
  const [tried, setTried] = useState(false);
  return (
    <div style={{ width: 380, maxWidth: '100%', minHeight: 580, alignContent: 'start', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Run a sale on Orbit UI kit</span>
      <TextField label="Discount" defaultValue="20" trailingIcon="tag-01" inputMode="numeric" helper="Percent off the $49 price." />
      <DatePicker
        label="Sale ends"
        name="ends"
        required
        value={ends}
        onChange={setEnds}
        isDisabled={d => d <= today}
        error={tried && !ends ? 'Choose the last day of the sale.' : ''}
      />
      <Button style={{ justifySelf: 'start' }} onClick={() => setTried(true)}>Schedule sale</Button>
    </div>
  );
}`),
    },
  ],

  props: {
    DatePicker: [
      ['label', 'ReactNode', '', 'Visible label above the field. Say what the date is for: “Sale ends”.'],
      ['value', 'Date | null', '', 'The picked date. The field shows it as “Oct 14, 2026” in the viewer’s locale.'],
      ['onChange', '(date: Date) => void', '', 'Called with the clicked day (at local midnight). The calendar then closes.'],
      ['placeholder', 'string', "'Choose a date'", 'Shown while there is no value.'],
      ['helper', 'string', '', 'One line of help below the field.'],
      ['error', 'string', '', 'Replaces the helper, turns the field red and sets aria-invalid.'],
      ['required', 'boolean', 'false', 'Adds the asterisk and native required on the field.'],
      ['isDisabled', '(date: Date) => boolean', '', 'Return true for days that can’t be picked. They are greyed out and struck through.'],
      ['id', 'string', '', 'Id of the field. Generated when omitted.'],
      ['name', 'string', '', 'Name of the field, for form posts. The field holds the formatted date text.'],
      ['className', 'string', '', 'Added to the wrapper, which is a block that fills its container.'],
    ],
    Calendar: [
      ['value', 'Date | null', '', 'The selected day, or the start of a range. The calendar shows this month (or the current month) and follows when value changes.'],
      ['rangeEnd', 'Date | null', '', 'The end of a range. Days between value and rangeEnd get the range fill.'],
      ['onChange', '(date: Date) => void', '', 'Called with each clicked day. For ranges, decide in your code whether it is the start or the end.'],
      ['isDisabled', '(date: Date) => boolean', '', 'Return true for days that can’t be picked.'],
      ['className', 'string', '', 'Added to the calendar wrapper.'],
    ],
  },

  usage: {
    when: [
      'To pick a date close to today, where seeing the week helps: when a sale ends, when a listing goes live, a payout date.',
      'To pick a date range for a sales report or a promotion.',
    ],
    whenNot: [
      'For dates far from today that people know by heart, such as a date of birth. Use Text fields.',
      'For common ranges like “Last 30 days”. Use Chips or a Select, and keep the calendar for custom ranges.',
      'To pick a time. The calendar picks days only.',
    ],
    anatomy: {
      render: <Calendar value={inDays(3)} isDisabled={isPast} />,
      parts: [
        'Trigger: a read-only Text field with the calendar-03 icon. Opens the panel on focus or click.',
        'Panel: bg-raised, radius-lg, elevation-2 and a 1px border-elevation. Springs in from 0.9 scale over 200ms.',
        'Header: the month in Inter Display SemiBold 15/20, with Small Icon buttons for the previous and next month.',
        'Weekdays: caption (500 12/16) in text-muted.',
        'Day: 36px pill (size-control-sm), 500 14/20 with tabular-nums. Hover uses bg-hover. Today has a 1px border-strong ring.',
        'Selected day: action-primary-default with text-on-action. Range days use bg-muted. Disabled days use text-disabled with a strike-through.',
      ],
    },
    sections: [
      {
        title: 'Prevent dates that will fail',
        body: 'If a date can’t work, disable it in the calendar. It is better than letting people pick it and then showing an error.',
        dos: [
          {
            do: <Calendar value={inDays(2)} isDisabled={isPast} />,
            doText: 'Disable past days when scheduling a launch, so people can only pick dates that work.',
            dont: <div style={{ display: 'grid', gap: 'var(--space-xs)' }}><Calendar value={inDays(-2)} /><span style={err}><Icon name="alert-circle" size={16} />Date must be in the future.</span></div>,
            dontText: 'Don’t let people pick a past day and then reject it. They have to find the problem and start again.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <DatePicker label="Sale ends" value={inDays(7)} />,
        doText: 'Name what the date is for.',
        dont: <DatePicker label="Date" value={inDays(7)} />,
        dontText: 'Don’t label it “Date”. In a form with two dates, people can’t tell them apart.',
      },
      {
        do: <DatePicker label="Sale ends" value={new Date(2026, 10, 3)} />,
        doText: 'Show the month as a word, so the date reads the same everywhere.',
        dont: <div style={{ width: 240 }}><TextField label="Sale ends" leadingIcon="calendar-03" defaultValue="03/11/26" /></div>,
        dontText: 'Don’t show numeric dates like 03/11/26. Half your buyers read it as March, half as November.',
      },
      {
        do: <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', maxWidth: 300 }}><Chip>Last 7 days</Chip><Chip selected>Last 30 days</Chip><Chip>This year</Chip><Chip>Custom</Chip></div>,
        doText: 'Offer common ranges as Chips, and open a calendar only for Custom.',
        dont: <Calendar value={inDays(-29)} rangeEnd={TODAY} />,
        dontText: 'Don’t make people click two days in a calendar for “last 30 days”. It is slow and easy to get wrong.',
      },
    ],
    content: [
      'Labels say what the date is for: “Sale ends”, “Launch date”, “Payout date”.',
      'Show dates with the month as a word (“Nov 3, 2026”) in the viewer’s locale. Never use only numbers.',
      'When a date is in a time zone, say which one in the helper: “Ends at midnight in your time zone.”',
      'Explain disabled days near the calendar: “Payouts go out on business days.”',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to the field, which opens the calendar. Tab again reaches the month buttons and the days.'],
      ['Enter / Space', 'Picks the focused day, or moves the month when a month button is focused.'],
      ['Esc', 'Closes the calendar without changing the value.'],
      ['Click or tab outside', 'Closes the calendar when focus or a click leaves the picker.'],
    ],
    notes: [
      'Beta: arrow-key movement between days is not built yet, and the grid has no row or cell roles. Every day is a button, so Tab and Enter always work.',
      'The field is read-only, sets aria-haspopup="dialog" and reports aria-expanded while the calendar is open.',
      'Each day has an aria-label with the full date (“Tue Oct 13 2026”) and the selected day sets aria-pressed="true".',
      'The month buttons are labelled “Previous month” and “Next month”.',
      'The selected day is white on blue-600 (5.2:1). Disabled days are struck through as well as greyed, so color is not the only signal.',
      'The panel springs in and days squish on press. Under prefers-reduced-motion, they appear without motion.',
    ],
  },

  related: ['text-field', 'chip', 'popover'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Esc and moving focus away close the calendar. The picker fills its container, the field sets aria-haspopup and aria-expanded, and Calendar follows value changes. New id, name, error and required props.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Date picker and Calendar in React and HTML/CSS, matching the Figma components (single day, range, disabled days, today). Released as Beta until keyboard navigation in the grid is complete.' },
  ],
};
