export default {
  id: 'price-tag',
  name: 'Price tag',
  group: 'Data display',
  order: 3,
  status: 'Stable',
  figma: '27:1104',
  exports: ['PriceTag'],
  summary: 'A small pill that shows what a listing costs: a paid price, Free, or a sale price next to the original. Figures are tabular so prices line up.',

  examples: [
    {
      title: 'Paid',
      desc: 'Pass the price as a formatted string with its currency. The tag uses tabular figures, so prices in a column or grid line up digit for digit.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
  <PriceTag price="$12" />
  <PriceTag price="$49" />
  <PriceTag price="$129" />
  <PriceTag price="$1,240" />
</div>`),
    },
    {
      title: 'Free',
      desc: 'Set free, or pass price="Free". The tag turns pop-lime with ink text so free listings are easy to spot in a grid.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <PriceTag free />
  <PriceTag price="Free" />
</div>`),
    },
    {
      title: 'On sale',
      desc: 'Pass the original price as was. The sale price turns feedback-error-text and the original is struck through in text-muted.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
  <PriceTag price="$29" was="$49" />
  <PriceTag price="$79" was="$129" />
</div>`),
    },
    {
      title: 'Sizes',
      desc: 'Small is the default, for cards and lists. Medium is SemiBold with more padding, for product pages and checkout.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <PriceTag price="$49" />
  <PriceTag size="md" price="$49" />
  <PriceTag size="md" price="$29" was="$49" />
</div>`),
    },
    {
      title: 'Other currencies',
      desc: 'Format the price for the buyer’s currency and locale before you pass it in. The tag shows the string as is.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
  <PriceTag price="€45" />
  <PriceTag price="£39" />
  <PriceTag price="¥6,800" />
  <PriceTag price="R$249" />
</div>`),
    },
    {
      title: 'On a product page',
      desc: 'Put the price next to the title and repeat it in the buy button, so people see the cost before and when they commit.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 340, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
    <span style={{ font: '600 18px/28px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI kit</span>
    <PriceTag size="md" price="$29" was="$49" />
  </div>
  <span style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Sale ends Sunday. Standard license, 240 components, Figma and Sketch files.</span>
  <Button size="lg" leadingIcon="shopping-bag-01" style={{ width: '100%' }}>Buy for $29</Button>
</div>`),
    },
  ],

  props: {
    PriceTag: [
      ['price', 'string', '', 'The formatted price with its currency: "$49", "€45". "Free" switches to the free style.'],
      ['free', 'boolean', 'false', 'Shows “Free” on pop-lime with ink text. Ignores price.'],
      ['was', 'string', '', 'The original price. Makes it a sale: the price turns red and was is struck through.'],
      ['size', "'sm' | 'md'", "'sm'", 'Small for cards and lists. Medium (SemiBold, more padding) for product pages and checkout.'],
      ['className', 'string', '', 'Extra classes on the tag.'],
    ],
  },

  usage: {
    when: [
      'To show the price of a listing on cards, lists, product pages and in the cart.',
      'To mark a listing as free, or to show a sale with the original price.',
    ],
    whenNot: [
      'For totals, payouts and other money in tables. Write the amount as right-aligned text.',
      'For numbers that aren’t prices, like sales counts or ratings.',
      'As the buy action. Put the price in the Button label: “Buy for $49”.',
    ],
    anatomy: {
      render: <PriceTag size="md" price="$29" was="$49" />,
      parts: [
        'Container: pill (radius-control) on bg-muted, or pop-lime when free.',
        'Price: numeric with tabular figures, text-primary. feedback-error-text when on sale.',
        'Original price (optional): text-muted with a line through it.',
        'Gap: space-2xs between the price and the original.',
      ],
    },
    sections: [
      {
        title: 'Sales',
        body: 'A sale is only believable when people can see what it was before. Always pass was, and put the end date in the copy nearby.',
        dos: [
          {
            do: <PriceTag size="md" price="$29" was="$49" />,
            doText: 'Show the original price next to the sale price.',
            dont: <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><PriceTag size="md" price="$29" /><Badge variant="orange">Sale</Badge></div>,
            dontText: 'Don’t say “Sale” without the original price. People can’t tell how much they save.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <PriceTag size="md" price="$49" />,
        doText: 'Always include the currency symbol.',
        dont: <PriceTag size="md" price="49" />,
        dontText: 'Don’t show a bare number. 49 could be dollars, euros or credits.',
      },
      {
        do: <PriceTag size="md" free />,
        doText: 'Use free for listings that cost nothing. The lime pill is easy to spot.',
        dont: <PriceTag size="md" price="$0.00" />,
        dontText: 'Don’t write $0.00. It reads like an error and hides the best thing about the listing.',
      },
      {
        do: <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}><PriceTag price="$12" /><PriceTag price="$49" /><PriceTag price="$129" /></div>,
        doText: 'Use whole numbers when every price is whole, and the same format across a list.',
        dont: <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}><PriceTag price="$12.00" /><PriceTag price="$49" /><PriceTag price="$129.5" /></div>,
        dontText: 'Don’t mix decimal styles. The prices stop lining up and look like typos.',
      },
      {
        do: <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>1,240 sales</span>,
        doText: 'Write other numbers as plain text.',
        dont: <PriceTag price="1,240 sales" />,
        dontText: 'Don’t put non-prices in a PriceTag. People read the pill as a cost.',
      },
    ],
    content: [
      'Format with the currency symbol and thousands separators: “$1,240”, not “1240 USD”.',
      'Use the buyer’s currency and locale. Format the string before you pass it in.',
      'Repeat the price in the purchase button: “Buy for $49”.',
    ],
  },

  a11y: {
    notes: [
      'PriceTag is plain text in a <span>, so screen readers read the price as written. Include the currency symbol.',
      'On sale, the original price carries a visually hidden “was”, so screen readers hear “$29 was $49” instead of two bare numbers.',
      'The sale color is not the only signal: the struck-through original shows the change too.',
      'text-primary on bg-muted and text-on-pop on pop-lime both pass 4.5:1.',
    ],
  },

  related: ['asset-card', 'badge', 'button'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'The original sale price now has a visually hidden “was” for screen readers.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Price tag in React and HTML/CSS, matching the Figma component (paid, free and sale, in 2 sizes).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
