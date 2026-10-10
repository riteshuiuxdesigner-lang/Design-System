import { Lead, P, H2, List, Example, CodeBlock, copyText, notify } from '../ui.jsx';

const browseEx = ex(`function Example() {
  const [filter, setFilter] = useState('UI kits');
  const assets = [
    { title: 'Orbit Dashboard UI Kit', creator: 'Mira Okafor', initials: 'MO', price: '$49', badge: 'New', thumbColor: 'pop-violet' },
    { title: 'Swiss Poster Templates', creator: 'Ana Lindqvist', initials: 'AL', avatarColor: 'pop-lime', price: '$29', was: '$49', badge: 'Staff pick', badgeVariant: 'ink', thumbColor: 'pop-pink' },
    { title: 'Wireframe Blocks', creator: 'Leo Park', initials: 'LP', avatarColor: 'pop-orange', price: 'Free', thumbColor: 'pop-lime' },
    { title: 'Pastel 3D Icons', creator: 'Tomás Rivera', initials: 'TR', avatarColor: 'pop-pink', price: '$19', thumbColor: 'pop-yellow' },
  ];
  return (
    <div style={{ background: 'var(--bg-default)' }}>
      <TopNav active="Browse" />
      <div style={{ padding: 'var(--space-2xl) var(--space-xl)', display: 'grid', gap: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ margin: 0, font: 'var(--type-heading-2)', letterSpacing: -0.9, color: 'var(--text-primary)' }}>UI kits by working designers</h1>
          <p style={{ margin: '4px 0 0', font: 'var(--type-body-md)', color: 'var(--text-secondary)' }}>1,284 kits, checked by our editors.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', 'UI kits', 'Icons', 'Templates', '3D'].map((c, i) => (
            <Chip key={c} selected={filter === c} dot={['text-primary', 'pop-yellow', 'pop-pink', 'pop-lime', 'pop-violet'][i]} onClick={() => setFilter(c)}>{c}</Chip>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-xl)' }}>
          {assets.map(a => <AssetCard key={a.title} {...a} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Pagination page={1} pageCount={54} /></div>
      </div>
    </div>
  );
}`);

const productEx = ex(`function Example() {
  const [license, setLicense] = useState('commercial');
  const price = { personal: '$29', commercial: '$49', extended: '$199' }[license];
  return (
    <div style={{ padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2xl)', background: 'var(--bg-default)' }}>
      <Carousel slides={[{ color: 'pop-violet' }, { color: 'pop-yellow' }, { color: 'pop-pink' }, { color: 'pop-lime' }]} />
      <div style={{ display: 'grid', gap: 'var(--space-md)', alignContent: 'start' }}>
        <Breadcrumbs items={[{ label: 'UI kits', href: '#' }, { label: 'Dashboards', href: '#' }, { label: 'Orbit' }]} />
        <h1 style={{ margin: 0, font: 'var(--type-heading-2)', letterSpacing: -0.9, color: 'var(--text-primary)' }}>Orbit Dashboard UI Kit</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar initials="MO" color="pop-violet" size="sm" />
          <span style={{ font: 'var(--type-label-md)', color: 'var(--text-primary)' }}>Mira Okafor</span>
          <Rating value={4.8} count={312} size="sm" />
        </div>
        <LicenseSelector legend="License" value={license} onChange={setLicense} options={[
          { value: 'personal', title: 'Personal', description: 'Your own projects. No client work.', price: '$29' },
          { value: 'commercial', title: 'Commercial', description: 'Client work, up to 10,000 end users.', price: '$49' },
          { value: 'extended', title: 'Extended', description: 'Products you sell, unlimited users.', price: '$199' },
        ]} />
        <Button size="lg" leadingIcon="shopping-bag-01">{'Buy for ' + price}</Button>
      </div>
    </div>
  );
}`);

