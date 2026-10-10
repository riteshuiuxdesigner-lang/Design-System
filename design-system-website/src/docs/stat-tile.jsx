export default {
  id: 'stat-tile',
  name: 'Stat tile',
  group: 'Data display',
  order: 9,
  status: 'Stable',
  figma: '29:494',
  exports: ['StatTile'],
  summary: 'One key number for a seller dashboard: a label, a big value and how it changed. A small pop-color sticker with an icon makes each metric easy to spot.',

  examples: [
    {
      title: 'Default',
      desc: 'The tile shows the label, the value in a 32px Bold with tabular figures, and a change line. The icon sits on a pop-lime circle by default.',
      ...ex(`
<div style={{ width: 280 }}>
  <StatTile label="Earnings this month" value="$16,416" change="+12% vs September" trend="up" />
</div>`),
    },
    {
      title: 'Trends',
      desc: 'Set trend to up or down to add an arrow and color the change line with feedback-success-text or feedback-error-text. Neutral shows the change in text-muted with no arrow.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
  <div style={{ width: 240 }}>
    <StatTile label="Sales" value="412" change="+24 vs September" trend="up" icon="shopping-bag-01" color="pop-yellow" />
  </div>
  <div style={{ width: 240 }}>
    <StatTile label="Conversion rate" value="3.1%" change="−0.4 pts vs September" trend="down" icon="analytics-01" color="pop-orange" />
  </div>
  <div style={{ width: 240 }}>
    <StatTile label="Average rating" value="4.9" change="Same as September" icon="star" color="pop-violet" />
  </div>
</div>`),
    },
    {
      title: 'Icons and colors',
      desc: 'Pick an icon that names the metric and one pop color for it. Keep that pairing on every dashboard, so people learn where to look.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
  <div style={{ width: 220 }}><StatTile label="Followers" value="9,412" change="+186 this month" trend="up" icon="user" color="pop-pink" /></div>
  <div style={{ width: 220 }}><StatTile label="Listing views" value="48.2k" change="+8% vs September" trend="up" icon="view" color="pop-orange" /></div>
  <div style={{ width: 220 }}><StatTile label="Downloads" value="1,904" change="+5% vs September" trend="up" icon="download-01" color="pop-violet" /></div>
</div>`),
    },
    {
      title: 'When up is bad',
      desc: 'trend always shows up as green and down as red. For metrics where a rise is bad, like refunds, leave trend out and say what happened in words.',
      ...ex(`
<div style={{ width: 280 }}>
  <StatTile label="Refunds" value="7" change="4 more than September" icon="refresh" color="pop-orange" />
</div>`),
    },
    {
      title: 'Seller dashboard',
      desc: 'Lay out three or four tiles in a responsive grid at the top of the dashboard, above the detail they summarise.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 960, maxWidth: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
  <StatTile label="Earnings" value="$16,416" change="+12% vs September" trend="up" />
  <StatTile label="Sales" value="412" change="+24 vs September" trend="up" icon="shopping-bag-01" color="pop-yellow" />
  <StatTile label="Next payout" value="$4,120" change="Sends 1 November" icon="calendar-03" color="pop-violet" />
  <StatTile label="Refunds" value="7" change="4 more than September" icon="refresh" color="pop-orange" />
</div>`),
    },
  ],

  props: {
    StatTile: [
      ['label', 'string', '', 'What the number is. A few words, sentence case.'],
      ['value', 'ReactNode', '', 'The number, already formatted with its unit: "$16,416", "3.1%", "48.2k".'],
      ['change', 'ReactNode', '', 'One line about the change, with what it is compared to: "+12% vs September".'],
      ['trend', "'up' | 'down' | 'neutral'", "'neutral'", 'Up adds an up arrow in feedback-success-text. Down adds a down arrow in feedback-error-text. Neutral is text-muted with no arrow.'],
      ['icon', 'IconName', "'dollar-01'", 'Icon in the sticker. Pick one that names the metric.'],
      ['color', 'PopToken', "'pop-lime'", 'Pop token name for the sticker circle.'],
      ['className', 'string', '', 'Extra classes on the tile.'],
    ],
  },

  usage: {
    when: [
      'For the three or four numbers a seller checks first: earnings, sales, next payout.',
      'At the top of a dashboard or report, above the table or chart with the detail.',
    ],
    whenNot: [
      'For more than four numbers in a row. Use a Table.',
      'For a number that needs a chart to make sense, like daily sales over a month.',
      'For a single figure inside text. Write it in the sentence.',
    ],
    anatomy: {
      render: <div style={{ width: 280 }}><StatTile label="Earnings this month" value="$16,416" change="+12% vs September" trend="up" /></div>,
      parts: [
        'Container: bg-surface, 1px border-subtle, radius-xl, space-lg padding.',
        'Label: body-sm 14/20 Medium in text-secondary.',
        'Sticker: 32px circle (size-avatar-sm) in a pop color, with a 16px icon in icon-on-pop.',
        'Value: Inter Display Bold 32/40, tabular figures, text-primary.',
        'Change: caption 12/16 with a 16px arrow, colored by trend.',
      ],
    },
    sections: [
      {
        title: 'Trend color',
        body: 'Up is always green and down is always red. That is right for earnings and wrong for refunds. When a rise is bad news, leave trend out and let the words carry the meaning.',
        dos: [
          {
            do: <div style={{ width: 240 }}><StatTile label="Refunds" value="7" change="4 more than September" icon="refresh" color="pop-orange" /></div>,
            doText: 'Use a neutral trend and plain words when up is bad.',
            dont: <div style={{ width: 240 }}><StatTile label="Refunds" value="7" change="+4 vs September" trend="up" icon="refresh" color="pop-orange" /></div>,
            dontText: 'Don’t show more refunds in green. It tells the seller that bad news is good.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 240 }}><StatTile label="Earnings" value="$16,416" change="+12% vs September" trend="up" /></div>,
        doText: 'Say what the change is compared to.',
        dont: <div style={{ width: 240 }}><StatTile label="Earnings" value="$16,416" change="12%" trend="up" /></div>,
        dontText: 'Don’t show a bare percentage. People can’t tell what period it covers or which way it went without the color.',
      },
      {
        do: <div style={{ width: 240 }}><StatTile label="Earnings" value="$16,416" change="+12% vs September" trend="up" /></div>,
        doText: 'Format the value with its unit and round it to what matters.',
        dont: <div style={{ width: 240 }}><StatTile label="Earnings" value="16416.0000" change="+12% vs September" trend="up" /></div>,
        dontText: 'Don’t show raw numbers. Without a currency or separators, the value is hard to read and easy to misjudge.',
      },
      {
        do: <div style={{ width: 240 }}><StatTile label="Sales" value="412" change="+24 vs September" trend="up" icon="shopping-bag-01" color="pop-yellow" /></div>,
        doText: 'Keep the label to a few words.',
        dont: <div style={{ width: 240 }}><StatTile label="Total number of completed sales across all listings" value="412" change="+24 vs September" trend="up" icon="shopping-bag-01" color="pop-yellow" /></div>,
        dontText: 'Don’t write a long label. It wraps, pushes the sticker around and buries the number.',
      },
      {
        do: <div style={{ width: 340, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}><StatTile label="Earnings" value="$16.4k" change="+12%" trend="up" /><StatTile label="Sales" value="412" change="+24" trend="up" icon="shopping-bag-01" color="pop-yellow" /></div>,
        doText: 'Show only the few numbers people act on.',
        dont: <div style={{ width: 340, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2xs)' }}><StatTile label="Earnings" value="$16.4k" /><StatTile label="Sales" value="412" icon="shopping-bag-01" color="pop-yellow" /><StatTile label="Views" value="48k" icon="view" color="pop-orange" /><StatTile label="Saves" value="2.1k" icon="favourite" color="pop-pink" /><StatTile label="Refunds" value="7" icon="refresh" color="pop-orange" /><StatTile label="Rating" value="4.9" icon="star" color="pop-violet" /><StatTile label="Followers" value="9k" icon="user" color="pop-pink" /><StatTile label="Downloads" value="1.9k" icon="download-01" color="pop-violet" /></div>,
        dontText: 'Don’t fill a dashboard with tiles. Eight numbers compete, and none of them gets read.',
      },
    ],
    content: [
      'Labels are short nouns: “Earnings”, “Next payout”, “Sales”.',
      'Values carry their unit: “$16,416”, “3.1%”, “48.2k”.',
      'The change line names the comparison: “+12% vs September”, “Sends 1 November”.',
      'Use a real minus sign for drops: “−0.4 pts”.',
    ],
  },

  a11y: {
    notes: [
      'StatTile is static text in a <div>; screen readers read the label, value and change in order.',
      'The trend arrow is decorative (aria-hidden). Put the direction in the change text with + or −, so it doesn’t depend on color or the arrow.',
      'The sticker icon is decorative. The label names the metric.',
      'Change text uses feedback-success-text or feedback-error-text, both 4.5:1 or more on bg-surface.',
    ],
  },

  related: ['table', 'price-tag', 'badge'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Stat tile in React and HTML/CSS, matching the Figma component (up, down and neutral trends).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Primary moved to blue-600, and icons moved to Hugeicons stroke.' },
  ],
};
