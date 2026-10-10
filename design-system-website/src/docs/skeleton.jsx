export default {
  id: 'skeleton',
  name: 'Skeleton',
  group: 'Feedback',
  order: 6,
  status: 'Stable',
  figma: '27:1331',
  exports: ['Skeleton'],
  summary: 'A grey shimmering placeholder in the shape of the content that is loading: a card image, a line of text, an avatar. The page keeps its layout, so nothing jumps when the real content arrives.',

  examples: [
    {
      title: 'Shapes',
      desc: 'Text is a 16px pill line. Circle is for avatars and needs a width and height. Media is a 4:3 thumbnail with radius-xl. Pill matches a 44px control.',
      ...ex(`
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 120px)', gap: 'var(--space-lg)', alignItems: 'center' }}>
  <Skeleton shape="text" />
  <Skeleton shape="circle" width={40} height={40} />
  <Skeleton shape="media" />
  <Skeleton shape="pill" width={120} />
</div>`),
    },
    {
      title: 'Lines of text',
      desc: 'Vary the widths so the block reads as a paragraph. Make the last line shorter.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-xs)', width: 360 }}>
  <Skeleton width="100%" />
  <Skeleton width="92%" />
  <Skeleton width="60%" />
</div>`),
    },
    {
      title: 'Asset cards',
      desc: 'AssetCardSkeleton matches Asset Card: thumbnail, title and creator line. Show as many as fill the first screen of the grid.',
      ...ex(`
<div aria-busy="true" aria-label="Loading UI kits" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 'var(--space-lg)' }}>
  <AssetCardSkeleton />
  <AssetCardSkeleton />
  <AssetCardSkeleton />
</div>`),
    },
    {
      title: 'List rows',
      desc: 'Build other layouts from the shapes. Here each row has an avatar, a name and a meta line, like a list of creators.',
      ...ex(`
<div aria-busy="true" aria-label="Loading creators" style={{ display: 'grid', gap: 'var(--space-md)', width: 360 }}>
  {['70%', '55%', '64%'].map(w => (
    <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <Skeleton shape="circle" width={40} height={40} />
      <div style={{ flex: 1, display: 'grid', gap: 'var(--space-xs)' }}>
        <Skeleton width={w} />
        <Skeleton width="35%" />
      </div>
      <Skeleton shape="pill" width={88} height="var(--size-control-sm)" />
    </div>
  ))}
</div>`),
    },
    {
      title: 'Loading, then content',
      desc: 'Swap the skeletons for the real content in one go, in the same grid. Set aria-busy on the container while it loads.',
      ...ex(`function Example() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'start' }}>
      <div aria-busy={loading} aria-label="Trending UI kits" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gap: 'var(--space-lg)' }}>
        {loading ? (
          <>
            <AssetCardSkeleton />
            <AssetCardSkeleton />
            <AssetCardSkeleton />
          </>
        ) : (
          <>
            <AssetCard title="Orbit UI Kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" />
            <AssetCard title="Neon Icon Pack" creator="Theo Lind" initials="TL" price="$24" thumbColor="pop-lime" avatarColor="pop-orange" />
            <AssetCard title="Pitch Deck Template" creator="Ana Ruiz" initials="AR" price="Free" thumbColor="pop-yellow" avatarColor="pop-pink" />
          </>
        )}
      </div>
      <Button variant="secondary" size="sm" leadingIcon="refresh" onClick={() => setLoading(true)} disabled={loading}>Reload</Button>
    </div>
  );
}`),
    },
    {
      title: 'Dashboard tiles',
      desc: 'Keep the real container and its fixed labels, and only replace the numbers that are loading.',
      stage: 'muted',
      ...ex(`
<div aria-busy="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)', gap: 'var(--space-md)' }}>
  {['Sales this month', 'Pending payout'].map(label => (
    <div key={label} style={{ display: 'grid', gap: 'var(--space-sm)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)' }}>
      <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>{label}</span>
      <Skeleton width="70%" height={32} />
      <Skeleton width="45%" />
    </div>
  ))}
