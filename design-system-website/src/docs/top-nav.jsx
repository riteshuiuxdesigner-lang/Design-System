export default {
  id: 'top-nav',
  name: 'Top nav',
  group: 'Navigation',
  order: 4,
  status: 'Beta',
  figma: '38:360',
  exports: ['TopNav', 'Logo'],
  summary: 'The marketplace header: logo, the main sections, search and account actions. It changes for signed-in and signed-out visitors and collapses on smaller screens.',

  examples: [
    {
      title: 'Signed in',
      desc: 'The default shows the logo, three section links, search, a Sell button, notifications, the cart and the account avatar. Pass the person’s initials for the avatar.',
      stage: 'flush',
      ...ex(`
<TopNav initials="MO" />`),
    },
    {
      title: 'Signed out',
      desc: 'Set loggedOut for visitors. The account actions become Log in (Ghost) and Sign up (Primary), so there is one clear next step.',
      stage: 'flush',
      ...ex(`
<TopNav loggedOut />`),
    },
    {
      title: 'Sections and the current page',
      desc: 'Pass your own links and mark the current one with active. onNavigate gets the link text, so you can hand it to your router. The current link gets aria-current="page" and the selected fill.',
      stage: 'flush',
      ...ex(`function Example() {
  const [section, setSection] = useState('Creators');
  return (
    <div>
      <TopNav
        links={['Browse', 'Creators', 'Collections', 'Pricing']}
        active={section}
        onNavigate={setSection}
        initials="MO"
      />
      <div style={{ padding: 'var(--space-xl) var(--space-lg)', font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>
        {section}
      </div>
    </div>
  );
}`),
    },
    {
      title: 'Responsive menu',
      desc: 'Below 1024px the section links and Sell move behind a menu button. Below 640px search hides too. Open your own menu from onMenu, usually a Drawer that slides in from the left. Narrow the browser window to see the menu button.',
      stage: 'flush',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <TopNav initials="MO" onMenu={() => setOpen(true)} />
      <Drawer side="left" open={open} title="Menu" onClose={() => setOpen(false)}>
        <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
          <ListItem href="/browse" leading={<Icon name="search-01" />} title="Browse" chevron />
          <ListItem href="/creators" leading={<Icon name="user" />} title="Creators" chevron />
          <ListItem href="/collections" leading={<Icon name="folder-01" />} title="Collections" chevron />
          <ListItem href="/sell" leading={<Icon name="upload-01" />} title="Sell" chevron />
        </div>
      </Drawer>
    </div>
  );
}`),
    },
    {
      title: 'Logo',
      desc: 'Logo is the placeholder brand mark: a blue disc with a yellow pop dot and the wordmark. TopNav passes brand to it. Use it on its own in footers, sign-in pages and the seller sidebar.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'center', flexWrap: 'wrap' }}>
  <Logo />
  <Logo name="Pixel Market" />
</div>`),
    },
    {
      title: 'On a browse page',
      desc: 'A realistic page. TopNav sits at the top edge, full width, with the page content on bg-default below it.',
      stage: 'flush',
      ...ex(`
<div style={{ background: 'var(--bg-default)' }}>
  <TopNav initials="MO" />
  <div style={{ display: 'grid', gap: 'var(--space-lg)', padding: 'var(--space-xl) var(--space-lg)' }}>
    <Breadcrumbs homeHref="/" items={[{ label: 'Browse', href: '/browse' }, { label: 'UI kits' }]} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
      <AssetCard title="Neon dashboard UI kit" creator="Mira Okafor" initials="MO" price="$49" thumbColor="pop-violet" badge="New" />
      <AssetCard title="Fintech mobile kit" creator="Jun Park" initials="JP" price="$39" thumbColor="pop-lime" avatarColor="pop-pink" />
      <AssetCard title="Wireframe starter" creator="Sam Reyes" initials="SR" price="Free" thumbColor="pop-yellow" avatarColor="pop-orange" />
    </div>
  </div>
</div>`),
    },
  ],

  props: {
    TopNav: [
      ['links', 'string[]', "['Browse', 'Creators', 'Collections']", 'The main sections, in order. Keep it to 3–4.'],
      ['active', 'string', 'links[0]', 'The link for the current page. It gets aria-current="page" and the selected fill.'],
      ['onNavigate', '(link: string) => void', '', 'Called with the link text when someone picks a section. The default navigation is prevented, so route here.'],
      ['onMenu', '() => void', '', 'Called by the menu button, which shows below 1024px. Open a left Drawer with the links.'],
      ['brand', 'string', "'Marketplace'", 'Wordmark passed to Logo.'],
      ['initials', 'string', "'MO'", 'Initials on the account avatar when signed in.'],
      ['loggedOut', 'boolean', 'false', 'Swaps Sell, notifications, cart and avatar for Log in and Sign up.'],
      ['className', 'string', '', 'Extra class on the header.'],
    ],
    Logo: [
      ['name', 'string', "'Marketplace'", 'The wordmark next to the mark.'],
      ['className', 'string', '', 'Extra class on the logo.'],
    ],
  },

  usage: {
    when: [
      'At the top of every buyer-facing page: home, browse, listing, creator profile, cart.',
      'To reach the main sections, search and the account from anywhere.',
    ],
    whenNot: [
      'Inside the seller dashboard. Use SidebarNav, which fits more sections and counts.',
      'As the only navigation on phones. Pair it with BottomNav for the main destinations.',
      'In focused flows like checkout or publishing a listing. Show only the Logo and a way out.',
    ],
    anatomy: {
      render: (
        <div style={{ display: 'grid', gap: 'var(--space-sm)', width: 320 }}>
          <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040 }}><TopNav /></div></div>
          <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}><div style={{ width: 1040, flex: 'none' }}><TopNav /></div></div>
        </div>
      ),
      parts: [
        'Container: 64px tall (size-nav-height), bg-surface with a 1px border-subtle bottom edge, padded with space-lg.',
        'Logo: blue disc (action-primary-default) with a pop-yellow dot, and the wordmark in 18/24 Bold.',
        'Section links: 36px pills, 14/20 SemiBold in text-secondary. The current one takes bg-selected.',
        'Search: SearchField with a ⌘K hint, up to 400px wide.',
        'Actions: Sell (Secondary, small), Notifications and Cart (Icon Buttons) and the account Avatar. Signed out: Log in and Sign up.',
        'Menu button (below 1024px only): menu-01 Icon Button at the start.',
      ],
    },
    sections: [
      {
        title: 'Signed in and signed out',
        body: 'Visitors see Log in and Sign up, with Sign up as the one Primary. Signed-in people see Sell, notifications, cart and their avatar. Never show account actions to someone who has no account yet.',
        dos: [
          {
            do: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}><div style={{ width: 1040, flex: 'none' }}><TopNav loggedOut /></div></div>,
            doText: 'Show Log in and Sign up to visitors.',
            dont: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}><div style={{ width: 1040, flex: 'none' }}><TopNav initials="?" /></div></div>,
            dontText: 'Don’t show notifications, cart and an empty avatar to a visitor. There is nothing behind them yet.',
          },
        ],
      },
      {
        title: 'Responsive behavior',
        body: 'Desktop (1024px and up) shows everything. Tablet (640–1023px) moves the section links and Sell behind the menu button. Mobile (under 640px) also hides search, leaving the menu, logo and account actions. On mobile, add BottomNav for the main destinations and open search from it.',
      },
    ],
    dos: [
      {
        do: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040, marginLeft: 'calc(-1 * (var(--size-120) + var(--space-3xl)))' }}><TopNav links={['Browse', 'Creators', 'Collections']} /></div></div>,
        doText: 'Keep 3–4 section links with one-word names.',
        dont: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040, marginLeft: 'calc(-1 * (var(--size-120) + var(--space-3xl)))' }}><TopNav links={['Browse', 'UI kits', 'Icons', 'Templates', 'Fonts', 'Creators', 'Blog', 'Help']} /></div></div>,
        dontText: 'Don’t list every category. Eight links squeeze out search and nothing stands out. Put categories on the Browse page.',
      },
      {
        do: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040 }}><TopNav brand="Marketplace" /></div></div>,
        doText: 'Use the short wordmark.',
        dont: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040 }}><TopNav brand="Marketplace for designers and creators" /></div></div>,
        dontText: 'Don’t put a tagline in the logo. It pushes the links and search off the screen.',
      },
      {
        do: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040 }}><TopNav active="Creators" /></div></div>,
        doText: 'Mark the section the page belongs to with active.',
        dont: <div style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: 'var(--border-width-default) solid var(--border-subtle)' }}><div style={{ width: 1040 }}><TopNav active="Creator profile" /></div></div>,
        dontText: 'Don’t pass a value that matches no link. Nothing is marked and people lose their place.',
      },
    ],
    content: [
      'Name sections with one plain noun: “Browse”, “Creators”, “Collections”.',
      'Keep the search placeholder specific: “Search 48,000 assets”.',
      'Use “Log in” and “Sign up”, the same words as the sign-in pages.',
      'Keep Sell as the only labelled action. Everything else is an Icon Button with a label.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves through the menu button (when shown), section links, search and the account actions in order.'],
      ['Enter', 'Follows the focused link or presses the focused button.'],
    ],
    notes: [
      'Renders a <header>, which is the banner landmark at the top of the page, with <nav aria-label="Primary"> for the links.',
      'The current link has aria-current="page". Search is a role="search" form labelled “Search”.',
      'Icon Buttons have labels: “Open menu”, “Notifications” and “Cart”. The avatar is announced as “Your account”.',
      'The ⌘K hint is visual. Bind the shortcut to your Command palette yourself.',
      'Add a “Skip to content” link before TopNav so keyboard users can jump past it.',
    ],
  },

  related: ['bottom-nav', 'sidebar-nav', 'search-field', 'breadcrumbs'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Section links no longer wrap onto two lines, and Logo accepts className.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'TopNav and Logo in React and HTML/CSS, matching the Figma component (signed in, signed out, tablet and mobile collapse).' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Header icons moved to Hugeicons stroke, and the logo mark took the blue-600 primary.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Section links became pills, and the header moved to pure-grey neutrals.' },
  ],
};
