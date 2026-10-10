export default {
  id: 'bottom-nav',
  name: 'Bottom nav',
  group: 'Navigation',
  order: 5,
  status: 'Beta',
  figma: '39:29',
  exports: ['BottomNav'],
  summary: 'The main navigation on phones: 3–5 destinations with an icon and a label, pinned to the bottom of the screen. The current one sits on a yellow pill. Mobile only.',

  examples: [
    {
      title: 'Default',
      desc: 'Out of the box, BottomNav shows Home, Browse, Sell, Saved and Profile. Place it at the bottom of a phone layout (under 640px). The current item gets a pop-yellow pill that springs in.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 375, height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-default)' }}>
  <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 'var(--space-sm)', padding: 'var(--space-lg) var(--space-md)' }}>
    <Skeleton shape="media" />
    <Skeleton width="70%" />
    <Skeleton width="40%" />
  </div>
  <BottomNav />
</div>`),
    },
    {
      title: 'Controlled',
      desc: 'Pass value and onChange to drive the screen from your router. onChange gets the item label.',
      stage: 'muted',
      ...ex(`function Example() {
  const [tab, setTab] = useState('Browse');
  return (
    <div style={{ width: 375, height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-default)' }}>
      <div style={{ flex: 1, padding: 'var(--space-lg) var(--space-md)' }}>
        <h2 style={{ margin: 0, font: '700 28px/36px var(--font-display)', letterSpacing: '-0.56px', color: 'var(--text-primary)' }}>{tab}</h2>
      </div>
      <BottomNav value={tab} onChange={setTab} />
    </div>
  );
}`),
    },
    {
      title: 'Custom items',
      desc: 'Set items to your own destinations. Each item needs a label and an icon name. This set is for a creator’s seller app.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 375, height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-default)' }}>
  <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 'var(--space-sm)', padding: 'var(--space-lg) var(--space-md)' }}>
    <StatTile label="Earnings this month" value="$1,240.00" change="+12% from last month" trend="up" />
  </div>
  <BottomNav
    defaultValue="Earnings"
    items={[
      { label: 'Dashboard', icon: 'dashboard-square-01' },
      { label: 'Listings', icon: 'package' },
      { label: 'Upload', icon: 'cloud-upload' },
      { label: 'Earnings', icon: 'dollar-01' },
      { label: 'Profile', icon: 'user' },
    ]}
  />
</div>`),
    },
    {
      title: 'Three items',
      desc: 'Three is the minimum. With fewer destinations, put them in the header instead.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 375, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}>
  <BottomNav
    items={[
      { label: 'Home', icon: 'home-01' },
      { label: 'Browse', icon: 'search-01' },
      { label: 'Profile', icon: 'user' },
    ]}
  />
</div>`),
    },
    {
      title: 'Mobile home screen',
      desc: 'A realistic phone screen. A compact header carries the logo and the cart, the content scrolls, and BottomNav stays fixed at the bottom.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 375, height: 640, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-surface)' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-sm) var(--space-md)' }}>
    <Logo />
    <div style={{ display: 'flex', gap: 'var(--space-2xs)' }}>
      <IconButton icon="notification-01" label="Notifications" />
      <IconButton icon="shopping-bag-01" label="Cart" />
    </div>
  </div>
  <div style={{ flex: 1, overflowY: 'auto', display: 'grid', alignContent: 'start', gap: 'var(--space-md)', padding: 'var(--space-xs) var(--space-md) var(--space-md)' }}>
    <SearchField placeholder="Search 48,000 assets" shortcut={false} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
      <AssetCard title="Neon dashboard UI kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" />
      <AssetCard title="Pastel icon pack" creator="Jun Park" initials="JP" price="$19" thumbColor="pop-lime" avatarColor="pop-pink" />
      <AssetCard title="Portfolio template" creator="Sam Reyes" initials="SR" price="Free" thumbColor="pop-yellow" avatarColor="pop-orange" />
      <AssetCard title="3D shapes pack" creator="Ada Brooks" initials="AB" price="$29" thumbColor="pop-orange" avatarColor="pop-violet" />
    </div>
  </div>
  <BottomNav />
</div>`),
    },
  ],

  props: {
    BottomNav: [
      ['items', '{ label: string; icon: IconName }[]', 'Home, Browse, Sell, Saved, Profile', 'The destinations, in order. Labels must be unique; they are also the values.'],
      ['value', 'string', '', 'The current item’s label for controlled use. Pair it with onChange.'],
      ['defaultValue', 'string', 'items[0].label', 'The item selected first when BottomNav keeps its own state.'],
      ['onChange', '(label: string) => void', '', 'Called with the label of the item someone taps.'],
      ['className', 'string', '', 'Extra class on the nav.'],
    ],
  },

  usage: {
    when: [
      'As the main navigation of the marketplace on phones (under 640px).',
      'For 3–5 top-level destinations people switch between often: Home, Browse, Sell, Saved, Profile.',
    ],
    whenNot: [
      'On tablet or desktop. Use TopNav, or SidebarNav in the seller dashboard.',
      'For actions such as Buy, Share or Download. Put those in Buttons on the page.',
      'To switch views inside one screen. Use Tabs.',
      'Inside focused flows like checkout or publishing a listing. Hide it so people finish the task.',
    ],
    anatomy: {
      render: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav defaultValue="Browse" /></div>,
      parts: [
        'Container: bg-surface with a 1px border-subtle top edge. Padded space-xs, with space-md at the bottom for the home indicator.',
        'Item: fills an equal share of the width, at least 44px tall (size-touch-target).',
        'Icon: 24px (size-icon-lg) in icon-secondary, inside a 56 × 32px pill.',
        'Label: 11/14 SemiBold in text-muted. Always visible.',
        'Current item: the pill fills pop-yellow with icon-on-pop and springs to 1.05. The label turns text-primary.',
      ],
    },
    sections: [
      {
        title: 'Labels are not optional',
        body: 'Icons alone are guesses. A bookmark could mean Saved, Collections or Wishlist. BottomNav always shows the label under the icon. Don’t build a bar of bare icons instead.',
        dos: [
          {
            do: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav /></div>,
            doText: 'Show five destinations, each with an icon and a short label.',
            dont: <div style={{ width: 320, display: 'flex', justifyContent: 'space-around', padding: 'var(--space-xs)', overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)', background: 'var(--bg-surface)' }}><IconButton icon="home-01" label="Home" selected /><IconButton icon="search-01" label="Browse" /><IconButton icon="add-01" label="Sell" /><IconButton icon="bookmark-01" label="Saved" /><IconButton icon="user" label="Profile" /></div>,
            dontText: 'Don’t use a row of icons without labels. People have to guess what the plus and the bookmark do.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Home', icon: 'home-01' }, { label: 'Browse', icon: 'search-01' }, { label: 'Saved', icon: 'bookmark-01' }, { label: 'Profile', icon: 'user' }]} /></div>,
        doText: 'Keep it to 3–5 destinations.',
        dont: <div style={{ width: 320, overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Home', icon: 'home-01' }, { label: 'Browse', icon: 'search-01' }, { label: 'Sell', icon: 'add-01' }, { label: 'Saved', icon: 'bookmark-01' }, { label: 'Cart', icon: 'shopping-bag-01' }, { label: 'Inbox', icon: 'mail-01' }, { label: 'Profile', icon: 'user' }]} /></div>,
        dontText: 'Don’t squeeze in seven items. The pills collide, the bar scrolls and the targets get too small.',
      },
      {
        do: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Home', icon: 'home-01' }, { label: 'Browse', icon: 'search-01' }, { label: 'Saved', icon: 'bookmark-01' }, { label: 'Profile', icon: 'user' }]} /></div>,
        doText: 'Use it for places people go.',
        dont: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Buy', icon: 'shopping-cart-01' }, { label: 'Share', icon: 'share-08' }, { label: 'Download', icon: 'download-01' }, { label: 'Delete', icon: 'delete-02' }]} /></div>,
        dontText: 'Don’t put actions in it. Tapping Delete in a navigation bar is a nasty surprise.',
      },
      {
        do: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Home', icon: 'home-01' }, { label: 'Browse', icon: 'search-01' }, { label: 'Saved', icon: 'bookmark-01' }, { label: 'Profile', icon: 'user' }]} /></div>,
        doText: 'Use one short word per label.',
        dont: <div style={{ width: 320, overflow: 'hidden', borderRadius: 'var(--radius-xl)', border: 'var(--border-width-default) solid var(--border-default)' }}><BottomNav items={[{ label: 'Home feed', icon: 'home-01' }, { label: 'Browse all assets', icon: 'search-01' }, { label: 'My saved collections', icon: 'bookmark-01' }, { label: 'Account settings', icon: 'user' }]} /></div>,
        dontText: 'Don’t write long labels. They wrap onto two lines and the bar grows uneven.',
      },
    ],
    content: [
      'Use one-word nouns: “Home”, “Browse”, “Saved”, “Profile”.',
      'Keep the same items in the same order on every screen.',
      'Use the same names as the matching TopNav sections, so people recognise them across sizes.',
      'Choose icons from the curated set and keep them in the default stroke style.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves through the items in order.'],
      ['Enter / Space', 'Selects the focused item.'],
    ],
    notes: [
      'Renders <nav aria-label="Primary">. The current item has aria-current="page".',
      'Items are buttons, so route in onChange. They can’t be opened in a new tab.',
      'Every item shows a visible label, which is also its accessible name. Icons are hidden from screen readers.',
      'Each item is at least 44px tall. The current item is shown by the pill shape and the label weight, not color alone.',
      'Under prefers-reduced-motion, the pill appears without the spring.',
      'Leave room for the device’s home indicator below the bar, for example with env(safe-area-inset-bottom).',
    ],
  },

  related: ['top-nav', 'sidebar-nav', 'tabs'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'BottomNav in React and HTML/CSS, matching the Figma component (5 items, pop-yellow current pill).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Icons moved to Hugeicons stroke at 24px.' },
  ],
};
