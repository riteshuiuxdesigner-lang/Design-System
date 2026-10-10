import { Icon, Button, IconButton, Badge, Avatar, SearchField, Toast, Drawer, CommandPalette, NotificationCenter, Popover, ListItem, Switch, Tabs, EmptyState, Divider, BottomNav, useState, useEffect } from './ds.js';
const { useLayoutEffect } = React;
import { StoreProvider, useStore, useRoute, go } from './store.jsx';
import { Confetti, assetArt } from './ui/kit.jsx';
import { DESIGNERS, ME, LICENSES, priceFor, money, designer } from './data.js';
import PAGES from './pages/index.js';

/* ---------- header ---------- */
const NAV = [{ id: 'shop', label: 'Shop', icon: 'store-01' }, { id: 'gigs', label: 'Gigs', icon: 'message-01' }, { id: 'designers', label: 'Designers', icon: 'user' }];

function Wordmark() {
  return (
    <a className="wm" href="#home" aria-label="Nudge home">
      <span className="wm__mark" aria-hidden="true"><span className="wm__dot" /></span>
      <span className="wm__word">nudge</span>
    </a>
  );
}

function AccountMenu() {
  const s = useStore();
  const trigger = <button type="button" className="acct" aria-label="Your account"><Avatar initials={ME.initials} color={ME.color} size="sm" /></button>;
  return (
    <Popover trigger={trigger} label="Your account">
      <div className="acct__panel">
        <div className="acct__me"><Avatar initials={ME.initials} color={ME.color} /><div><div className="acct__name">{ME.name}</div><div className="acct__meta">@{ME.handle}</div></div></div>
        <ListItem href="#dashboard" leading={<Icon name="dashboard-square-01" />} title="Dashboard" meta="Sales, gigs and payouts" />
        <ListItem href="#designer.me" leading={<Icon name="user" />} title="Your profile" meta="What clients and buyers see" />
        <ListItem href="#saved" leading={<Icon name="favourite" />} title="Saved" meta={s.saved.length + ' items on your board'} />
        <Divider />
        <div className="acct__theme"><span>Theme</span>
          <Tabs label="Theme" value={s.theme} onChange={s.setTheme} items={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'Auto' }]} />
        </div>
        <Button variant="ghost" size="sm" leadingIcon="refresh" onClick={s.reset}>Reset demo</Button>
      </div>
    </Popover>
  );
}

function Bell() {
  const s = useStore();
  const unread = s.notifications.filter(n => n.unread).length;
  const trigger = <IconButton icon="notification-01" label={unread ? 'Notifications, ' + unread + ' unread' : 'Notifications'} className="hdr__iconbtn" />;
  return (
    <span className="badged">
      <Popover trigger={trigger} label="Notifications"><NotificationCenter items={s.notifications} onMarkAll={s.markAllRead} className="bell__panel" /></Popover>
      {unread > 0 && <span className="badged__n" aria-hidden="true">{unread}</span>}
    </span>
  );
}

