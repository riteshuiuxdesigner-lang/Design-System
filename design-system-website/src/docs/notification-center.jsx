export default {
  id: 'notification-center',
  name: 'Notification center',
  group: 'Overlays',
  order: 6,
  status: 'Beta',
  figma: '49:27',
  exports: ['NotificationCenter'],
  summary: 'The activity panel under the bell in the top navigation: new sales, reviews, payouts and listing approvals. Unread items stand out with a tint, bold text and a blue dot, and one link marks them all read.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass items with initials, an avatar color, the message, a relative time and unread. Unread rows get bg-subtle, SemiBold text and a dot.',
      ...ex(`
<NotificationCenter
  items={[
    { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
    { initials: 'AR', color: 'pop-pink', message: 'Ana Ruiz left a 5-star review on Neon Icon Pack', time: '1 hour ago', unread: true },
    { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday' },
    { initials: 'MR', color: 'pop-violet', message: 'Pitch Deck Template was approved and is live', time: 'Oct 7' },
  ]}
/>`),
    },
    {
      title: 'Under the bell',
      desc: 'Open the panel from the bell IconButton in the top navigation and position it under the bell, aligned to the right. Mark all read clears the unread state.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
    { initials: 'AR', color: 'pop-pink', message: 'Ana Ruiz left a 5-star review on Neon Icon Pack', time: '1 hour ago', unread: true },
    { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday' },
  ]);
  const unread = items.filter(n => n.unread).length;

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div style={{ minHeight: 440, width: 420, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        {unread > 0 && <Badge variant="pink">{unread + ' new'}</Badge>}
        <IconButton
          variant="secondary"
          icon="notification-01"
          label={unread ? 'Notifications, ' + unread + ' unread' : 'Notifications'}
          selected={open}
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + var(--space-xs))', zIndex: 20 }}>
            <NotificationCenter items={items} onMarkAll={() => setItems(items.map(n => ({ ...n, unread: false })))} />
          </div>
        )}
      </div>
    </div>
  );
}`),
    },
    {
      title: 'All read',
      desc: 'When nothing is new, every row uses the read style: regular weight in text-secondary, no tint and no dot.',
      ...ex(`
