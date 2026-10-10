export default {
  id: 'pagination',
  name: 'Pagination',
  group: 'Navigation',
  order: 2,
  status: 'Stable',
  figma: '36:1717',
  exports: ['Pagination'],
  summary: 'Moves people through long result lists one page at a time. Numbered pages on desktop, a compact “Page 3 of 54” where space is tight.',

  examples: [
    {
      title: 'Default',
      desc: 'Pagination is controlled. Keep the page in state and update it in onChange. It always shows the first page, the last page and the pages either side of the current one.',
      ...ex(`function Example() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={54} onChange={setPage} />;
}`),
    },
    {
      title: 'Middle of a long list',
      desc: 'Gaps collapse into an ellipsis, so the control stays the same width on page 2 and page 27.',
      ...ex(`function Example() {
  const [page, setPage] = useState(27);
  return <Pagination page={page} pageCount={54} onChange={setPage} />;
}`),
    },
    {
      title: 'Compact',
      desc: 'Use compact on mobile and in narrow panels. It keeps the arrows and replaces the numbers with “Page 3 of 54”.',
      ...ex(`function Example() {
  const [page, setPage] = useState(3);
  return <Pagination compact page={page} pageCount={54} onChange={setPage} />;
}`),
    },
    {
      title: 'First and last page',
      desc: 'Previous is disabled on the first page and Next on the last, so people can tell they reached the end.',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'start' }}>
  <Pagination page={1} pageCount={8} />
  <Pagination page={8} pageCount={8} />
</div>`),
    },
    {
      title: 'Under a results grid',
      desc: 'A realistic browse page. Show the range of results next to the control and move focus back to the top of the grid when the page changes.',
      stage: 'muted',
      ...ex(`function Example() {
  const [page, setPage] = useState(3);
  const perPage = 24;
  const total = 1296;
  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-lg)', width: 560 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
        <AssetCard title="Neon dashboard UI kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" />
        <AssetCard title="Pastel icon pack" creator="Jun Park" initials="JP" price="$19" thumbColor="pop-lime" avatarColor="pop-pink" />
        <AssetCard title="Portfolio template" creator="Sam Reyes" initials="SR" price="Free" thumbColor="pop-yellow" avatarColor="pop-orange" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {'Showing ' + first + '–' + last + ' of 1,296 UI kits'}
        </span>
        <Pagination page={page} pageCount={Math.ceil(total / perPage)} onChange={setPage} />
      </div>
    </div>
  );
}`),
    },
  ],

  props: {
    Pagination: [
      ['page', 'number', '1', 'The current page, starting at 1. Pagination does not keep its own state.'],
      ['pageCount', 'number', '1', 'The total number of pages.'],
      ['onChange', '(page: number) => void', '', 'Called with the new page. Pages outside 1…pageCount are ignored.'],
      ['compact', 'boolean', 'false', 'Replaces the page numbers with “Page 3 of 54”. Use on mobile and in narrow panels.'],
      ['className', 'string', '', 'Extra class on the nav.'],
    ],
  },

  usage: {
    when: [
      'For long result lists people come back to and talk about: browse results, search results, order history.',
      'When people need to know how big a list is and jump to a known spot.',
    ],
    whenNot: [
      'For a list that fits on one page. Show everything.',
      'For a feed people scroll casually, like a creator’s activity. Load more as they reach the end.',
      'To move through the steps of a form. Use a Stepper.',
    ],
    anatomy: {
      render: <Pagination page={3} pageCount={54} />,
      parts: [
        'Previous and Next: small ghost Icon Buttons (36px pills) with arrow-left-01 and arrow-right-01. Disabled at either end.',
        'Page: 36px pill (pagination-item-size), 14/20 SemiBold with tabular figures in text-secondary. Labelled “Page 3” for screen readers.',
        'Current page: bg-selected with text-selected and aria-current="page".',
        'Gap: an ellipsis that stands in for the hidden pages. Not clickable.',
      ],
    },
    sections: [
      {
        title: 'Full or compact',
        body: 'Numbered pages need about 360px. Below that, switch to compact so the control never wraps or scrolls. A good rule is full on desktop and tablet, compact on mobile.',
        dos: [
          {
            do: <div style={{ width: 280, padding: 'var(--space-sm)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'center' }}><Pagination compact page={27} pageCount={54} /></div>,
            doText: 'Use compact in a phone-width layout.',
            dont: <div style={{ width: 280, padding: 'var(--space-sm)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflowX: 'auto' }}><Pagination page={27} pageCount={54} /></div>,
            dontText: 'Don’t squeeze numbered pages into a narrow screen. They run off the edge and the Next button is hidden.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-xs)', justifyItems: 'center' }}><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Showing 49–72 of 1,296 UI kits</span><Pagination page={3} pageCount={54} /></div>,
        doText: 'Say how many results there are and which ones are showing.',
        dont: <Pagination page={3} pageCount={54} />,
        dontText: 'Don’t leave the numbers to speak for themselves. “54” says nothing about how many assets match.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><ListItem leading={<Avatar size="sm" initials="MO" color="pop-violet" />} title="Neon dashboard UI kit" meta="Order #4821 · $49" /><ListItem leading={<Avatar size="sm" initials="JP" color="pop-lime" />} title="Pastel icon pack" meta="Order #4790 · $19" /></div>,
        doText: 'Show the whole list when it fits on one page.',
        dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 280 }}><ListItem leading={<Avatar size="sm" initials="MO" color="pop-violet" />} title="Neon dashboard UI kit" meta="Order #4821 · $49" /><ListItem leading={<Avatar size="sm" initials="JP" color="pop-lime" />} title="Pastel icon pack" meta="Order #4790 · $19" /><Pagination page={1} pageCount={1} /></div>,
        dontText: 'Don’t show Pagination for a single page. Two disabled arrows and a lone “1” add noise.',
      },
      {
        do: <Pagination page={3} pageCount={12} />,
        doText: 'Use the built-in ellipsis so the control keeps one width.',
        dont: <div style={{ display: 'flex', gap: 'var(--space-2xs)', flexWrap: 'wrap', width: 300 }}>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <Button key={n} size="sm" variant={n === 6 ? 'primary' : 'tertiary'}>{n}</Button>)}</div>,
        dontText: 'Don’t build pagination from a row of Buttons. It wraps, shouts in blue and misses aria-current.',
      },
    ],
    content: [
      'Pair the control with a range: “Showing 49–72 of 1,296 UI kits”.',
      'Keep the page in the URL (?page=3) so people can share and come back to it.',
      'Place it under the results, aligned with the grid. On mobile, center it.',
      'After a page change, move focus to the results heading and scroll to the top of the grid.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves through Previous, each page and Next.'],
      ['Enter / Space', 'Goes to the focused page.'],
    ],
    notes: [
      'Renders a <nav aria-label="Pagination">, so it shows up as a landmark.',
      'The current page has aria-current="page". Previous and Next have labels (“Previous page”, “Next page”) and are disabled at the ends.',
      'Each page button has aria-label="Page 3", so it is announced as a page, not a bare number. Still add a visible range so sighted people know what the numbers mean.',
      'Buttons are 36px, below the 44px touch target. Use compact on touch screens, where the arrows are the main control.',
      'The current page is shown by fill and weight, not color alone.',
    ],
  },

  related: ['table', 'asset-card', 'tabs'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Page buttons now have aria-label="Page N".' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Pagination in React and HTML/CSS, matching the Figma component (full and compact).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Page buttons became pills with tabular Inter Display figures.' },
  ],
};
