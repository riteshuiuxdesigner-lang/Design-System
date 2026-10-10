import { Icon, Button, Badge, Avatar, AvatarGroup, Tabs, SearchField, Select, Rating, useState } from '../ds.js';
import { Section, AssetGrid, GigCard, DesignerTile, assetArt, workOf } from '../ui/kit.jsx';
import { CATEGORIES, DESIGNERS } from '../data.js';
import { useStore, go } from '../store.jsx';

const TAGS = ['dashboard', '3d icons', 'brand guidelines', 'onboarding', 'variable font', 'mobile app'];

function PersonCard({ d, img, className, style }) {
  return (
    <a href={'#designer.' + d.id} className={'pcard ' + (className || '')} style={style}>
      <img src={img} alt={d.name} />
      <span className="pcard__info">
        <span className="pcard__name">{d.name}</span>
        <span className="pcard__role">{d.title}</span>
        <span className="pcard__row"><span className="avail"><span className="dot" />Available</span><span className="pcard__rate">${d.rate}/hr</span></span>
      </span>
    </a>
  );
}

function Hero() {
  const s = useStore();
  const [mode, setMode] = useState('shop');
  const [q, setQ] = useState('');
  const mira = DESIGNERS.find(d => d.id === 'mira'), leo = DESIGNERS.find(d => d.id === 'leo'), yuki = DESIGNERS.find(d => d.id === 'yuki');
  return (
    <section className="hero">
      <div className="hero__in">
        <div className="hero__copy">
          <span className="hero__pill"><AvatarGroup people={DESIGNERS.slice(0, 4).map(d => ({ initials: d.initials, color: d.color, name: d.name }))} max={4} size="xs" label="Designers on Nudge" />12,480 designers sell and freelance here</span>
          <h1 className="hero__title">The home for designers who <span className="hero__hl">sell, freelance</span> and&nbsp;hire.</h1>
          <p className="hero__lead">Buy and sell UI kits, icons and fonts. Pitch for real projects. Hire someone brilliant for yours.</p>
          <form className="hero__search" role="search" onSubmit={e => { e.preventDefault(); go(mode); }}>
            <div className="hero__bar">
              <span className="hero__modewrap">
                <select className="hero__mode" aria-label="Search for" value={mode} onChange={e => setMode(e.target.value)}>
                  <option value="shop">Assets</option><option value="gigs">Gigs</option><option value="designers">Designers</option>
                </select>
                <Icon name="arrow-down-01" size={16} className="hero__chev" />
              </span>
              <span className="hero__div" aria-hidden="true" />
              <SearchField value={q} onChange={setQ} onSubmit={() => go(mode)} shortcut={false} label={'Search ' + mode}
                placeholder={mode === 'shop' ? 'Dashboard UI kit, 3D icons…' : mode === 'gigs' ? 'Brand identity, onboarding…' : 'Illustrator, type designer…'} />
              <Button type="submit" aria-label="Search"><Icon name="search-01" size={20} /></Button>
            </div>
          </form>
          <div className="hero__tags">{TAGS.map(t => <button key={t} type="button" className="tagbtn" onClick={() => go('shop')}>{t}</button>)}</div>
          <dl className="hero__stats">
            <div><dt>48k</dt><dd>assets for sale</dd></div>
            <div><dt>1,200</dt><dd>open gigs</dd></div>
            <div><dt>$12M</dt><dd>paid to designers</dd></div>
          </dl>
        </div>
        <div className="hero__art" aria-label="Designers on Nudge">
          <PersonCard d={mira} img="people/mira-lg.jpg" className="pcard--a" />
          <PersonCard d={leo} img="people/leo-lg.jpg" className="pcard--b" />
          <PersonCard d={yuki} img="people/yuki-lg.jpg" className="pcard--c" />
          <div className="float float--sale" aria-hidden="true"><span className="float__icon float__icon--lime"><Icon name="dollar-01" size={20} /></span><span><strong>+$49.00</strong><small>Orbit UI Kit just sold</small></span></div>
          <div className="float float--pitch" aria-hidden="true"><Avatar initials="KA" color="pop-lime" size="sm" /><span><strong>Kemi got hired</strong><small>Mascot for Owlet Learn · $2,200</small></span></div>
          <div className="float float--rating" aria-hidden="true"><Rating value={4.9} size="sm" /><small>from 2,400+ reviews</small></div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const s = useStore();
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('popular');
  let items = s.allAssets.filter(a => cat === 'all' || a.category === cat);
  if (sort === 'new') items = [...items].sort((a, b) => (b.badge === 'New') - (a.badge === 'New'));
  if (sort === 'price') items = [...items].sort((a, b) => a.price - b.price);
  if (sort === 'popular') items = [...items].sort((a, b) => b.sales - a.sales);
  return (
    <>
      <Hero />
      <div className="page page--home">
        <div className="shots">
        <div className="filterbar">
          <Select label="" aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)} size="sm" options={[{ value: 'popular', label: 'Popular' }, { value: 'new', label: 'New & noteworthy' }, { value: 'price', label: 'Price: low to high' }]} className="filterbar__sort" />
          <div className="filterbar__cats" role="tablist" aria-label="Categories">
            {CATEGORIES.map(c => <button key={c.id} type="button" role="tab" aria-selected={String(cat === c.id)} className="cat" onClick={() => setCat(c.id)}>{c.label}</button>)}
          </div>
          <Button size="sm" variant="secondary" leadingIcon="filter-horizontal" onClick={() => go('shop', cat === 'all' ? null : cat)}>Filters</Button>
        </div>
        <AssetGrid items={items.slice(0, 12)} />
        <div className="more"><Button variant="secondary" size="lg" trailingIcon="arrow-right-01" onClick={() => go('shop', cat === 'all' ? null : cat)}>Browse all assets</Button></div>
        </div>

        <Section title="Hire independent designers" sub="Vetted, available and fairly priced. Message them directly, no middle steps." action={<Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => go('designers')}>Browse talent</Button>}>
          <div className="tgrid">{DESIGNERS.filter(d => d.available).slice(0, 4).map(d => <DesignerTile key={d.id} d={d} />)}</div>
        </Section>

        <Section title="Fresh opportunities" sub="Real projects from verified clients. Pitch in two minutes, no fees to apply." action={<Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => go('gigs')}>All gigs</Button>}>
          <div className="opps">
            <div className="opps__list">{s.allGigs.slice(0, 4).map(g => <GigCard key={g.id} g={g} />)}</div>
            <aside className="opps__rail">
              <div className="postcard">
                <div className="postcard__shots" aria-hidden="true">
                  {['orbit', 'kiosk', 'pastel3d'].map((id, i) => <img key={id} src={assetArt(s.asset(id))} alt="" className={'postcard__shot postcard__shot--' + i} />)}
                </div>
                <div className="postcard__body">
                  <span className="postcard__eyebrow">For clients</span>
                  <h3>Have a project?</h3>
                  <p>Post it in four minutes. Most clients get their first pitch within two hours.</p>
                  <Button leadingIcon="add-01" onClick={() => go('post')} style={{ width: '100%' }}>Post a gig</Button>
                  <div className="postcard__live">
                    <div className="postcard__livehead"><span className="dot" />Pitches coming in now</div>
                    {[['kemi', '$2,200', 'Mascot for Owlet Learn', '2m'], ['yuki', '$3,100', 'Little Bean Co. branding', '9m']].map(([id, price, gig, t]) => {
                      const d = DESIGNERS.find(x => x.id === id);
                      return <div key={id} className="postcard__row"><Avatar initials={d.initials} color={d.color} size="sm" /><div className="postcard__rowtext"><span><strong>{d.name.split(' ')[0]}</strong> pitched {price}</span><span className="postcard__meta">{gig} · {t} ago</span></div></div>;
                    })}
                  </div>
                </div>
              </div>
              <div className="mini">
                <div className="mini__h">Hot skills this week</div>
                {['Design systems', 'Onboarding', 'Brand identity', '3D product', 'Data viz'].map((k, i) => <div key={k} className="mini__row"><span>{k}</span><span className="mini__n">+{[38, 24, 19, 15, 11][i]}%</span></div>)}
              </div>
            </aside>
          </div>
        </Section>

        <section className="duo">
          <div className="duo__card duo__card--sell">
            <Badge variant="ink">For sellers</Badge>
            <h2>Turn your drafts into income.</h2>
            <p>Upload a kit, set three prices, and keep 90% of every sale. Payouts land every Monday.</p>
            <Button size="lg" leadingIcon="upload-01" onClick={() => go('sell')}>Start selling</Button>
            <span className="duo__sticker">90%<small>is yours</small></span>
          </div>
          <div className="duo__card duo__card--hire">
            <Badge variant="yellow">For freelancers</Badge>
            <h2>Get paid for the work you love.</h2>
            <p>Build a profile in minutes, pitch for projects that fit, and get paid safely through Nudge.</p>
            <Button size="lg" variant="secondary" leadingIcon="user" onClick={() => go('designer', 'me')}>Set up your profile</Button>
            <span className="duo__sticker duo__sticker--pink">0%<small>fees to pitch</small></span>
          </div>
        </section>
      </div>
    </>
  );
}
Home.title = 'Sell, freelance and hire';
export default Home;
