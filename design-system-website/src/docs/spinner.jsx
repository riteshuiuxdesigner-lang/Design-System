export default {
  id: 'spinner',
  name: 'Spinner',
  group: 'Feedback',
  order: 5,
  status: 'Stable',
  exports: ['Spinner'],
  summary: 'A small spinning ring for short waits when you can’t measure progress, like checking a file or loading more reviews. Keep it close to the thing that is loading.',

  examples: [
    {
      title: 'Default',
      desc: 'Medium (20px) in icon-secondary. It has role="status" and reads “Loading” to screen readers unless you pass a label.',
      ...ex(`
<Spinner />`),
    },
    {
      title: 'Sizes',
      desc: 'Small (16px) sits inside dense rows and small buttons. Medium (20px) is the default. Large (24px) is for loading a section or a panel.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
  <Spinner size="sm" />
  <Spinner />
  <Spinner size="lg" />
</div>`),
    },
    {
      title: 'Tones',
      desc: 'Pick the tone from the surface behind it. Default for light surfaces, inverse for bg-inverse, and on-action for primary blue.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
  <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-control-lg)', height: 'var(--size-control-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-default)' }}>
    <Spinner />
  </span>
  <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-control-lg)', height: 'var(--size-control-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-inverse)' }}>
    <Spinner tone="inverse" />
  </span>
  <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-control-lg)', height: 'var(--size-control-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--action-primary-default)' }}>
    <Spinner tone="on-action" />
  </span>
</div>`),
    },
    {
      title: 'With a visible label',
      desc: 'Say what is happening next to the Spinner and pass the same words as label, so everyone gets the same message.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
  <Spinner size="sm" label="Checking Orbit UI Kit.fig for missing fonts" />
  <span aria-hidden="true">Checking Orbit UI Kit.fig for missing fonts</span>
</div>`),
    },
    {
      title: 'Loading more',
      desc: 'When people ask for more items, swap the button for a Spinner in the same spot, then put the new items above it.',
      ...ex(`function Example() {
  const [reviews, setReviews] = useState(['Clean layers and great naming.', 'Saved me a week on our dashboard.']);
  const [loading, setLoading] = useState(false);

  function loadMore() {
    setLoading(true);
    setTimeout(() => {
      setReviews(r => r.concat(['The icon set matches perfectly.', 'Auto layout everywhere. Love it.']));
      setLoading(false);
    }, 1200);
  }

  return (
    <div style={{ width: 360, display: 'grid', gap: 'var(--space-xs)' }}>
      {reviews.map(text => (
        <ListItem key={text} title={text} meta="Verified buyer" leading={<Avatar size="sm" initials="MO" />} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: 'var(--size-control-md)', alignItems: 'center' }}>
        {loading
          ? <Spinner label="Loading more reviews" />
          : <Button variant="tertiary" size="sm" onClick={loadMore} disabled={reviews.length > 2}>{reviews.length > 2 ? 'All reviews shown' : 'Show more reviews'}</Button>}
      </div>
    </div>
  );
}`),
    },
    {
      title: 'Inside a button',
      desc: 'Buttons have their own loading state that puts a Spinner in place of the icon. Use it for actions people start, so the wait shows where they clicked.',
      ...ex(`function Example() {
  const [checking, setChecking] = useState(false);
  return (
    <Button variant="secondary" leadingIcon="refresh" loading={checking} onClick={() => { setChecking(true); setTimeout(() => setChecking(false), 1500); }}>
      Check for updates
    </Button>
  );
}`),
    },
  ],

  props: {
    Spinner: [
      ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diameter 16 / 20 / 24px (size-icon-*).'],
      ['tone', "'inverse' | 'on-action'", '', 'Color for dark or blue surfaces: icon-inverse or icon-on-action. Leave it out for icon-secondary on light surfaces.'],
      ['label', 'string', "'Loading'", 'The aria-label read by screen readers. Say what is loading.'],
      ['className', 'string', '', 'Extra class on the ring.'],
    ],
  },

  usage: {
    when: [
      'For waits of about 1–10 seconds when you can’t measure progress: checking a file, loading more reviews, saving settings.',
      'Inside the element that is loading, like a Button, a list footer or a panel.',
    ],
    whenNot: [
      'While a page or grid loads for the first time. Use a Skeleton that matches the layout.',
      'For long tasks with a known size, like uploads. Use a Progress bar.',
      'For actions under about 300ms. Show the result straight away.',
    ],
    anatomy: {
      render: (
        <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
          <Spinner size="lg" label="Loading reviews" /><span aria-hidden="true">Loading reviews</span>
        </div>
      ),
      parts: [
        'Ring: radius-full with a 2px border in currentColor. The right quarter is transparent and it turns once every 700ms.',
        'Color: icon-secondary by default, icon-inverse or icon-on-action by tone.',
        'Label (optional, visible): body-sm in text-secondary, space-xs from the ring.',
      ],
    },
    sections: [
      {
        title: 'Spinner or skeleton',
        body: 'A Spinner says “wait”. A Skeleton shows what is coming. When the layout is known, the Skeleton feels faster and the page does not jump when content arrives.',
        dos: [
          {
            do: (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', width: 300 }}>
                <AssetCardSkeleton />
                <AssetCardSkeleton />
              </div>
            ),
            doText: 'Use a Skeleton that matches the cards while a grid loads.',
            dont: (
              <div style={{ display: 'grid', placeItems: 'center', width: 300, height: 180 }}>
                <Spinner size="lg" label="Loading UI kits" />
              </div>
            ),
            dontText: 'Don’t show one Spinner in an empty area. People can’t tell what is coming or how big it is.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Button loading>Publishing</Button>,
        doText: 'Show the wait where people clicked.',
        dont: (
          <div style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'center' }}>
            <Spinner size="lg" />
            <Button>Publish</Button>
          </div>
        ),
        dontText: 'Don’t put a separate Spinner away from the button. People press again because nothing seems to happen.',
      },
      {
        do: (
          <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-control-lg)', height: 'var(--size-control-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--action-primary-default)' }}>
            <Spinner tone="on-action" />
          </span>
        ),
        doText: 'Match the tone to the surface: on-action on blue.',
        dont: (
          <span style={{ display: 'grid', placeItems: 'center', width: 'var(--size-control-lg)', height: 'var(--size-control-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--action-primary-default)' }}>
            <Spinner />
          </span>
        ),
        dontText: 'Don’t use the default grey on a dark or blue surface. It drops below 3:1 and disappears.',
      },
      {
        do: (
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
            <Spinner size="sm" label="Checking for missing fonts" /><span aria-hidden="true">Checking for missing fonts</span>
          </div>
        ),
        doText: 'Say what is happening when the wait is more than a moment.',
        dont: (
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
            <Spinner size="sm" /><span>Please wait...</span>
          </div>
        ),
        dontText: 'Don’t write “Please wait”. It says nothing about what people are waiting for.',
      },
      {
        do: <div style={{ width: 300 }}><ProgressBar label="Uploading Orbit UI Kit.fig" value={42} /></div>,
        doText: 'Use a Progress bar for long tasks you can measure.',
        dont: (
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>
            <Spinner size="sm" /><span>Uploading Orbit UI Kit.fig (1.9 GB)</span>
          </div>
        ),
        dontText: 'Don’t spin through a 2 GB upload. People can’t plan around a wait with no end.',
      },
    ],
    content: [
      'Pass a label that names the wait: “Loading more reviews”, “Checking Orbit UI Kit.fig”. The default “Loading” is a last resort.',
      'When you show text next to it, use the present tense and the object. No “Please wait”.',
      'After the wait, show the result. If it fails, replace the Spinner with an error that says how to fix it.',
    ],
  },

  a11y: {
    notes: [
      'The ring has role="status" and an aria-label (default “Loading”), so screen readers announce it when it appears.',
      'If you show visible text next to it, hide that text with aria-hidden="true" or the words are read twice.',
      'Spinner takes no focus. Keep focus on the control that started the wait.',
      'Each tone keeps the ring at 3:1 or more against its surface: icon-secondary on light, icon-inverse on bg-inverse, icon-on-action on blue.',
      'Under prefers-reduced-motion the ring stops turning. The visible label then carries the meaning, so add one for any wait longer than a moment.',
    ],
  },

  related: ['skeleton', 'progress-bar', 'button'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Spinner in React and HTML/CSS, with 3 sizes and 3 tones.' },
  ],
};
