export default {
  id: 'rating',
  name: 'Rating',
  group: 'Data display',
  order: 4,
  status: 'Stable',
  figma: '27:1321',
  exports: ['Rating'],
  summary: 'Read-only stars with the average score and the number of reviews. The number is always there, so the rating never depends on counting stars.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass the average as value and the number of reviews as count. The score shows with one decimal and the count in brackets after it.',
      ...ex(`
<Rating value={4.8} count="1,240" />`),
    },
    {
      title: 'Small',
      desc: 'Small uses 16px stars for cards, list rows and tables. Medium (20px) is the default, for product pages and review summaries.',
      ...ex(`
<div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
  <Rating size="sm" value={4.6} count="312" />
  <Rating value={4.6} count="312" />
</div>`),
    },
    {
      title: 'Without a count',
      desc: 'Leave out count where space is tight and the number of reviews is shown elsewhere on the page.',
      ...ex(`
<Rating size="sm" value={4.9} />`),
    },
    {
      title: 'How stars round',
      desc: 'Stars fill to the nearest whole star, so 4.4 shows four and 4.5 shows five. The number always shows the exact score.',
      ...ex(`
<div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
  <Rating value={4.4} count="86" />
  <Rating value={4.5} count="86" />
  <Rating value={3.2} count="14" />
</div>`),
    },
    {
      title: 'No reviews yet',
      desc: 'A new listing has no score. Don’t render Rating with 0. Write it out instead, so the listing doesn’t look badly rated.',
      ...ex(`
<span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>No reviews yet</span>`),
    },
    {
      title: 'In a listing header',
      desc: 'Put the rating under the title, next to the creator, so people judge quality before they look at the price.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 360, maxWidth: '100%', display: 'grid', gap: 'var(--space-xs)', padding: 'var(--space-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Mono icon pack</span>
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Rating size="sm" value={4.9} count="2,031" />
    <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>by Jonas Weber</span>
  </div>
</div>`),
    },
  ],

  props: {
    Rating: [
      ['value', 'number', '0', 'The average score out of 5. Shown with one decimal; stars round to the nearest whole star.'],
      ['count', 'number | string', '', 'Number of reviews, shown in brackets and read by screen readers. Pass a formatted string for thousands: "1,240".'],
      ['size', "'sm' | 'md'", "'md'", '16px stars for cards and lists, 20px for product pages.'],
      ['className', 'string', '', 'Extra classes on the rating.'],
    ],
  },

  usage: {
    when: [
      'To show the average review score of a listing or a creator.',
      'On cards, search results and product pages, where people compare quality.',
    ],
    whenNot: [
      'To let people leave a rating. Rating is read-only; use a review form.',
      'When there are no reviews yet. Write “No reviews yet”.',
      'For scores that aren’t out of 5, like a percentage. Write the number as text.',
    ],
    anatomy: {
      render: <Rating value={4.8} count="1,240" />,
      parts: [
        'Stars: five star icons, 20px (16px when small), space-3xs apart. Filled stars use feedback-warning-icon, empty ones border-strong.',
        'Score: the value with one decimal, Inter Display Medium 14/20, tabular figures, text-secondary.',
        'Count (optional): the number of reviews in brackets after the score.',
        'Gap: space-xs between the stars and the score.',
      ],
    },
    dos: [
      {
        do: <Rating value={4.6} count="1,240" />,
        doText: 'Use Rating, which always shows the score as a number.',
        dont: <span style={{ display: 'inline-flex', gap: 2 }}><Icon name="star" color="var(--feedback-warning-icon)" /><Icon name="star" color="var(--feedback-warning-icon)" /><Icon name="star" color="var(--feedback-warning-icon)" /><Icon name="star" color="var(--feedback-warning-icon)" /><Icon name="star" color="var(--border-strong)" /></span>,
        dontText: 'Don’t show stars alone. People have to count them, the exact score is lost, and screen readers hear nothing.',
      },
      {
        do: <Rating value={4.7} count="312" />,
        doText: 'Show the review count, so people know how much to trust the score.',
        dont: <Rating value={5} />,
        dontText: 'Don’t show a perfect score without the count. 5.0 from two reviews isn’t the same as 4.7 from 312.',
      },
      {
        do: <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-muted)' }}>No reviews yet</span>,
        doText: 'Say there are no reviews yet on new listings.',
        dont: <Rating value={0} />,
        dontText: 'Don’t render a 0.0 rating. Empty stars look like the worst possible score.',
      },
      {
        do: <div style={{ display: 'grid', gap: 4, width: 200 }}><span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI kit</span><Rating size="sm" value={4.8} count="1,240" /></div>,
        doText: 'Use Small on cards and in lists.',
        dont: <div style={{ display: 'grid', gap: 4, width: 200 }}><span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI kit</span><Rating value={4.8} count="1,240" /></div>,
        dontText: 'Don’t use the default size on a card. The stars compete with the title.',
      },
    ],
    content: [
      'Show the score with one decimal: “4.8”. Rating does this for you.',
      'Format review counts with thousands separators: “1,240”.',
      'For listings without reviews, write “No reviews yet”, not “0 reviews”.',
    ],
  },

  a11y: {
    notes: [
      'Rating has role="img" and an aria-label like “Rated 4.8 out of 5 from 1,240 reviews”, so screen readers read one clear sentence instead of five icons.',
      'The score is always shown as a number, so filled and empty stars are never the only signal.',
      'Rating is read-only and not focusable. Don’t attach click handlers to it.',
      'The score uses text-secondary, which passes 4.5:1 on bg-surface.',
    ],
  },

  related: ['asset-card', 'creator-card', 'price-tag'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Rating in React and HTML/CSS, matching the Figma component (2 sizes, with optional review count).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Icons moved to Hugeicons stroke, including the rating star.' },
  ],
};
