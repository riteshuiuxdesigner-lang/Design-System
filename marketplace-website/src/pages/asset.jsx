import { Icon, Button, IconButton, Badge, Avatar, Alert, Tabs, Rating, LicenseSelector, Carousel, Breadcrumbs, EmptyState, Divider, useState, useEffect, useMemo } from '../ds.js';
import { Section, AssetGrid, assetArt } from '../ui/kit.jsx';
import { art, POP } from '../art.js';
import { ME, CATEGORIES, LICENSES, REVIEWS, designer, priceFor, money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* Extra gallery slides: the same asset shown through related preview recipes in other colors. */
const COMPANIONS = {
  ui: ['mobile', 'icons', 'brand'], mobile: ['ui', 'icons', 'brand'], icons: ['icons', 'ui', 'brand'], '3d': ['3d', 'scene', 'icons'],
  type: ['type', 'poster', 'brand'], poster: ['poster', 'type', 'brand'], scene: ['scene', 'mobile', 'poster'], brand: ['brand', 'type', 'poster'],
};
function gallery(a) {
  const kind = a.kind || 'ui', colors = [...POP, 'grey'].filter(c => c !== a.bg);
  return [{ image: assetArt(a), alt: a.title + ', cover preview' }].concat((COMPANIONS[kind] || COMPANIONS.ui).map((k, i) => ({
    image: art(k, colors[(i * 2 + a.id.length) % colors.length], a.id + '-' + i, { word: a.word }),
    alt: a.title + ', preview ' + (i + 2),
  })));
}

const LICENSE_RULES = {
  personal: { yes: ['Your own projects, portfolio and side projects', 'Unlimited personal downloads of updates'], no: ['Client work', 'Anything you sell'] },
  commercial: { yes: ['Client work and work for your employer', 'Apps and sites with up to 10,000 end users', 'One project per license'], no: ['Templates or products you resell'] },
  extended: { yes: ['Products you sell: templates, themes, apps', 'Unlimited end users', 'Unlimited projects for one company'], no: ['Redistributing the source files as they are'] },
};
const TRUST = [
  ['download-01', 'Instant download', 'Files land in your library the moment you pay.'],
  ['refresh', 'Free updates for life', 'Every new version, no extra charge.'],
  ['license', '14-day refunds', 'If a file doesn’t open, you get your money back.'],
];

function creatorOf(a) {
  const d = designer(a.by);
  if (d) return { ...d, me: false };
  return { id: 'me', name: a.byName || ME.name, initials: a.byInitials || ME.initials, color: ME.color, handle: ME.handle, title: ME.title, me: true };
}

/* ---------- right column: license, price, buy ---------- */
function BuyBox({ a }) {
  const s = useStore();
  const inCart = s.cart.find(c => c.id === a.id);
  const owned = s.purchases.find(p => p.id === a.id);
  const [lic, setLic] = useState(inCart ? inCart.license : 'personal');
  const free = (a.price || 0) === 0;
  const price = priceFor(a, lic);
  const licTitle = (LICENSES.find(l => l.value === lic) || LICENSES[0]).title;
  const saved = s.isSaved(a.id);
  const cartSame = inCart && inCart.license === lic;

  function buy() { if (free) { s.claimFree(a.id); return; } s.addToCart(a.id, lic, { silent: true }); s.openCart(); }
  function share() {
    const url = location.href.split('#')[0] + '#asset.' + a.id;
    const done = () => s.toast('Link copied. Send it to a friend who needs this.', { variant: 'success' });
    try { navigator.clipboard.writeText(url).then(done, done); } catch (e) { done(); }
  }

  return (
    <div className="asset-buy">
      {owned ? (
        <>
          <Alert variant="success" title="You own this">{free ? 'It’s in your library, free for personal and client work.' : 'You bought it with a ' + (LICENSES.find(l => l.value === owned.license) || LICENSES[0]).title + ' license.'} Download it again whenever you like.</Alert>
          <Button size="lg" leadingIcon="download-01" className="asset-buy__wide" onClick={() => s.toast('Download started', { variant: 'success' })}>Download files</Button>
        </>
      ) : (
        <>
          <div className="asset-buy__price">
            <span className="asset-buy__amount mds-num">{money(price)}</span>
            {!free && lic === 'personal' && a.was && <span className="asset-buy__was mds-num"><span className="mds-sr">was </span>{money(a.was)}</span>}
            <span className="asset-buy__lic">{free ? 'Free for personal and client work' : licTitle + ' license'}</span>
          </div>
          {!free && <LicenseSelector legend="Choose a license" value={lic} onChange={setLic}
            options={LICENSES.map(l => ({ value: l.value, title: l.title, description: l.description, price: money(priceFor(a, l.value)) }))} />}
          <div className="asset-buy__actions">
            <Button size="lg" className="asset-buy__wide" leadingIcon={free ? 'gift' : 'shopping-bag-01'} onClick={buy}>{free ? 'Get it free' : 'Buy for ' + money(price)}</Button>
            <div className="asset-buy__row">
              {!free && (cartSame
                ? <Button variant="secondary" leadingIcon="tick-02" className="asset-buy__grow" onClick={() => s.openCart()}>In your cart</Button>
                : <Button variant="secondary" leadingIcon="shopping-cart-01" className="asset-buy__grow" onClick={() => s.addToCart(a.id, lic)}>{inCart ? 'Switch to ' + licTitle : 'Add to cart'}</Button>)}
              <IconButton variant="secondary" icon="favourite" label={saved ? 'Remove from saved' : 'Save'} selected={saved} className="asset-buy__save" onClick={() => s.toggleSave(a.id)} />
              <IconButton variant="secondary" icon="share-08" label="Copy link" onClick={share} />
            </div>
          </div>
        </>
      )}
      <Divider />
      <dl className="asset-facts">
        <div><dt>Formats</dt><dd className="asset-facts__badges">{(a.formats || ['Figma']).map(x => <Badge key={x}>{x}</Badge>)}</dd></div>
        <div><dt>Updated</dt><dd>{a.updated ? 'Updated ' + a.updated : 'Just published'}</dd></div>
      </dl>
      <ul className="asset-trust">
        {TRUST.filter(x => !free || x[1] !== '14-day refunds').map(([icon, t, b]) => <li key={t}><span className="asset-trust__icon"><Icon name={icon} size={16} /></span><span><strong>{t}</strong>{b}</span></li>)}
      </ul>
    </div>
  );
}

/* ---------- tab panels ---------- */
function Overview({ a }) {
  const cat = CATEGORIES.find(c => c.id === a.category);
  return (
    <div className="asset-ov">
      <p className="asset-lead">{a.desc || 'A fresh listing on Nudge.'}</p>
      <dl className="asset-spec">
        <div><dt>Category</dt><dd>{cat ? <a href={'#shop.' + cat.id}>{cat.label}</a> : 'Other'}</dd></div>
        <div><dt>Works with</dt><dd>{(a.formats || ['Figma']).join(', ')}</dd></div>
        <div><dt>Last update</dt><dd>{a.updated || 'Today'}</dd></div>
        <div><dt>Sold</dt><dd>{(a.sales || 0).toLocaleString('en-US')} times</dd></div>
      </dl>
    </div>
  );
}
function Included({ a }) {
  const items = (a.includes || []).concat(['Commercial use with the right license', 'Support from the creator within 48 hours']);
  return <ul className="asset-incl">{items.map(t => <li key={t}><span className="asset-incl__tick"><Icon name="tick-02" size={16} /></span>{t}</li>)}</ul>;
}
function Reviews({ a }) {
  return (
    <div className="asset-rev">
      <div className="asset-rev__sum">
        <span className="asset-rev__big mds-num">{(a.rating || 0).toFixed(1)}</span>
        <div><Rating value={a.rating || 0} /><p className="asset-rev__count">{(a.reviews || 0).toLocaleString('en-US')} reviews from verified buyers</p></div>
      </div>
      <ul className="asset-rev__list">
        {REVIEWS.map(r => (
          <li key={r.by} className="asset-rev__item">
            <Avatar initials={r.initials} color={r.color} size="sm" />
            <div className="asset-rev__body">
              <div className="asset-rev__top"><strong>{r.by}</strong><Rating value={r.rating} size="sm" /><span className="asset-rev__when">{r.when}</span></div>
              <p>{r.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
function License({ a }) {
  return (
    <div className="asset-lic">
      {LICENSES.map(l => (
        <div key={l.value} className="asset-lic__card">
          <div className="asset-lic__head"><h3>{l.title}</h3><span className="mds-num">{money(priceFor(a, l.value))}</span></div>
          <p>{l.description}</p>
          <ul>
            {LICENSE_RULES[l.value].yes.map(t => <li key={t}><Icon name="tick-02" size={16} className="asset-lic__yes" />{t}</li>)}
            {LICENSE_RULES[l.value].no.map(t => <li key={t} className="asset-lic__no"><Icon name="cancel-01" size={16} />{t}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */
function Asset({ param }) {
  const s = useStore();
  const a = param ? s.asset(param) : null;
  const [tab, setTab] = useState('overview');
  const slides = useMemo(() => a ? gallery(a) : [], [a && a.id]);
  useEffect(() => { if (a) document.title = a.title + ' · Nudge'; }, [a && a.id]);

  if (!a) return (
    <div className="page">
      <EmptyState scene="search" headingLevel={1} title="We couldn’t find that asset"
        body="It may have been unpublished by its creator, or the link has a typo. Plenty more where it came from, though."
        action={<Button onClick={() => go('shop')} leadingIcon="store-01">Browse the shop</Button>} />
    </div>
  );

  const c = creatorOf(a);
  const following = s.isFollowing(c.id);
  const cat = CATEGORIES.find(x => x.id === a.category);
  const more = s.allAssets.filter(x => x.by === a.by && x.id !== a.id).slice(0, 4);
  const like = s.allAssets.filter(x => x.id !== a.id && x.by !== a.by)
    .sort((x, y) => (y.category === a.category) - (x.category === a.category) || (y.sales || 0) - (x.sales || 0)).slice(0, 4);
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'included', label: 'What’s included' },
    { value: 'reviews', label: 'Reviews', count: a.reviews ? a.reviews.toLocaleString('en-US') : undefined },
    { value: 'license', label: 'License' },
  ].map(t => ({ ...t, controls: 'asset-panel' }));

  function follow() { s.toggleFollow(c.id); s.toast(following ? 'Unfollowed ' + c.name : 'Following ' + c.name + '. Their new drops will show up in your feed.', { variant: following ? 'neutral' : 'success' }); }

  return (
    <div className="page asset">
      <Breadcrumbs className="asset-crumbs" homeHref="#home" items={[{ label: 'Shop', href: '#shop' }].concat(cat ? [{ label: cat.label, href: '#shop.' + cat.id }] : []).concat([{ label: a.title }])} />

      <div className="asset-layout">
        <header className="asset-head">
          <div className="asset-head__badges">
            {a.badge && <Badge variant={a.badgeVariant || 'yellow'}>{a.badge}</Badge>}
            {s.owns(a.id) && <Badge variant="success" icon="checkmark-circle-02">In your library</Badge>}
          </div>
          <h1 className="asset-title">{a.title}</h1>
          <div className="asset-meta">
            {a.rating ? <Rating value={a.rating} count={a.reviews} size="sm" /> : <span>No reviews yet</span>}
            <span className="asset-meta__dot" aria-hidden="true" />
            <span><strong className="mds-num">{(a.sales || 0).toLocaleString('en-US')}</strong> sales</span>
          </div>
          <div className="asset-creator">
            <a href={'#designer.' + c.id} className="asset-creator__link">
              <Avatar initials={c.initials} color={c.color} />
              <span className="asset-creator__text"><span className="asset-creator__name">{c.name}</span><span className="asset-creator__sub">{c.title}{c.location ? ' · ' + c.location : ''}</span></span>
            </a>
            {c.me ? <Badge>That’s you</Badge>
              : <Button size="sm" variant={following ? 'tertiary' : 'secondary'} leadingIcon={following ? 'tick-02' : 'add-01'} aria-pressed={following} onClick={follow}>{following ? 'Following' : 'Follow'}</Button>}
          </div>
        </header>

        <div className="asset-gallery">
          <Carousel key={a.id} slides={slides} />
        </div>

        <aside className="asset-side" aria-label="Buy this asset"><BuyBox key={a.id} a={a} /></aside>

        <div className="asset-details">
          <Tabs label="About this asset" value={tab} onChange={setTab} items={tabs} className="asset-tabs" />
          <div id="asset-panel" role="tabpanel" aria-label={tabs.find(t => t.value === tab).label} className="asset-panel" key={tab}>
            {tab === 'overview' && <Overview a={a} />}
            {tab === 'included' && <Included a={a} />}
            {tab === 'reviews' && <Reviews a={a} />}
            {tab === 'license' && <License a={a} />}
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <Section title={'More from ' + c.name.split(' ')[0]} sub={c.bio} action={!c.me && <Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => go('designer', c.id)}>View profile</Button>}>
          <AssetGrid items={more} min={240} />
        </Section>
      )}
      <Section title="You might also like" sub={cat ? 'More ' + cat.label.toLowerCase() + ' and things people bought alongside this.' : 'Popular in the shop this week.'}
        action={<Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => go('shop', cat ? cat.id : null)}>Browse {cat ? cat.label.toLowerCase() : 'the shop'}</Button>}>
        <AssetGrid items={like} min={240} />
      </Section>
    </div>
  );
}
Asset.title = 'Asset';
export default Asset;