const dashEx = ex(`function Example() {
  return (
    <div style={{ display: 'flex', minHeight: 560, background: 'var(--bg-default)' }}>
      <SidebarNav
        sections={[
          { label: 'Sell', items: [{ label: 'Overview', icon: 'dashboard-square-01' }, { label: 'Listings', icon: 'store-01', count: 12 }, { label: 'Sales', icon: 'analytics-01' }, { label: 'Payouts', icon: 'credit-card' }] },
          { label: 'Account', items: [{ label: 'Messages', icon: 'message-01', count: 3 }, { label: 'Settings', icon: 'settings-01' }] },
        ]}
        user={{ name: 'Mira Okafor', initials: 'MO', plan: 'Pro creator' }}
      />
      <div style={{ flex: 1, minWidth: 0, padding: 'var(--space-2xl)', display: 'grid', gap: 'var(--space-xl)', alignContent: 'start' }}>
        <h1 style={{ margin: 0, font: 'var(--type-heading-3)', letterSpacing: -0.48, color: 'var(--text-primary)' }}>Overview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
          <StatTile label="Revenue" value="$4,820" change="+12% vs last month" trend="up" icon="dollar-01" color="pop-lime" />
          <StatTile label="Sales" value="186" change="+8%" trend="up" icon="shopping-bag-01" color="pop-yellow" />
          <StatTile label="Refunds" value="2" change="−1 vs last month" trend="down" icon="refresh" color="pop-pink" />
        </div>
        <Table caption="Recent sales" columns={[
          { key: 'asset', label: 'Asset' },
          { key: 'license', label: 'License', render: r => <Badge variant={r.license === 'Extended' ? 'violet' : 'neutral'}>{r.license}</Badge> },
          { key: 'amount', label: 'Amount', align: 'right', numeric: true },
        ]} rows={[
          { asset: 'Orbit Dashboard UI Kit', license: 'Commercial', amount: '$49.00' },
          { asset: 'Pastel 3D Icons', license: 'Personal', amount: '$19.00' },
          { asset: 'Orbit Dashboard UI Kit', license: 'Extended', amount: '$199.00' },
        ]} />
      </div>
    </div>
  );
}`);

function pattern(id, order, title, lead, exObj, notes) {
  return {
    id, title, section: 'Patterns', order,
    render: () => (
      <>
        <h1 className="h1">{title}</h1>
        <Lead>{lead}</Lead>
        <Example ex={exObj} stage="flush" />
        <H2>How it’s built</H2>
        <List items={notes} />
      </>
    ),
  };
}

export default [
  pattern('pattern-browse', 1, 'Browse page', 'The main shopping surface: navigation, filters and a grid of asset cards. Content leads; chrome stays quiet.', browseEx, [
    'Top nav sits on bg-surface with a subtle bottom border. It collapses links at tablet and search at mobile.',
    'Filter chips sit in one row and scroll sideways on phones. The selected chip flips to ink.',
    'The asset grid runs 4 → 3 → 2 columns with a space-xl gap. Cards lift on hover.',
    'Pagination sits centered below the grid. Infinite scroll is fine on mobile.',
  ]),
  pattern('pattern-product', 2, 'Product page', 'Everything a buyer needs to decide: big previews, who made it, the rating and a clear license choice with the price in the button.', productEx, [
    'Preview gallery on the left (Carousel), decision panel on the right; they stack on mobile.',
    'License selector cards show the price, and the Buy button repeats it so there are no surprises.',
    'Use one Primary action. Secondary actions (save, share) are Icon Buttons.',
  ]),
  pattern('pattern-dashboard', 3, 'Seller dashboard', 'Where creators run their shop: sidebar navigation, key numbers first, then detail.', dashEx, [
    'Sidebar nav groups sections, with pink count badges for things that need attention.',
    'Stat tiles lead with the three numbers sellers check daily. Trends use an arrow and a word, not color alone.',
    'Tables right-align amounts with tabular figures.',
  ]),
];
