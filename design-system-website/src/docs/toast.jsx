export default {
  id: 'toast',
  name: 'Toast',
  group: 'Feedback',
  order: 2,
  status: 'Stable',
  figma: '32:41',
  exports: ['Toast'],
  summary: 'A dark pill that pops up at the bottom of the screen to confirm an action, like “Published” or “Added to collection”, then leaves on its own after about 4 seconds. It can offer one quick action such as Undo.',

  examples: [
    {
      title: 'Show a toast',
      desc: 'Show the Toast right after the action finishes, pinned to the bottom center of the viewport. Hide it after about 4 seconds. Undo reverses the action and closes the Toast at once.',
      ...ex(`function Example() {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function toggle() {
    const next = !saved;
    setSaved(next);
    setToast({ id: Date.now(), message: next ? 'Added to Dashboard kits' : 'Removed from Dashboard kits', undo: !next });
  }

  function undo() {
    setSaved(toast.undo);
    setToast(null);
  }

  return (
    <>
      <Button variant={saved ? 'secondary' : 'primary'} leadingIcon={saved ? 'tick-02' : 'bookmark-01'} onClick={toggle}>
        {saved ? 'In Dashboard kits' : 'Add to collection'}
      </Button>
      {toast && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'var(--space-xl)', zIndex: 60, display: 'flex', justifyContent: 'center', padding: '0 var(--space-md)', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Toast key={toast.id} message={toast.message} actionLabel="Undo" onAction={undo} onDismiss={() => setToast(null)} />
          </div>
        </div>
      )}
    </>
  );
}`),
    },
    {
      title: 'Variants',
      desc: 'Success shows a lime check sticker and is the default. Warning shows a yellow alert sticker. Error shows a pink alert sticker. Neutral shows a plain info icon for updates that are neither good nor bad.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' }}>
  <Toast message="Published" />
  <Toast variant="warning" message="Saved, but 1 preview image is missing" />
  <Toast variant="error" message="Couldn’t save. Check your connection." actionLabel="Retry" />
  <Toast variant="neutral" message="Your payout is scheduled for Friday" />
</div>`),
    },
    {
      title: 'With an action',
      desc: 'Add one short action with actionLabel and onAction. Use Undo after something people may regret and Retry after a failure. The action must also be possible somewhere else, because the Toast goes away.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', justifyItems: 'start' }}>
  <Toast message="Listing archived" actionLabel="Undo" onAction={() => {}} />
  <Toast variant="error" message="Preview image didn’t upload" actionLabel="Retry" onAction={() => {}} />
</div>`),
    },
    {
      title: 'Dismissible',
      desc: 'Pass onDismiss to show a close button. Always add it to error Toasts and to any Toast that stays longer than 4 seconds.',
      stage: 'muted',
      ...ex(`
<Toast variant="error" message="Payout failed. Update your bank details." actionLabel="Update" onAction={() => {}} onDismiss={() => {}} />`),
    },
    {
      title: 'Error that waits',
      desc: 'A failure people have to act on stays until they retry or close it. Here the first try fails, the Toast offers Retry, and the second try shows a success Toast that leaves on its own.',
      ...ex(`function Example() {
  const [toast, setToast] = useState(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!toast || toast.variant === 'error') return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function publish() {
    const next = tries + 1;
    setTries(next);
    setToast(next === 1
      ? { id: next, variant: 'error', message: 'Couldn’t publish. Check your connection.' }
      : { id: next, variant: 'success', message: 'Published' });
  }

  return (
    <>
      <Button leadingIcon="rocket-01" onClick={publish}>Publish Neon Icon Pack</Button>
      {toast && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'var(--space-xl)', zIndex: 60, display: 'flex', justifyContent: 'center', padding: '0 var(--space-md)', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Toast
              key={toast.id}
              variant={toast.variant}
              message={toast.message}
              actionLabel={toast.variant === 'error' ? 'Retry' : undefined}
              onAction={publish}
              onDismiss={() => setToast(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}`),
    },
    {
      title: 'On mobile',
      desc: 'On phones the Toast sits above the bottom navigation, centered, with space-md on each side. It never covers the main action.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 360, height: 520, overflow: 'hidden', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-default)', border: 'var(--border-width-default) solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
  <div style={{ position: 'relative', flex: 1, padding: 'var(--space-md)' }}>
    <AssetCard title="Orbit UI Kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" saved />
    <div style={{ position: 'absolute', left: 'var(--space-md)', right: 'var(--space-md)', bottom: 'var(--space-md)', display: 'flex', justifyContent: 'center' }}>
      <Toast message="Saved to your collection" actionLabel="Undo" onAction={() => {}} />
    </div>
  </div>
  <BottomNav defaultValue="Browse" />
</div>`),
    },
  ],

  props: {
    Toast: [
      ['message', 'ReactNode', '', 'The confirmation. Short, past tense for success: “Published”.'],
      ['variant', "'success' | 'warning' | 'error' | 'neutral'", "'success'", 'Success: tick-02 on a pop-lime sticker. Warning: alert-02 on pop-yellow. Error: alert-circle on pop-pink, announced at once. Neutral: information-circle with no sticker.'],
      ['actionLabel', 'string', '', 'Label of the one action button, like “Undo” or “Retry”. Leave it out for no action.'],
      ['onAction', '() => void', '', 'Called when the action button is pressed.'],
      ['onDismiss', '() => void', '', 'Shows a close button (aria-label “Dismiss”) and calls this when pressed.'],
      ['className', 'string', '', 'Extra class on the pill.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the pill: id, style, data-*, aria-*.'],
    ],
  },

  usage: {
    when: [
      'To confirm that an action worked: published, saved, added to cart, link copied.',
      'To offer a short Undo after an action that is easy to reverse, like archiving or removing.',
      'To report a background failure people can retry, like an upload that dropped.',
    ],
    whenNot: [
      'For errors people must fix in a form. Show them on the field and in an Alert.',
      'For anything people must read or decide. Use a Modal.',
      'For information that should stay on the page, like a listing in review. Use an Alert.',
      'For the only way to do something. The Toast disappears, so the action must exist elsewhere too.',
    ],
    anatomy: {
      render: <Toast message="Listing archived" actionLabel="Undo" onAction={() => {}} onDismiss={() => {}} />,
      parts: [
        'Container: pill (radius-control), bg-inverse, elevation-3, at least size-control-lg (52px) tall. Springs up 16px with a 320ms spring.',
        'Icon sticker: 24px circle in pop-lime (success), pop-yellow (warning) or pop-pink (error), with a 16px icon in icon-on-pop.',
        'Message: Inter Display Medium 14/20 in text-inverse.',
        'Action (optional): small pill (size-control-sm) on alpha-white-10, label-sm in text-inverse.',
        'Dismiss (optional): 36px round button with a 16px cancel-01 in icon-inverse.',
      ],
    },
    sections: [
      {
        title: 'Timing',
        body: 'Success and neutral Toasts leave after about 4 seconds; add 2 seconds when there is an action. Error Toasts stay until people retry or close them. Show one Toast at a time and replace the old one with the new.',
        dos: [
          {
            do: <Toast variant="error" message="Couldn’t publish. Check your connection." actionLabel="Retry" onAction={() => {}} onDismiss={() => {}} />,
            doText: 'Give an error Toast a Retry and a close button, and keep it until people act.',
            dont: <Toast variant="error" message="Couldn’t publish" />,
            dontText: 'Don’t let an error Toast vanish with no action. People look up and the failure is gone.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Toast message="Added to Dashboard kits" actionLabel="Undo" onAction={() => {}} />,
        doText: 'Confirm a quick action with a Toast. People keep working while it goes away.',
        dont: (
          <div style={{ width: 340, display: 'flex' }}>
            <Modal inline open title="Success" icon="checkmark-circle-02" primaryLabel="OK" secondaryLabel="Close">
              Orbit UI Kit was added to your collection.
            </Modal>
          </div>
        ),
        dontText: 'Don’t stop people with a Modal to say something worked. It costs a click and adds nothing.',
      },
      {
        do: <Toast message="Published" />,
        doText: 'Use a few words in the past tense.',
        dont: (
          <div style={{ width: 340 }}>
            <Toast message="Your listing has been successfully published and is now visible to all buyers on the marketplace!" />
          </div>
        ),
        dontText: 'Don’t write a sentence people can’t finish before it disappears.',
      },
      {
        do: (
          <div style={{ width: 280 }}>
            <TextField label="Price" defaultValue="$0.50" leadingIcon="dollar-01" error="Set a price of $1 or more." />
          </div>
        ),
        doText: 'Show a form error next to the field that needs fixing.',
        dont: (
          <div style={{ width: 300, display: 'grid', gap: 'var(--space-md)', justifyItems: 'start' }}>
            <TextField label="Price" defaultValue="$0.50" leadingIcon="dollar-01" />
            <Toast variant="error" message="Invalid price" />
          </div>
        ),
        dontText: 'Don’t report a field error in a Toast. It leaves before people find the field.',
      },
      {
        do: <Toast message="Listing archived" actionLabel="Undo" onAction={() => {}} />,
        doText: 'Keep the action to one short verb.',
        dont: (
          <div style={{ width: 360 }}>
            <Toast message="Listing archived" actionLabel="Click here to undo this" onAction={() => {}} />
          </div>
        ),
        dontText: 'Don’t use a long or vague action label. It crowds the message and reads as a link.',
      },
    ],
    content: [
      'Success: the past tense of the button that started it. “Publish” becomes “Published”.',
      'Name the object when it helps: “Added to Dashboard kits”, “Link copied”.',
      'Errors say what failed and the fix in one line: “Couldn’t save. Check your connection.”',
      'No “Success!”, exclamation marks or emoji.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to the action button, then to the dismiss button.'],
      ['Enter / Space', 'Activates the focused button.'],
    ],
    notes: [
      'Success, warning and neutral Toasts use role="status" and aria-live="polite", so screen readers read them after what they are reading now. Error Toasts use role="alert" and aria-live="assertive" and are read at once. Focus stays where it was.',
      'Some screen readers skip a live region that appears together with its text. Keep the fixed container on the page and render the Toast inside it.',
      'The 4-second timer runs even while people hover or focus the Toast. Add time when there is an action, and keep error Toasts open until they are closed.',
      'Undo and Retry must also be possible somewhere else on the page, because keyboard and screen reader users may not reach the Toast in time.',
      'Text is text-inverse on bg-inverse in both themes. The 36px action and close buttons show shadow-focus-ring on keyboard focus.',
      'The Toast springs in from 16px below. Under prefers-reduced-motion it appears without moving.',
    ],
  },

  related: ['alert', 'modal', 'button'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added the warning variant and native attribute passthrough. Error Toasts now use role="alert" with aria-live="assertive".' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Toast in React and HTML/CSS, matching the Figma component (success, error and neutral, with optional action and dismiss).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Toast became a pill (radius-control) with a spring entrance.' },
  ],
};