function Header({ route }) {
  const s = useStore();
  return (
    <header className="hdr">
      <div className="hdr__in">
        <Wordmark />
        <nav className="hdr__nav" aria-label="Primary">
          {NAV.map(n => <a key={n.id} href={'#' + n.id} className="mds-navlink" aria-current={route.page === n.id || (n.id === 'shop' && route.page === 'asset') || (n.id === 'gigs' && route.page === 'gig') || (n.id === 'designers' && route.page === 'designer' && route.param !== 'me') ? 'page' : undefined}>{n.label}</a>)}
        </nav>
        <button type="button" className="hdr__search" onClick={() => s.openSearch(true)}><Icon name="search-01" size={20} /><span>Search assets, gigs, designers</span><kbd className="mds-kbd">⌘K</kbd></button>
        <span className="grow" />
        <div className="hdr__actions">
          <Button variant="secondary" size="sm" className="hdr__post" onClick={() => go('post')}>Post a gig</Button>
          <Button size="sm" leadingIcon="upload-01" className="hdr__sell" onClick={() => go('sell')}>Sell</Button>
          <IconButton icon="search-01" label="Search" className="hdr__iconbtn hdr__mobile-search" onClick={() => s.openSearch(true)} />
          <Bell />
          <span className="badged">
            <IconButton icon="shopping-bag-01" label={'Cart, ' + s.cart.length + ' items'} className="hdr__iconbtn" onClick={() => s.openCart(true)} />
            {s.cart.length > 0 && <span className="badged__n" aria-hidden="true">{s.cart.length}</span>}
          </span>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

/* ---------- cart ---------- */
function CartDrawer() {
  const s = useStore();
  const [paying, setPaying] = useState(false);
  const total = s.cartTotal();
  function pay() { setPaying(true); setTimeout(() => { setPaying(false); s.openCart(false); s.checkout(); }, 1200); }
  return (
    <Drawer open={s.ui.cart} onClose={() => s.openCart(false)} title={'Cart (' + s.cart.length + ')'} side={matchMedia('(max-width: 639px)').matches ? 'bottom' : 'right'}
      footer={s.cart.length ? <><div className="cart__total"><span>Total</span><span className="mds-num">{money(total)}</span></div><Button size="lg" loading={paying} leadingIcon="credit-card" onClick={pay}>{paying ? 'Paying' : total ? 'Pay ' + money(total) : 'Get them free'}</Button></> : null}>
      {s.cart.length === 0 ? <EmptyState scene="listings" title="Your cart is empty" body="Find a kit, a font or an icon set you love, then come back here to check out." action={<Button variant="secondary" onClick={() => { s.openCart(false); go('shop'); }}>Browse the shop</Button>} headingLevel={3} />
        : <div className="cart">{s.cart.map(c => {
          const a = s.asset(c.id); if (!a) return null; const d = designer(a.by);
          return (
            <div className="cart__row" key={c.id}>
              <img className="cart__thumb" src={assetArt(a)} alt="" />
              <div className="cart__info"><a href={'#asset.' + a.id} className="cart__title" onClick={() => s.openCart(false)}>{a.title}</a><span className="cart__meta">{d ? d.name : 'You'} · {LICENSES.find(l => l.value === c.license).title} license</span><span className="cart__price mds-num">{money(priceFor(a, c.license))}</span></div>
              <IconButton icon="delete-02" size="sm" label={'Remove ' + a.title} onClick={() => s.removeFromCart(c.id)} />
            </div>
          );
        })}<p className="cart__note"><Icon name="license" size={16} />Instant download. Lifetime updates. 14-day refunds if a file doesn’t open.</p></div>}
    </Drawer>
  );
}

/* ---------- search (⌘K) ---------- */
function Search() {
  const s = useStore();
  useEffect(() => {
    const k = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); s.openSearch(!s.ui.search); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [s.ui.search]);
  const groups = [
    { label: 'Actions', items: [{ label: 'Sell an asset', icon: 'upload-01', hint: 'Open your stall', onSelect: () => go('sell') }, { label: 'Post a gig', icon: 'add-01', hint: 'Get pitches', onSelect: () => go('post') }, { label: 'Open dashboard', icon: 'dashboard-square-01', hint: 'Sales and gigs', onSelect: () => go('dashboard') }] },
    { label: 'Assets', items: s.allAssets.map(a => ({ label: a.title, icon: 'image-01', hint: money(a.price), onSelect: () => go('asset', a.id) })) },
    { label: 'Gigs', items: s.allGigs.map(g => ({ label: g.title, icon: 'message-01', hint: g.client.name, onSelect: () => go('gig', g.id) })) },
    { label: 'Designers', items: DESIGNERS.map(d => ({ label: d.name, icon: 'user', hint: d.title, onSelect: () => go('designer', d.id) })) },
  ];
  return <CommandPalette open={s.ui.search} onClose={() => s.openSearch(false)} groups={groups} placeholder="Search assets, gigs and designers" label="Search Nudge" />;
}

/* ---------- footer ---------- */
function Footer() {
  return (
    <footer className="foot">
      <div className="foot__in">
        <div className="foot__big" aria-hidden="true">nudge<span className="foot__dot" /></div>
        <div className="foot__cols">
          <div><div className="foot__h">Buy</div><a href="#shop">Shop</a><a href="#shop.ui">UI kits</a><a href="#shop.icons">Icons</a><a href="#shop.type">Fonts</a></div>
          <div><div className="foot__h">Work</div><a href="#gigs">Gigs board</a><a href="#post">Post a gig</a><a href="#designers">Hire designers</a></div>
          <div><div className="foot__h">Sell</div><a href="#sell">Open your stall</a><a href="#dashboard">Dashboard</a></div>
          <div className="foot__note">A prototype built on the Marketplace Design System. Every person, price and project here is an example.</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- mobile bottom nav ---------- */
const BOTTOM = [{ label: 'Home', icon: 'home-01', page: 'home' }, { label: 'Shop', icon: 'store-01', page: 'shop' }, { label: 'Gigs', icon: 'message-01', page: 'gigs' }, { label: 'Sell', icon: 'add-01', page: 'sell' }, { label: 'You', icon: 'user', page: 'dashboard' }];
function MobileNav({ route }) {
  const cur = (BOTTOM.find(b => b.page === route.page || (b.page === 'shop' && route.page === 'asset') || (b.page === 'gigs' && route.page === 'gig')) || {}).label;
  return <BottomNav className="mnav" items={BOTTOM} value={cur || ''} onChange={l => go(BOTTOM.find(b => b.label === l).page)} />;
}

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() { return this.state.err ? <div className="page"><EmptyState scene="error" title="This page tripped over" body={String(this.state.err.message)} action={<Button onClick={() => { location.hash = 'home'; location.reload(); }}>Back to home</Button>} /></div> : this.props.children; }
}

function Shell() {
  const route = useRoute();
  const s = useStore();
  // Reset scroll before page effects run, so a page can still scroll to its own anchor on mount.
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [route.page, route.param]);
  const Page = PAGES[route.page] || PAGES.home;
  // Layout effect runs before page effects, so a page can still set a more specific title in its own useEffect.
  useLayoutEffect(() => { document.title = (Page.title ? Page.title + ' · ' : '') + 'Nudge'; }, [route.page, route.param]);
  return (
    <div className="app">
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main').focus(); }}>Skip to content</a>
      <Header route={route} />
      <main id="main" tabIndex={-1} className="main"><Boundary key={route.page + (route.param || '')}><Page param={route.param} /></Boundary></main>
      <Footer />
      <MobileNav route={route} />
      <CartDrawer />
      <Search />
      <div className="toasts" aria-live="polite">{s.ui.toasts.map(t => <Toast key={t.id} message={t.message} variant={t.variant} actionLabel={t.actionLabel} onAction={() => { t.onAction && t.onAction(); s.dismissToast(t.id); }} onDismiss={() => s.dismissToast(t.id)} />)}</div>
      <Confetti fire={s.ui.confetti} />
    </div>
  );
}

// Preview shots are drawn on a canvas with Inter Display, so wait for the font (max 2.5s) before the first render.
const fontsReady = document.fonts && document.fonts.load
  ? Promise.race([Promise.all(['400', '500', '600', '700'].map(w => document.fonts.load(w + ' 40px "Inter Display"'))), new Promise(r => setTimeout(r, 2500))])
  : Promise.resolve();
fontsReady.catch(() => {}).then(() => ReactDOM.createRoot(document.getElementById('app')).render(<StoreProvider><Shell /></StoreProvider>));
