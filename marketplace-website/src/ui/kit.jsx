// Nudge's own pieces, composed from the design system (tokens + MarketplaceDS components).
// Style: Dribbble + Contra. Clean surfaces, content first, playful through color, previews and springy motion.
import { Icon, Button, IconButton, Badge, Avatar, PriceTag, useState, useEffect, useRef } from '../ds.js';
import { art } from '../art.js';
import { designer, budgetText, money, ASSETS } from '../data.js';
import { useStore, go } from '../store.jsx';

export const cx = (...a) => a.filter(Boolean).join(' ');
export const compact = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);

/* Page section with a title row. */
export function Section({ title, sub, action, children, id, className }) {
  return (
    <section className={cx('sec', className)} id={id}>
      {(title || action) && <div className="sec__head">
        <div>{title && <h2 className="sec__title">{title}</h2>}{sub && <p className="sec__sub">{sub}</p>}</div>
        {action}
      </div>}
      {children}
    </section>
  );
}

/* Preview art for an asset (data: URI image). Cached per asset. */
const artCache = {};
export function assetArt(a) {
  if (a.image) return a.image;
  const k = a.id + a.kind + a.bg;
  return artCache[k] || (artCache[k] = art(a.kind, a.bg, a.id, { word: a.word }));
}
export function workOf(designerId, n = 3) { return ASSETS.filter(a => a.by === designerId).slice(0, n); }

/* Shot: a Dribbble-style asset card. Big preview, hover overlay, then creator, likes and price. */
export function AssetTile({ a }) {
  const s = useStore();
  const d = designer(a.by) || { id: 'me', name: a.byName || 'You', initials: a.byInitials || 'SR', color: 'pop-yellow' };
  const saved = s.isSaved(a.id);
  const [pop, setPop] = useState(false);
  const likes = (a.likes != null ? a.likes : Math.round((a.sales || 0) * 0.6 + (a.reviews || 0) * 3)) + (saved ? 1 : 0);
  function like() { s.toggleSave(a.id); setPop(true); setTimeout(() => setPop(false), 450); }
  return (
    <article className="shot">
      <div className="shot__media">
        <a href={'#asset.' + a.id} className="shot__link" aria-label={a.title}><img src={assetArt(a)} alt="" loading="lazy" /></a>
        {a.badge && <Badge className="shot__badge" variant={a.badgeVariant || 'yellow'}>{a.badge}</Badge>}
        <div className="shot__overlay" aria-hidden="true"><span className="shot__title">{a.title}</span></div>
        <div className="shot__actions">
          <IconButton size="sm" variant="secondary" icon="favourite" label={saved ? 'Remove ' + a.title + ' from saved' : 'Save ' + a.title} selected={saved} onClick={like} className={pop ? 'pop' : undefined} />
          {a.price > 0 && <IconButton size="sm" variant="secondary" icon="shopping-bag-01" label={'Add ' + a.title + ' to cart'} onClick={() => s.addToCart(a.id)} />}
        </div>
      </div>
      <div className="shot__meta">
        <a className="shot__by" href={'#designer.' + d.id}><Avatar size="xs" initials={d.initials} color={d.color} />{d.name}{d.rating >= 4.9 && <span className="pro">PRO</span>}</a>
        <span className="shot__stats"><span className="shot__likes"><Icon name="favourite" size={16} />{compact(likes)}</span><PriceTag price={money(a.price)} was={a.was ? money(a.was) : undefined} /></span>
      </div>
    </article>
  );
}
export function AssetGrid({ items, min = 250 }) {
  return <div className="agrid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))` }}>{items.map(a => <AssetTile key={a.id} a={a} />)}</div>;
}

/* Gig card: a Contra-style opportunity. Whole card opens the gig; Save and Apply act directly. */
export function GigCard({ g, showDesc = true }) {
  const s = useStore();
  const pitched = s.pitchFor(g.id);
  const saved = s.isSaved('gig:' + g.id);
  return (
    <article className="gcard">
      <div className="gcard__top">
        <Avatar initials={g.client.initials} color={g.client.color} />
        <div className="gcard__client">
          <span className="gcard__name">{g.client.name}{g.client.verified && <Icon name="checkmark-circle-02" size={16} label="Verified client" />}</span>
          <span className="gcard__sub">{g.client.spent} · {g.posted}</span>
        </div>
        <IconButton size="sm" icon="bookmark-01" label={saved ? 'Unsave ' + g.title : 'Save ' + g.title} selected={saved} onClick={() => s.toggleSave('gig:' + g.id)} />
      </div>
      <h3 className="gcard__title"><a href={'#gig.' + g.id}>{g.title}</a></h3>
      {showDesc && <p className="gcard__desc">{g.desc}</p>}
      <div className="gcard__skills">{g.skills.map(k => <span key={k} className="tag">{k}</span>)}</div>
      <div className="gcard__foot">
        <div className="gcard__budget"><span className="gcard__money">{budgetText(g.budget)}</span><span className="gcard__sub">{g.budget.type === 'hourly' ? 'Hourly' : 'Fixed'} · {g.duration} · {g.level}</span></div>
        <span className="gcard__pitches"><Icon name="message-01" size={16} />{g.pitches + (pitched ? 1 : 0)}</span>
        {pitched ? <Badge variant="lime" icon="tick-02">Pitched</Badge> : <Button size="sm" aria-label={'Apply to ' + g.title} onClick={() => go('gig', g.id + '-pitch')}>Apply</Button>}
      </div>
    </article>
  );
}
export const GigFlyer = GigCard;

