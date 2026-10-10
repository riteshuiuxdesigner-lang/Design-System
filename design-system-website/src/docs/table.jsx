export default {
  id: 'table',
  name: 'Table',
  group: 'Data display',
  order: 8,
  status: 'Stable',
  figma: '30:161',
  exports: ['Table'],
  summary: 'Real table markup for comparing values across rows: sales, payouts, orders. Numbers sit right-aligned in tabular figures so they line up digit by digit.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass columns and rows. Each column takes a key, a label and optional align, numeric and render. Each row is a plain object keyed by those column keys.',
      stage: 'flush',
      ...ex(`
<Table
  rowKey="id"
  columns={[
    { key: 'listing', label: 'Listing' },
    { key: 'license', label: 'License' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', numeric: true },
  ]}
  rows={[
    { id: 'S-1042', listing: 'Orbit UI kit', license: 'Standard', date: '9 Oct 2026', amount: '$49.00' },
    { id: 'S-1041', listing: 'Mono icon pack', license: 'Extended', date: '9 Oct 2026', amount: '$95.00' },
    { id: 'S-1040', listing: 'Pitch deck template', license: 'Standard', date: '8 Oct 2026', amount: '$29.00' },
    { id: 'S-1039', listing: 'Dashboard kit', license: 'Team', date: '7 Oct 2026', amount: '$1,240.00' },
  ]}
/>`),
    },
    {
      title: 'Numeric columns',
      desc: 'Set numeric: true on every number column. It right-aligns the header and cells so decimal points line up, and turns on tabular figures so every digit has the same width.',
      stage: 'flush',
      ...ex(`
<Table
  rowKey="period"
  columns={[
    { key: 'period', label: 'Period' },
    { key: 'sales', label: 'Sales', numeric: true },
    { key: 'gross', label: 'Gross', numeric: true },
    { key: 'fees', label: 'Fees', numeric: true },
    { key: 'net', label: 'Net payout', numeric: true },
  ]}
  rows={[
    { period: 'September 2026', sales: '412', gross: '$18,240.00', fees: '−$1,824.00', net: '$16,416.00' },
    { period: 'August 2026', sales: '388', gross: '$16,902.50', fees: '−$1,690.25', net: '$15,212.25' },
    { period: 'July 2026', sales: '51', gross: '$2,111.00', fees: '−$211.10', net: '$1,899.90' },
  ]}
/>`),
    },
    {
      title: 'Custom cells',
      desc: 'Give a column a render function to put components in its cells. Use an Avatar with the buyer’s name, and a Badge for status so it reads as a word, not just a color.',
      stage: 'flush',
      ...ex(`
<Table
  rowKey="id"
  columns={[
    { key: 'buyer', label: 'Buyer', render: (r) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Avatar size="xs" initials={r.initials} color={r.color} />
        {r.buyer}
      </span>
    ) },
    { key: 'listing', label: 'Listing' },
    { key: 'status', label: 'Status', render: (r) => r.status === 'Paid'
      ? <Badge variant="success" icon="checkmark-circle-02">Paid</Badge>
      : r.status === 'Refunded'
        ? <Badge variant="error" icon="alert-circle">Refunded</Badge>
        : <Badge variant="warning" icon="alert-02">Pending</Badge> },
    { key: 'amount', label: 'Amount', numeric: true },
  ]}
  rows={[
    { id: 'S-1042', buyer: 'Jonas Weber', initials: 'JW', color: 'pop-yellow', listing: 'Orbit UI kit', status: 'Paid', amount: '$49.00' },
    { id: 'S-1041', buyer: 'Aiko Tanaka', initials: 'AT', color: 'pop-lime', listing: 'Mono icon pack', status: 'Pending', amount: '$95.00' },
    { id: 'S-1040', buyer: 'Leo Martins', initials: 'LM', color: 'pop-pink', listing: 'Pitch deck template', status: 'Refunded', amount: '$29.00' },
    { id: 'S-1039', buyer: 'Priya Raman', initials: 'PR', color: 'pop-violet', listing: 'Dashboard kit', status: 'Paid', amount: '$1,240.00' },
  ]}
/>`),
    },
    {
      title: 'Caption',
      desc: 'A caption names the table above the header. Screen readers announce it when people reach the table, so keep it even when a heading is nearby.',
      stage: 'flush',
      ...ex(`
<Table
  caption="Payouts, 2026"
  rowKey="id"
  columns={[
    { key: 'id', label: 'Payout' },
    { key: 'sent', label: 'Sent' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Sent' ? 'success' : 'info'} icon={r.status === 'Sent' ? 'checkmark-circle-02' : 'information-circle'}>{r.status}</Badge> },
    { key: 'amount', label: 'Amount', numeric: true },
  ]}
  rows={[
    { id: '#2043', sent: '1 Nov 2026', method: 'Bank ending 4021', status: 'Scheduled', amount: '$16,416.00' },
    { id: '#2042', sent: '1 Oct 2026', method: 'Bank ending 4021', status: 'Sent', amount: '$15,212.25' },
    { id: '#2041', sent: '1 Sep 2026', method: 'PayPal', status: 'Sent', amount: '$1,899.90' },
  ]}
/>`),
    },
    {
      title: 'Row actions',
      desc: 'Put row actions in the last column, aligned right. Use a small Secondary Button for one action, or a ghost Icon button with a clear label.',
      stage: 'flush',
      ...ex(`
<Table
  rowKey="title"
  columns={[
    { key: 'title', label: 'Listing' },
    { key: 'status', label: 'Status', render: (r) => r.live
      ? <Badge variant="success" icon="checkmark-circle-02">Live</Badge>
      : <Badge>Draft</Badge> },
    { key: 'sales', label: 'Sales', numeric: true },
    { key: 'actions', label: 'Actions', align: 'right', render: (r) => (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Button variant="secondary" size="sm">Edit</Button>
        <IconButton size="sm" icon="more-horizontal" label={'More actions for ' + r.title} />
      </span>
    ) },
  ]}
  rows={[
    { title: 'Orbit UI kit', live: true, sales: '1,240' },
    { title: 'Mono icon pack', live: true, sales: '864' },
    { title: 'Brand guidelines', live: false, sales: '0' },
  ]}
/>`),
    },
    {
      title: 'No matching rows',
      desc: 'When rows is empty, the table shows one full-width row with the empty text (“Nothing here yet.” by default). Use it when filters hide every row, and say how to get rows back. For a table that has never had data, show an Empty state instead.',
      stage: 'flush',
      ...ex(`
<Table
  label="Refunds"
  empty="No refunds in September. Pick another month to see more."
  columns={[
    { key: 'listing', label: 'Listing' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', numeric: true },
  ]}
  rows={[]}
/>`),
    },
    {
      title: 'Narrow screens',
      desc: 'Cells never wrap, so a table wider than its container scrolls sideways inside its rounded frame. The frame is focusable, so keyboard users can scroll it with the arrow keys. On phones, drop the columns people don’t need and keep the first column short.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 320 }}>
  <Table
    rowKey="id"
    columns={[
      { key: 'id', label: 'Order' },
      { key: 'listing', label: 'Listing' },
      { key: 'buyer', label: 'Buyer' },
      { key: 'license', label: 'License' },
      { key: 'amount', label: 'Amount', numeric: true },
    ]}
    rows={[
      { id: '#1042', listing: 'Orbit UI kit', buyer: 'Jonas Weber', license: 'Standard', amount: '$49.00' },
      { id: '#1041', listing: 'Mono icon pack', buyer: 'Aiko Tanaka', license: 'Extended', amount: '$95.00' },
    ]}
  />
</div>`),
    },
  ],

  props: {
    Table: [
      ['columns', 'Array<{ key: string, label: ReactNode, align?: \'left\' | \'center\' | \'right\', numeric?: boolean, render?: (row) => ReactNode }>', '', 'Column definitions, in order. numeric right-aligns the column and turns on tabular figures. align sets the alignment and overrides numeric. render replaces the raw value.'],
      ['rows', 'Array<object>', '', 'One object per row, keyed by column key.'],
      ['rowKey', 'string', '', 'The field that uniquely identifies a row, used as the React key. Falls back to the index.'],
      ['caption', 'ReactNode', '', 'A <caption> above the header. Names the table for screen readers.'],
      ['label', 'string', '', 'aria-label for the scroll region. Falls back to caption, then “Table”. Set it when there is no caption.'],
      ['empty', 'ReactNode', "'Nothing here yet.'", 'Text shown in a single full-width row when rows is empty. Say why and how to get rows back.'],
      ['className', 'string', '', 'Extra classes on the scroll wrapper.'],
    ],
  },

  usage: {
    when: [
      'To compare values across many rows: sales, payouts, orders, refunds.',
      'When people need to scan a column, like amounts or status.',
      'For seller dashboards and admin tools on desktop.',
    ],
    whenNot: [
      'For a short list of people or items with one fact each. Use List items.',
      'To browse listings by their preview. Use Asset cards in a grid.',
      'For layout. Tables are for data only.',
    ],
    anatomy: {
      render: <div style={{ width: 400 }}><Table caption="Recent sales" rowKey="l" columns={[{ key: 'l', label: 'Listing' }, { key: 's', label: 'Status', render: (r) => <Badge variant="success" icon="checkmark-circle-02">{r.s}</Badge> }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ l: 'Orbit UI kit', s: 'Paid', a: '$49.00' }, { l: 'Mono icon pack', s: 'Paid', a: '$95.00' }]} /></div>,
      parts: [
        'Frame: bg-surface, 1px border-subtle, radius-xl. A focusable region that scrolls sideways when the table is too wide.',
        'Caption (optional): Inter Display SemiBold 16/24, left-aligned above the header.',
        'Header: caption 12/16 SemiBold in text-muted, one line, with a border-subtle line under it.',
        'Cells: body-sm 14/20 in text-primary on one line, padded with space-sm and space-lg, with border-subtle between rows.',
        'Rows: bg-hover on hover. The last row has no bottom border.',
      ],
    },
    sections: [
      {
        title: 'Numbers',
        body: 'Money and counts are what people scan in a table. Right-align them, use tabular figures, and format every value in a column the same way.',
        dos: [
          {
            do: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Payout' }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ p: '#2043', a: '$16,416.00' }, { p: '#2042', a: '$1,899.90' }, { p: '#2041', a: '$212.50' }]} /></div>,
            doText: 'Set numeric on number columns. They right-align with tabular figures, so the decimal points line up.',
            dont: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Payout' }, { key: 'a', label: 'Amount' }]} rows={[{ p: '#2043', a: '$16,416.00' }, { p: '#2042', a: '$1,899.90' }, { p: '#2041', a: '$212.50' }]} /></div>,
            dontText: 'Don’t left-align amounts. People can’t compare sizes at a glance when the digits don’t line up.',
          },
          {
            do: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Sale' }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ p: 'Orbit UI kit', a: '$49.00' }, { p: 'Dashboard kit', a: '$1,240.00' }, { p: 'Mono icons', a: '$19.50' }]} /></div>,
            doText: 'Use the same currency format in every row: symbol, separators and two decimals.',
            dont: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Sale' }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ p: 'Orbit UI kit', a: '49' }, { p: 'Dashboard kit', a: '$1240' }, { p: 'Mono icons', a: '19.5 USD' }]} /></div>,
            dontText: 'Don’t mix formats. Right alignment can’t help when every row is written differently.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Payout' }, { key: 's', label: 'Status', render: (r) => r.s === 'Sent' ? <Badge variant="success" icon="checkmark-circle-02">Sent</Badge> : <Badge variant="error" icon="alert-circle">Failed</Badge> }]} rows={[{ p: '#2042', s: 'Sent' }, { p: '#2041', s: 'Failed' }]} /></div>,
        doText: 'Show status with a Badge that has a word and an icon.',
        dont: <div style={{ width: 320 }}><Table rowKey="p" columns={[{ key: 'p', label: 'Payout' }, { key: 's', label: 'Status', render: (r) => <Badge variant={r.s === 'Sent' ? 'success' : 'error'} style={{ width: 12, height: 12, padding: 0 }} /> }]} rows={[{ p: '#2042', s: 'Sent' }, { p: '#2041', s: 'Failed' }]} /></div>,
        dontText: 'Don’t use colored dots alone. People who can’t tell red from green can’t see which payout failed.',
      },
      {
        do: <div style={{ width: 340 }}><Table rowKey="l" columns={[{ key: 'l', label: 'Listing' }, { key: 'n', label: 'Sales', numeric: true }, { key: 'a', label: 'Revenue', numeric: true }]} rows={[{ l: 'Orbit UI kit', n: '1,240', a: '$60,760.00' }, { l: 'Mono icons', n: '864', a: '$16,416.00' }]} /></div>,
        doText: 'Show the few columns people need to decide, and link to the details.',
        dont: <div style={{ width: 340 }}><Table rowKey="l" columns={[{ key: 'l', label: 'Listing' }, { key: 'i', label: 'ID' }, { key: 'c', label: 'Category' }, { key: 'v', label: 'Version' }, { key: 'u', label: 'Updated' }, { key: 'n', label: 'Sales', numeric: true }, { key: 'r', label: 'Refunds', numeric: true }, { key: 'a', label: 'Revenue', numeric: true }]} rows={[{ l: 'Orbit UI kit', i: 'L-88', c: 'UI kits', v: '2.4', u: '3 Oct', n: '1,240', r: '12', a: '$60,760.00' }, { l: 'Mono icons', i: 'L-91', c: 'Icons', v: '1.1', u: '28 Sep', n: '864', r: '4', a: '$16,416.00' }]} /></div>,
        dontText: 'Don’t show every field. The amounts end up off-screen and people have to scroll to find them.',
      },
      {
        do: <div style={{ width: 340 }}><EmptyState title="No sales yet" body="Sales show up here as soon as someone buys a listing." /></div>,
        doText: 'Replace the table with an Empty state when there are no rows.',
        dont: <div style={{ width: 340 }}><Table rowKey="l" columns={[{ key: 'l', label: 'Listing' }, { key: 'b', label: 'Buyer' }, { key: 'a', label: 'Amount', numeric: true }]} rows={[]} /></div>,
        dontText: 'Don’t leave an empty table with the generic “Nothing here yet” row. It gives no reason and no next step.',
      },
      {
        do: <div style={{ width: 320 }}><Table rowKey="b" columns={[{ key: 'b', label: 'Buyer', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar size="xs" initials={r.i} color={r.c} />{r.b}</span> }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ b: 'Jonas Weber', i: 'JW', c: 'pop-yellow', a: '$49.00' }, { b: 'Aiko Tanaka', i: 'AT', c: 'pop-lime', a: '$95.00' }]} /></div>,
        doText: 'Use an extra-small Avatar next to the name, so rows keep their height.',
        dont: <div style={{ width: 320 }}><Table rowKey="b" columns={[{ key: 'b', label: 'Buyer', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar size="lg" initials={r.i} color={r.c} />{r.b}</span> }, { key: 'a', label: 'Amount', numeric: true }]} rows={[{ b: 'Jonas Weber', i: 'JW', c: 'pop-yellow', a: '$49.00' }, { b: 'Aiko Tanaka', i: 'AT', c: 'pop-lime', a: '$95.00' }]} /></div>,
        dontText: 'Don’t put large components in cells. Tall rows mean fewer rows on screen and more scrolling.',
      },
    ],
    content: [
      'Header labels are short nouns in sentence case: “Net payout”, not “NET PAYOUT ($)”.',
      'Put the unit in the value, not the header: “$1,240.00”.',
      'Use the same date format in every row, like “9 Oct 2026”.',
      'Show negative amounts with a minus sign: “−$211.10”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the table’s scroll frame, then through interactive elements inside cells, row by row.'], ['Arrow left / right', 'Scrolls a wide table sideways while the frame has focus.']],
    notes: [
      'Table renders a real <table> with <thead>, <tbody> and <th scope="col">, so screen readers announce the column name for every cell.',
      'Use caption to name the table. It is read when people reach it.',
      'Numeric columns use tabular figures. Alignment is visual only; the values read the same.',
      'Status cells need a word, not just a color. Badge gives you both.',
      'Give every Icon button in a row a label that names the row: “More actions for Orbit UI kit”.',
      'The scroll frame is a focusable region (tabIndex 0, role="region") named by label or caption, so keyboard users can reach and scroll a wide table. It shows the focus ring on keyboard focus.',
      'An empty table still announces its columns, then the empty text. Make that text say what to do next.',
    ],
  },

  related: ['list-item', 'badge', 'stat-tile'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'numeric now right-aligns on its own, cells no longer wrap so narrow tables scroll, and the scroll frame is a focusable, labelled region. Added label and empty.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Table in React and HTML/CSS, matching the Figma component (caption, numeric columns and custom cells).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
