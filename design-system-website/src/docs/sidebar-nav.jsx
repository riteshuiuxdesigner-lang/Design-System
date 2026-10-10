export default {
  id: 'sidebar-nav',
  name: 'Sidebar nav',
  group: 'Navigation',
  order: 6,
  status: 'Beta',
  figma: '42:133',
  exports: ['SidebarNav'],
  summary: 'The seller dashboard’s navigation: the logo, labelled sections of pages with optional counts, and the signed-in creator at the bottom. Desktop and tablet only.',

  examples: [
    {
      title: 'Default',
      desc: 'Pass sections, each with a label and its items. Every item needs a label and an icon. The first item is selected until you set defaultValue or value. Give the sidebar the full height of the page so the user block sits at the bottom.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'flex', height: 640 }}>
  <SidebarNav
    sections={[
      { label: 'Overview', items: [
        { label: 'Dashboard', icon: 'dashboard-square-01' },
        { label: 'Analytics', icon: 'analytics-01' },
      ] },
      { label: 'Store', items: [
        { label: 'Listings', icon: 'package' },
        { label: 'Orders', icon: 'shopping-bag-01', count: 3 },
        { label: 'Reviews', icon: 'star' },
        { label: 'Messages', icon: 'message-01', count: 2 },
      ] },
      { label: 'Account', items: [
        { label: 'Payouts', icon: 'dollar-01' },
        { label: 'Settings', icon: 'settings-01' },
      ] },
    ]}
    user={{ name: 'Mira Okafor', initials: 'MO', plan: 'Pro creator' }}
  />
</div>`),
    },
    {
      title: 'Counts',
      desc: 'A count shows as a pink sticker after the label. Use it only for things waiting on the seller: new orders, unread messages, reviews to answer. A count of 0 hides the sticker.',
      stage: 'muted',
      ...ex(`
<SidebarNav
  defaultValue="Orders"
  sections={[
    { label: 'Store', items: [
      { label: 'Listings', icon: 'package' },
      { label: 'Orders', icon: 'shopping-bag-01', count: 3 },
      { label: 'Reviews', icon: 'star', count: 0 },
      { label: 'Messages', icon: 'message-01', count: 12 },
    ] },
  ]}
/>`),
    },
    {
      title: 'Brand and user are optional',
      desc: 'Set brand to change the wordmark. Leave user out on pages where the account lives somewhere else, such as an admin view.',
      stage: 'muted',
      ...ex(`
<SidebarNav
  brand="Pixel Market"
  label="Creator tools"
  sections={[
    { label: 'Create', items: [
      { label: 'New listing', icon: 'add-01' },
      { label: 'Drafts', icon: 'edit-02' },
      { label: 'Collections', icon: 'folder-01' },
    ] },
  ]}
/>`),
    },
    {
      title: 'Seller dashboard',
      desc: 'A realistic dashboard. Keep the page in state with value and onChange, and render the matching view next to the sidebar.',
      stage: 'flush',
      ...ex(`function Example() {
  const [page, setPage] = useState('Dashboard');
  return (
    <div style={{ display: 'flex', height: 640, background: 'var(--bg-default)' }}>
      <SidebarNav
        value={page}
        onChange={setPage}
        sections={[
          { label: 'Overview', items: [
            { label: 'Dashboard', icon: 'dashboard-square-01' },
            { label: 'Analytics', icon: 'analytics-01' },
          ] },
          { label: 'Store', items: [
            { label: 'Listings', icon: 'package' },
            { label: 'Orders', icon: 'shopping-bag-01', count: 3 },
            { label: 'Messages', icon: 'message-01', count: 2 },
          ] },
          { label: 'Account', items: [
            { label: 'Payouts', icon: 'dollar-01' },
            { label: 'Settings', icon: 'settings-01' },
          ] },
        ]}
        user={{ name: 'Mira Okafor', initials: 'MO', plan: 'Pro creator' }}
      />
      <main style={{ flex: 1, minWidth: 0, display: 'grid', alignContent: 'start', gap: 'var(--space-lg)', padding: 'var(--space-2xl)' }}>
        <h1 style={{ margin: 0, font: '700 28px/36px var(--font-display)', letterSpacing: '-0.56px', color: 'var(--text-primary)' }}>{page}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <StatTile label="Earnings" value="$1,240.00" change="+12% from last month" trend="up" />
          <StatTile label="Sales" value="86" change="+9 this week" trend="up" icon="shopping-bag-01" color="pop-yellow" />
          <StatTile label="Next payout" value="$860.00" change="Sent on Oct 15" icon="credit-card" color="pop-violet" />
        </div>
      </main>
    </div>
  );
}`),
    },
  ],

  props: {
    SidebarNav: [
      ['sections', '{ label: string; items: { label: string; icon: IconName; count?: number; href?: string }[] }[]', '[]', 'Groups of pages. Item labels must be unique across all sections; they are also the values. With href, an item is a real link; without it, it stays a client-side link handled by onChange.'],
      ['value', 'string', '', 'The current item’s label for controlled use. Pair it with onChange.'],
      ['defaultValue', 'string', 'first item', 'The item selected first when SidebarNav keeps its own state.'],
      ['onChange', '(label: string) => void', '', 'Called with the label of the item someone picks. For items without href, the default navigation is prevented, so route here.'],
      ['brand', 'string', "'Marketplace'", 'Wordmark for the Logo at the top.'],
      ['user', '{ name: string; initials: string; plan: string; color?: PopColor }', '', 'The signed-in creator, shown at the bottom. color is a pop token name such as “pop-violet”.'],
      ['label', 'string', "'Seller'", 'aria-label for the nav landmark.'],
      ['className', 'string', '', 'Extra class on the nav.'],
    ],
  },

  usage: {
    when: [
      'As the main navigation of the seller dashboard on desktop and tablet.',
      'When there are more than 5 destinations that fall into a few groups.',
      'To show what needs the seller’s attention, with counts.',
    ],
    whenNot: [
      'On buyer-facing pages. Use TopNav.',
      'On phones. Use BottomNav for the main destinations and put the rest in a menu Drawer.',
      'To switch views inside one page, such as a listing’s files and reviews. Use Tabs.',
    ],
    anatomy: {
      render: <div style={{ display: 'flex', height: 420 }}><SidebarNav defaultValue="Orders" sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01', count: 3 }, { label: 'Reviews', icon: 'star' }] }]} user={{ name: 'Mira Okafor', initials: 'MO', plan: 'Pro creator' }} /></div>,
      parts: [
        'Container: 240px wide (size-sidebar), bg-surface, 1px border-subtle on the right, padded space-lg by space-md.',
        'Brand: Logo at the top.',
        'Section label: 12/16 SemiBold in text-muted.',
        'Item: 44px pill (size-control-md) with a 20px icon and a 14/20 SemiBold label in text-secondary. Hover fills bg-hover.',
        'Current item: bg-selected with text-selected and aria-current="page".',
        'Count (optional): a pink Badge with text-on-pop.',
        'User: Avatar, name and plan, pinned to the bottom above a border-subtle line.',
      ],
    },
    sections: [
      {
        title: 'Counts mean “needs you”',
        body: 'A pink count pulls the eye. Save it for things the seller has to act on. Totals like “24 listings” belong on the page itself, where they have context.',
        dos: [
          {
            do: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01', count: 3 }, { label: 'Reviews', icon: 'star' }, { label: 'Messages', icon: 'message-01', count: 2 }] }]} />,
            doText: 'Show counts only for new orders and unread messages.',
            dont: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'package', count: 24 }, { label: 'Orders', icon: 'shopping-bag-01', count: 3 }, { label: 'Reviews', icon: 'star', count: 128 }, { label: 'Messages', icon: 'message-01', count: 2 }] }]} />,
            dontText: 'Don’t put a count on every item. When everything shouts, the 3 new orders get lost.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <SidebarNav sections={[{ label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard-square-01' }, { label: 'Analytics', icon: 'analytics-01' }] }, { label: 'Store', items: [{ label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01' }] }, { label: 'Account', items: [{ label: 'Payouts', icon: 'dollar-01' }, { label: 'Settings', icon: 'settings-01' }] }]} />,
        doText: 'Group pages into a few labelled sections.',
        dont: <SidebarNav sections={[{ label: 'Menu', items: [{ label: 'Dashboard', icon: 'dashboard-square-01' }, { label: 'Analytics', icon: 'analytics-01' }, { label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01' }, { label: 'Payouts', icon: 'dollar-01' }, { label: 'Settings', icon: 'settings-01' }] }]} />,
        dontText: 'Don’t pile every page into one list called “Menu”. People have to read it all to find Payouts.',
      },
      {
        do: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01' }, { label: 'Payouts', icon: 'dollar-01' }] }]} />,
        doText: 'Use one or two words per item.',
        dont: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Manage your published listings', icon: 'package' }, { label: 'Orders from your buyers', icon: 'shopping-bag-01' }, { label: 'Get paid for your sales', icon: 'dollar-01' }] }]} />,
        dontText: 'Don’t write sentences. They wrap inside the 240px column and the rows lose their rhythm.',
      },
      {
        do: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'package' }, { label: 'Orders', icon: 'shopping-bag-01' }, { label: 'Reviews', icon: 'star' }, { label: 'Payouts', icon: 'dollar-01' }] }]} />,
        doText: 'Give each page its own clear icon.',
        dont: <SidebarNav sections={[{ label: 'Store', items: [{ label: 'Listings', icon: 'folder-01' }, { label: 'Orders', icon: 'folder-01' }, { label: 'Reviews', icon: 'folder-01' }, { label: 'Payouts', icon: 'folder-01' }] }]} />,
        dontText: 'Don’t repeat one icon. It adds noise and nothing to scan by.',
      },
    ],
    content: [
      'Name pages with plain nouns: “Listings”, “Orders”, “Payouts”.',
      'Keep section labels short and in sentence case: “Store”, “Account”.',
      'Put the pages sellers visit most at the top, and Settings last.',
      'Show the plan under the creator’s name, such as “Pro creator”.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves through the items in order.'],
      ['Enter', 'Opens the focused page.'],
    ],
    notes: [
      'Renders <nav> named by label (default “Seller”). The current item has aria-current="page".',
      'Items are links, so they appear in screen reader link lists. Pass href so people can open a page in a new tab. Counts are read after the label, like “Orders 3”.',
      'Icons are hidden from screen readers. The text label is the accessible name.',
      'Items are 44px tall. The current item is shown by its fill, not by color alone.',
    ],
  },

  related: ['top-nav', 'bottom-nav', 'badge', 'avatar'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Items accept href and render as real links.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'SidebarNav in React and HTML/CSS, matching the Figma component (sections, counts, user).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Item icons moved to Hugeicons stroke.' },
  ],
};