/* Talent card: Contra-style designer card with a work strip, rate and availability. */
export function DesignerTile({ d }) {
  const s = useStore();
  const following = s.isFollowing(d.id);
  const shots = workOf(d.id);
  return (
    <article className="talent">
      <a className="talent__work" href={'#designer.' + d.id} aria-label={'See ' + d.name + '’s work'} tabIndex={-1}>
        {shots.length ? shots.map((a, i) => <img key={a.id} src={assetArt(a)} alt="" className={'talent__img talent__img--' + i} loading="lazy" />) : <span className="talent__img talent__img--0" style={{ background: 'var(--' + d.color + ')' }} />}
      </a>
      <div className="talent__body">
        <div className="talent__who">
          <Avatar initials={d.initials} color={d.color} size="lg" />
          <div className="talent__id">
            <h3 className="talent__name"><a href={'#designer.' + d.id}>{d.name}</a>{d.rating >= 4.9 && <Icon name="checkmark-circle-02" size={16} label="Top creator" />}</h3>
            <span className="talent__role">{d.title} · {d.location}</span>
          </div>
        </div>
        <div className="talent__facts">
          {d.available ? <span className="avail"><span className="dot" />Available</span> : <span className="avail avail--busy">Booked until Nov</span>}
          <span className="talent__fact"><Icon name="star" size={16} />{d.rating.toFixed(1)}</span>
          <span className="talent__fact">${d.rate}/hr</span>
        </div>
        <div className="gcard__skills">{d.skills.slice(0, 3).map(k => <span key={k} className="tag">{k}</span>)}</div>
        <div className="talent__actions">
          <Button size="sm" variant="secondary" onClick={() => go('designer', d.id)} style={{ flex: 1 }}>Get in touch</Button>
          <Button size="sm" variant={following ? 'tertiary' : 'ghost'} leadingIcon={following ? 'tick-02' : 'add-01'} aria-pressed={String(following)}
            onClick={() => { s.toggleFollow(d.id); s.toast(following ? 'Unfollowed ' + d.name : 'Following ' + d.name, { variant: following ? 'neutral' : 'success' }); }}>{following ? 'Following' : 'Follow'}</Button>
        </div>
      </div>
    </article>
  );
}

/* Confetti burst on publish, purchase and pitch. Skipped under reduced motion. */
export function Confetti({ fire }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!fire || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = ref.current, ctx = c.getContext('2d'), dpr = devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement);
    const colors = ['--pop-yellow', '--pop-lime', '--pop-pink', '--pop-orange', '--pop-violet', '--focus-ring'].map(v => cs.getPropertyValue(v).trim());
    const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.45, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 4, r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, c: colors[Math.floor(Math.random() * colors.length)], pill: Math.random() < 0.5 }));
    let raf, t = 0;
    (function frame() {
      t++; ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => { p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.beginPath(); if (p.pill) ctx.roundRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25, p.r); else ctx.arc(0, 0, p.r / 1.4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
      if (t < 160) raf = requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
    return () => cancelAnimationFrame(raf);
  }, [fire]);
  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}

/* Big success panel used after publishing, posting or pitching. */
export function Done({ icon = 'rocket-01', sticker = 'pop-yellow', title, body, actions }) {
  return (
    <div className="done">
      <span className="done__sticker" style={{ background: 'var(--' + sticker + ')' }}><Icon name={icon} variant="twotone" size={24} /></span>
      <h1 className="done__title">{title}</h1>
      {body && <p className="done__body">{body}</p>}
      {actions && <div className="done__actions">{actions}</div>}
    </div>
  );
}

export function Crumbs({ items }) {
  return <nav className="crumbs" aria-label="Breadcrumb">{items.map((it, i) => <span key={i} className="crumbs__item">{i > 0 && <Icon name="arrow-right-01" size={16} />}{it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}</span>)}</nav>;
}