</div>`),
    },
  ],

  props: {
    Skeleton: [
      ['shape', "'text' | 'circle' | 'media' | 'pill'", "'text'", 'Text: 16px pill line. Circle: radius-full. Media: full width, 4:3, radius-xl. Pill: 44px tall, radius-control.'],
      ['width', 'number | string', '', 'Width in px or any CSS length, like “60%”. Text and pill fill their container when left out.'],
      ['height', 'number | string', '', 'Height in px or any CSS length. Needed for circle; overrides the shape’s height otherwise.'],
      ['className', 'string', '', 'Extra class on the placeholder.'],
    ],
  },

  usage: {
    when: [
      'While a page, grid or list loads for the first time and you know its layout.',
      'While parts of a loaded page refresh, like the numbers on dashboard tiles.',
    ],
    whenNot: [
      'For a wait people start with a button. Use the Button’s loading state.',
      'For uploads and exports. Use a Progress bar.',
      'For content that failed to load. Replace the skeleton with an error and a way to retry.',
      'For things that are already known, like the page title, tabs and buttons. Render them right away.',
    ],
    anatomy: {
      render: <div style={{ width: 200 }}><AssetCardSkeleton /></div>,
      parts: [
        'Media: shape="media", full width, 4:3, radius-xl. Matches the Asset Card thumbnail.',
        'Title line: shape="text", 70% wide, 16px tall pill.',
        'Avatar: shape="circle", 24px, like the creator avatar.',
        'Meta line: shape="text", 40% wide.',
        'Fill: a bg-muted to bg-muted-hover gradient that moves across every 1.4s. It stops moving under reduced motion.',
      ],
    },
    sections: [
      {
        title: 'Match the layout',
        body: 'Each placeholder takes the size and position of the content it stands for. When the content arrives, it lands in the same place and nothing jumps.',
        dos: [
          {
            do: (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', width: 300 }}>
                <AssetCardSkeleton />
                <AssetCardSkeleton />
              </div>
            ),
            doText: 'Show skeleton cards that match the grid while it loads.',
            dont: (
              <div style={{ display: 'grid', placeItems: 'center', width: 300, height: 200 }}>
                <Spinner size="lg" label="Loading UI kits" />
              </div>
            ),
            dontText: 'Don’t show one Spinner where a grid will be. The page looks empty, then jumps when the cards arrive.',
          },
          {
            do: (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', width: 300 }}>
                <AssetCardSkeleton />
                <AssetCardSkeleton />
              </div>
            ),
            doText: 'Build placeholders from the real parts of the card.',
            dont: (
              <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 300 }}>
                <Skeleton shape="pill" height={120} />
                <Skeleton shape="pill" height={40} />
              </div>
            ),
            dontText: 'Don’t use generic grey blocks. They hint at a different layout and the content still jumps.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 300 }}>
            <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Your listings</span>
            <Skeleton width="90%" />
            <Skeleton width="75%" />
            <Skeleton width="82%" />
          </div>
        ),
        doText: 'Render what you already know, like the title. Only the data gets a skeleton.',
        dont: (
          <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 300 }}>
            <Skeleton width="50%" height={28} />
            <Skeleton width="90%" />
            <Skeleton width="75%" />
            <Skeleton width="82%" />
          </div>
        ),
        dontText: 'Don’t hide fixed text behind a skeleton. People can’t tell which page they are on.',
      },
      {
        do: (
          <div style={{ width: 300 }}>
            <Alert variant="error" title="Couldn’t load your listings" action={<div style={{ marginTop: 'var(--space-sm)' }}><Button variant="secondary" size="sm" leadingIcon="refresh">Retry</Button></div>}>
              Check your connection, then retry.
            </Alert>
          </div>
        ),
        doText: 'When loading fails, replace the skeleton with an error and a Retry button.',
        dont: (
          <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 300 }}>
            <Skeleton width="90%" />
            <Skeleton width="75%" />
            <Skeleton width="82%" />
            <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Still loading after 30 seconds</span>
          </div>
        ),
        dontText: 'Don’t leave a skeleton shimmering after a request fails. People wait for something that will never come.',
      },
      {
        do: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: 300 }}>
            <Skeleton shape="circle" width={40} height={40} />
            <div style={{ flex: 1, display: 'grid', gap: 'var(--space-xs)' }}><Skeleton width="70%" /><Skeleton width="40%" /></div>
          </div>
        ),
        doText: 'Keep skeletons calm: bg-muted and a slow shimmer.',
        dont: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: 300 }}>
            <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--pop-violet)' }} />
            <div style={{ flex: 1, display: 'grid', gap: 'var(--space-xs)' }}>
              <span style={{ height: 'var(--space-md)', width: '70%', borderRadius: 'var(--radius-full)', background: 'var(--pop-yellow)' }} />
              <span style={{ height: 'var(--space-md)', width: '40%', borderRadius: 'var(--radius-full)', background: 'var(--pop-pink)' }} />
            </div>
          </div>
        ),
        dontText: 'Don’t color placeholders with pop colors. They read as real content and pull attention from the page.',
      },
    ],
    content: [
      'Skeletons have no text. Name what is loading with aria-label on the container: “Loading UI kits”.',
      'Show enough placeholders to fill the first screen, and no more.',
      'If loading takes more than about 10 seconds, say so and offer a way out.',
    ],
  },

  a11y: {
    notes: [
      'Each Skeleton is aria-hidden="true", so screen readers skip it.',
      'Set aria-busy="true" and an aria-label on the container while it loads. Remove aria-busy when the content arrives.',
      'Skeletons take no focus. Don’t put focusable elements inside a loading area.',
      'The shimmer moves every 1.4s. Under prefers-reduced-motion it stops moving.',
    ],
  },

  related: ['spinner', 'progress-bar', 'asset-card', 'empty-state'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Skeleton in React and HTML/CSS, with text, circle, media and pill shapes, plus AssetCardSkeleton.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Text and control placeholders became pills, and the fill moved to pure-grey bg-muted.' },
  ],
};
