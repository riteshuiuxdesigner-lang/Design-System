export default {
  id: 'breadcrumbs',
  name: 'Breadcrumbs',
  group: 'Navigation',
  order: 3,
  status: 'Stable',
  figma: '36:1781',
  exports: ['Breadcrumbs'],
  summary: 'Shows where a page sits in the marketplace and links back up each level, from Home to the current page. The current page is plain text, never a link.',

  examples: [
    {
      title: 'Default',
      desc: 'Breadcrumbs always starts with a Home icon. Pass the levels below it in items. The last item is the current page, so it renders as bold text with aria-current="page".',
      ...ex(`
<Breadcrumbs
  homeHref="/"
  items={[
    { label: 'UI kits', href: '/ui-kits' },
    { label: 'Dashboards', href: '/ui-kits/dashboards' },
    { label: 'Neon dashboard UI kit' },
  ]}
/>`),
    },
    {
      title: 'One level deep',
      desc: 'On a category page, the trail is short: Home and the page you are on.',
      ...ex(`
<Breadcrumbs homeHref="/" items={[{ label: 'Icon packs' }]} />`),
    },
    {
      title: 'Seller dashboard',
      desc: 'Inside the seller dashboard, point homeHref at the dashboard so the trail starts where sellers work.',
      ...ex(`
<Breadcrumbs
  homeHref="/dashboard"
  items={[
    { label: 'Listings', href: '/dashboard/listings' },
    { label: 'Pastel icon pack', href: '/dashboard/listings/pastel-icons' },
    { label: 'Edit pricing' },
  ]}
/>`),
    },
    {
      title: 'Wrapping on small screens',
      desc: 'The trail wraps onto a second line when it runs out of room. Keep labels short so it rarely has to.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 280, padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
  <Breadcrumbs
    homeHref="/"
    items={[
      { label: 'Templates', href: '/templates' },
      { label: 'Portfolios', href: '/templates/portfolios' },
      { label: 'Studio portfolio' },
    ]}
  />
</div>`),
    },
    {
      title: 'Above a page title',
      desc: 'A realistic product page header. Breadcrumbs sit above the title with space-sm between them, so they read as context, not as the heading.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'grid', gap: 'var(--space-sm)', width: 440 }}>
  <Breadcrumbs
    homeHref="/"
    items={[
      { label: 'UI kits', href: '/ui-kits' },
      { label: 'Dashboards', href: '/ui-kits/dashboards' },
      { label: 'Neon dashboard UI kit' },
    ]}
  />
  <h1 style={{ margin: 0, font: '700 32px/40px var(--font-display)', letterSpacing: '-0.64px', color: 'var(--text-primary)' }}>Neon dashboard UI kit</h1>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
    <Avatar size="sm" initials="MO" color="pop-violet" />
    <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Mira Okafor</span>
    <Rating size="sm" value={4.8} count={128} />
  </div>
</div>`),
    },
  ],

  props: {
    Breadcrumbs: [
      ['items', '{ label: ReactNode; href?: string }[]', '[]', 'The levels below Home, from the top down. The last item is the current page and ignores href.'],
      ['homeHref', 'string', "'#'", 'Where the Home icon links. Its accessible name is “Home”.'],
      ['className', 'string', '', 'Extra class on the nav.'],
    ],
  },

  usage: {
    when: [
      'On pages two or more levels deep: a listing inside a category, an order inside order history.',
      'When people land from search or a shared link and need a way up to the category.',
    ],
    whenNot: [
      'On top-level pages like Home or Browse. There is nothing above them.',
      'To show the pages someone visited. Breadcrumbs show structure, not history. Use the browser’s back button.',
      'Inside a step-by-step flow like checkout or publishing. Use a Stepper.',
    ],
    anatomy: {
      render: <Breadcrumbs homeHref="/" items={[{ label: 'UI kits', href: '/ui-kits' }, { label: 'Dashboards', href: '/ui-kits/dashboards' }, { label: 'Neon dashboard UI kit' }]} />,
      parts: [
        'Home: home-01 icon (16px) in a link labelled “Home”.',
        'Separator: arrow-right-01 (16px) in icon-muted. Hidden from the reading order by the list structure.',
        'Ancestor link: 14/20 Medium in text-secondary. Hover turns it text-primary and underlined.',
        'Current page: 14/20 SemiBold in text-primary with aria-current="page". Not a link.',
        'Focus ring: shadow-focus-ring around each link on keyboard focus.',
      ],
    },
    sections: [
      {
        title: 'The current page is not a link',
        body: 'People are already on the last page in the trail, so linking it only reloads the page. Breadcrumbs does this for you: the last item is always bold text. Don’t rebuild the trail by hand with Links.',
        dos: [
          {
            do: <Breadcrumbs homeHref="/" items={[{ label: 'UI kits', href: '/ui-kits' }, { label: 'Neon dashboard UI kit' }]} />,
            doText: 'Let the last item render as bold plain text with aria-current="page".',
            dont: <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)', font: '500 14px/20px var(--font-display)' }}><Link subtle href="/">Home</Link><Icon name="arrow-right-01" size={16} color="var(--icon-muted)" /><Link subtle href="/ui-kits">UI kits</Link><Icon name="arrow-right-01" size={16} color="var(--icon-muted)" /><Link href="/ui-kits/neon">Neon dashboard UI kit</Link></div>,
            dontText: 'Don’t link the current page. It looks like somewhere new to go and only reloads the page.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <Breadcrumbs homeHref="/" items={[{ label: 'UI kits', href: '/ui-kits' }, { label: 'Dashboards', href: '/ui-kits/dashboards' }, { label: 'Neon dashboard UI kit' }]} />,
        doText: 'Follow the marketplace structure: category, subcategory, page.',
        dont: <Breadcrumbs homeHref="/" items={[{ label: 'Search results', href: '/search' }, { label: 'Saved', href: '/saved' }, { label: 'Neon dashboard UI kit' }]} />,
        dontText: 'Don’t list the pages someone happened to visit. The trail changes every time and stops making sense.',
      },
      {
        do: <div style={{ width: 300 }}><Breadcrumbs homeHref="/" items={[{ label: 'Templates', href: '/templates' }, { label: 'Studio portfolio' }]} /></div>,
        doText: 'Use the short page name in the trail.',
        dont: <div style={{ width: 300 }}><Breadcrumbs homeHref="/" items={[{ label: 'Templates', href: '/templates' }, { label: 'Studio portfolio template for designers with 24 pages and a dark mode' }]} /></div>,
        dontText: 'Don’t paste the full listing title. It wraps and pushes the page title down.',
      },
      {
        do: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 300 }}><Breadcrumbs homeHref="/" items={[{ label: 'Icon packs', href: '/icon-packs' }, { label: 'Pastel icon pack' }]} /><span style={{ font: '700 24px/32px var(--font-display)', color: 'var(--text-primary)' }}>Pastel icon pack</span></div>,
        doText: 'Keep breadcrumbs small and above the page title.',
        dont: <div style={{ display: 'grid', gap: 'var(--space-xs)', width: 300 }}><span style={{ font: '700 24px/32px var(--font-display)', color: 'var(--text-primary)' }}>Pastel icon pack</span><Breadcrumbs homeHref="/" items={[{ label: 'Icon packs', href: '/icon-packs' }, { label: 'Pastel icon pack' }]} /></div>,
        dontText: 'Don’t put them under the title. People read the trail as a subtitle and miss that it links back up.',
      },
    ],
    content: [
      'Use the same names as the menus and page titles, so each crumb matches where it leads.',
      'Write labels in sentence case, and keep each to 1–4 words.',
      'Don’t add “You are here” or other lead-in text. The trail and its landmark name say it already.',
      'Start the trail at the top of the current area: the marketplace Home for buyers, the dashboard for sellers.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves through Home and each ancestor link. The current page is skipped because it is not a link.'],
      ['Enter', 'Follows the focused link.'],
    ],
    notes: [
      'Renders <nav aria-label="Breadcrumb"> with an ordered list, so screen readers announce the landmark and the number of levels.',
      'The Home icon link has aria-label="Home". Separators are icons with aria-hidden.',
      'The last item has aria-current="page".',
      'Links meet 4.5:1 in text-secondary, and hover adds an underline so the state does not rely on color.',
    ],
  },

  related: ['top-nav', 'link', 'stepper'],

  changelog: [
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Breadcrumbs in React and HTML/CSS, matching the Figma component.' },
    { v: '0.3.0', date: '2026-10-09', type: 'Changed', notes: 'Home and separators moved to Hugeicons stroke (home-01, arrow-right-01).' },
  ],
};