<NotificationCenter
  items={[
    { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday' },
    { initials: 'MR', color: 'pop-violet', message: 'Pitch Deck Template was approved and is live', time: 'Oct 7' },
  ]}
/>`),
    },
    {
      title: 'Kinds of activity',
      desc: 'Use the avatar for the person behind the event, or initials for the marketplace itself. Lead with who did what, and add the amount or rating.',
      ...ex(`
<NotificationCenter
  items={[
    { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
    { initials: 'MP', color: 'pop-yellow', message: 'Your listing Neon Icon Pack needs 1 more preview image', time: '3 hours ago', unread: true },
    { initials: 'TL', color: 'pop-orange', message: 'Theo Lind started following you', time: 'Yesterday' },
    { initials: 'MP', color: 'pop-yellow', message: 'Payouts now arrive in 1–3 business days', time: 'Oct 3' },
  ]}
/>`),
    },
  ],

  props: {
    NotificationCenter: [
      ['items', 'Notification[]', '[]', 'The rows, newest first.'],
      ['items[].message', 'ReactNode', '', 'What happened: who, what and how much.'],
      ['items[].time', 'string', '', 'Relative time in text-muted: “2 min ago”, “Yesterday”, “Oct 7”.'],
      ['items[].initials', 'string', '', 'Initials in the small Avatar.'],
      ['items[].color', 'PopColor', "'pop-orange'", 'Avatar background: pop-yellow, pop-lime, pop-pink, pop-orange or pop-violet.'],
      ['items[].unread', 'boolean', 'false', 'Tints the row bg-subtle, makes the text SemiBold text-primary and adds a dot.'],
      ['onMarkAll', '() => void', '', 'Called by the “Mark all read” link. Set every item’s unread to false.'],
      ['className', 'string', '', 'Extra class on the panel.'],
    ],
  },

  usage: {
    when: [
      'To collect activity people may have missed: sales, reviews, followers, payouts and listing reviews.',
      'Under the bell in the top navigation, on every page.',
    ],
    whenNot: [
      'For a problem people must fix now, like a failed payout. Show an Alert on the page too, and email them.',
      'To confirm something people just did. Use a Toast.',
      'For marketing and promotions.',
    ],
    anatomy: {
      render: (
        <NotificationCenter
          items={[
            { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
            { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday' },
          ]}
        />
      ),
      parts: [
        'Panel: bg-raised, 1px border-elevation, radius-lg, elevation-2, 380px wide, padded with space-md.',
        'Header: “Notifications” in Inter Display SemiBold 18 and a “Mark all read” Link.',
        'Tabs: All and Sales, as pill Tabs.',
        'Unread row: radius-lg, bg-subtle, small Avatar, SemiBold 14/20 message in text-primary, time in text-muted, and an 8px dot in focus-ring.',
        'Read row: no tint and no dot. Message in Regular weight and text-secondary.',
      ],
    },
    sections: [
      {
        title: 'Urgent problems need more than a notification',
        body: 'The panel is a history people check when they like. If something blocks money or a listing, show it where people work and keep it there until it is fixed.',
        dos: [
          {
            do: (
              <div style={{ width: 320 }}>
                <Alert variant="error" title="Payout failed" action={<div style={{ marginTop: 'var(--space-sm)' }}><Button variant="secondary" size="sm">Update bank details</Button></div>}>
                  Your bank rejected the transfer of $860.00. Update your details and we retry tonight.
                </Alert>
              </div>
            ),
            doText: 'Show a blocking problem as an Alert on the page, with the fix.',
            dont: (
              <NotificationCenter items={[
                { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
                { initials: 'MP', color: 'pop-yellow', message: 'Payout failed', time: '3 hours ago', unread: true },
                { initials: 'AR', color: 'pop-pink', message: 'Ana Ruiz left a 5-star review', time: 'Yesterday' },
              ]} />
            ),
            dontText: 'Don’t leave a failed payout only in the panel. It sits between sales and reviews, with no way to fix it.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <NotificationCenter items={[{ initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true }]} />,
        doText: 'Say who did what, to which listing, and how much.',
        dont: <NotificationCenter items={[{ initials: 'MP', color: 'pop-yellow', message: 'You have a new notification', time: '2 min ago', unread: true }]} />,
        dontText: 'Don’t write “You have a new notification”. People have to guess what happened.',
      },
      {
        do: (
          <NotificationCenter items={[
            { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
            { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday' },
            { initials: 'MR', color: 'pop-violet', message: 'Pitch Deck Template was approved', time: 'Oct 7' },
          ]} />
        ),
        doText: 'Mark only new activity as unread.',
        dont: (
          <NotificationCenter items={[
            { initials: 'JP', color: 'pop-lime', message: 'Jonas Park bought Orbit UI Kit for $79', time: '2 min ago', unread: true },
            { initials: 'MP', color: 'pop-yellow', message: 'Your payout of $1,240.00 was sent', time: 'Yesterday', unread: true },
            { initials: 'MR', color: 'pop-violet', message: 'Pitch Deck Template was approved', time: 'Oct 7', unread: true },
          ]} />
        ),
        dontText: 'Don’t keep everything unread. When every row is bold, nothing stands out.',
      },
      {
        do: <NotificationCenter items={[{ initials: 'AR', color: 'pop-pink', message: 'Ana Ruiz left a 5-star review on Neon Icon Pack', time: '1 hour ago', unread: true }]} />,
        doText: 'Use relative times people read at a glance.',
        dont: <NotificationCenter items={[{ initials: 'AR', color: 'pop-pink', message: 'Ana Ruiz left a 5-star review on Neon Icon Pack', time: '2026-10-10T08:41:07Z', unread: true }]} />,
        dontText: 'Don’t show raw timestamps. People have to work out how long ago it was.',
      },
    ],
    content: [
      'Lead with the person or the listing: “Jonas Park bought Orbit UI Kit for $79”.',
      'From the marketplace, write from the user’s side: “Your payout of $1,240.00 was sent”.',
      'Times: “Just now”, “2 min ago”, “1 hour ago”, “Yesterday”, then the date, like “Oct 7”.',
      'One line per event where possible. No emoji or exclamation marks.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves to “Mark all read”, then to the All and Sales tabs.'],
      ['Enter', 'On “Mark all read”, marks every item read.'],
    ],
    notes: [
      'The panel is a role="region" labelled “Notifications”. Open it from an IconButton whose label includes the count, like “Notifications, 2 unread”.',
      'Unread rows use weight, a tint and a dot, so color is never the only signal. The dot has aria-label “Unread”, but a plain span is not always announced; keep the count in the bell’s label.',
      'Rows are not interactive yet. If a row should open the sale or review, wrap its message in a Link.',
      'The All and Sales tabs switch their selected state but don’t filter the rows yet.',
      'Message text is text-primary (unread) or text-secondary (read) on bg-raised or bg-subtle, at least 4.5:1.',
      'Close the panel with Escape and when focus or a click moves outside it; the panel doesn’t do this by itself.',
    ],
  },

  related: ['top-nav', 'popover', 'avatar', 'tabs'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Notification center in React and HTML/CSS, matching the Figma component (unread rows, tabs and mark all read).' },
  ],
};
