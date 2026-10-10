import { Icon, Button, Badge, Chip, Checkbox, Switch, Radio, Select, Slider, SearchField, Drawer, EmptyState, PriceTag, useState, useEffect, useMemo } from '../ds.js';
import { AssetGrid, assetArt, cx } from '../ui/kit.jsx';
import { CATEGORIES, designer, money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* ---------- copy ---------- */
const INTRO = {
  all: 'UI kits, icons, fonts and 3D made by designers who actually ship. Every file opens, or you get your money back.',
  ui: 'Components with auto layout, variables and every state drawn. Start your next product on day three, not day one.',
  icons: 'Icon sets drawn on real grids, with consistent strokes and a React package when you need one.',
  '3d': 'Squishy, glossy, friendly 3D. Renders you can drop straight into a hero, plus the Blender source.',
  type: 'Display faces, variable fonts and specimens. Licenses for desktop, web and apps, priced in plain English.',
  templates: 'Posters, wireframes and layouts on strict grids. Swap the content, keep the tension.',
  illustration: 'Characters with feelings and scenes for onboarding, empty states and the odd 404.',
  brand: 'Logo grids, color systems and guideline templates for brands that are just getting started.',
};
const SORTS = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Best rated' },
];
const RATINGS = [{ value: 0, label: 'Any rating' }, { value: 4.5, label: '4.5 and up' }, { value: 4.8, label: '4.8 and up' }, { value: 5, label: 'Only 5.0' }];
const PRICE_MAX = 150, PAGE = 12, FORMATS_SHOWN = 6;
const PICKS = ['swiss', 'hello', 'stroke'];

/* ---------- helpers ---------- */
const MONTHS = 'JanFebMarAprMayJunJulAugSepOctNovDec';
// "Oct 2" → days since the start of the year (assets you just published count as today).
function dayOf(a) {
  if (!a.updated) return 400;
  const m = MONTHS.indexOf(a.updated.slice(0, 3)) / 3, d = parseInt(a.updated.slice(4), 10) || 1;
  return m < 0 ? 0 : m * 31 + d;
}
const TODAY = dayOf({ updated: 'Oct 10' });
const hot = a => (a.sales || 0) / (Math.max(0, TODAY - dayOf(a)) + 14);
const SORT_FN = {
  trending: (a, b) => hot(b) - hot(a),
  newest: (a, b) => dayOf(b) - dayOf(a),
  'price-asc': (a, b) => (a.price || 0) - (b.price || 0) || hot(b) - hot(a),
  'price-desc': (a, b) => (b.price || 0) - (a.price || 0) || hot(b) - hot(a),
  rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0),
};
const usd = v => v >= PRICE_MAX ? '$' + PRICE_MAX + '+' : '$' + v;
const DEFAULTS = { q: '', price: [0, PRICE_MAX], free: false, formats: [], rating: 0 };

function useMedia(query) {
  const [m, setM] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query), f = () => setM(mq.matches);
    mq.addEventListener('change', f); return () => mq.removeEventListener('change', f);
  }, [query]);
  return m;
}

/* ---------- filter panel (inline on desktop, in a Drawer below 1024px) ---------- */
function FilterPanel({ f, set, formats, idp, inline }) {
  const [allFormats, setAllFormats] = useState(false);
  const shown = allFormats ? formats : formats.slice(0, FORMATS_SHOWN);
  const toggleFormat = name => set({ formats: f.formats.includes(name) ? f.formats.filter(x => x !== name) : [...f.formats, name] });
  return (
    <div className={cx('shop-filters', inline && 'shop-filters--inline')}>
      <fieldset className="shop-fs">
        <legend className="shop-fs__legend">Price</legend>
        {!f.free && <Slider range label="Personal license" min={0} max={PRICE_MAX} step={5} value={f.price} onChange={v => set({ price: v })} format={usd} />}
        <Switch label="Free only" checked={f.free} onChange={e => set({ free: e.target.checked })} />
      </fieldset>
      <fieldset className="shop-fs">
        <legend className="shop-fs__legend">Formats</legend>
        <div className="shop-fs__checks">
          {shown.map(([name, n]) => (
            <Checkbox key={name} checked={f.formats.includes(name)} onChange={() => toggleFormat(name)}
              label={<span className="shop-fs__opt">{name}<span className="shop-fs__n">{n}</span></span>} />
          ))}
        </div>
        {formats.length > FORMATS_SHOWN && (
          <button type="button" className="shop-more" aria-expanded={allFormats} onClick={() => setAllFormats(!allFormats)}>
            {allFormats ? 'Show fewer' : 'Show all ' + formats.length + ' formats'}<Icon name={allFormats ? 'arrow-up-01' : 'arrow-down-01'} size={16} />
          </button>
        )}
      </fieldset>
      <fieldset className="shop-fs">
        <legend className="shop-fs__legend">Rating</legend>
        <div className="shop-fs__radios">
          {RATINGS.map(r => (
            <Radio key={r.value} name={idp + '-rating'} value={String(r.value)} checked={f.rating === r.value} onChange={() => set({ rating: r.value })}
              label={<span className="shop-fs__opt">{r.value > 0 && <Icon name="star" size={16} className="shop-star" />}{r.label}</span>} />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/* ---------- staff picks: the page's one playful moment ---------- */
function StaffPicks() {
  const s = useStore();
  const picks = PICKS.map(id => s.asset(id)).filter(Boolean);
  return (
    <aside className="shop-picks" aria-labelledby="shop-picks-title">
      <div className="shop-picks__head">
        <h2 id="shop-picks-title" className="shop-picks__title"><span className="shop-picks__spark"><Icon name="sparkles" variant="twotone" size={16} /></span>Staff picks this week</h2>
        <span className="shop-picks__by">Chosen by the Nudge editors</span>
      </div>
      <ol className="shop-picks__row">
        {picks.map((a, i) => {
          const d = designer(a.by);
          return (
            <li key={a.id} className="shop-pick" style={{ '--pick': 'var(--' + ['pop-yellow', 'pop-pink', 'pop-lime'][i] + ')' }}>
              <a href={'#asset.' + a.id} className="shop-pick__link">
                <span className="shop-pick__thumb"><img src={assetArt(a)} alt="" /><span className="shop-pick__n" aria-hidden="true">{i + 1}</span></span>
                <span className="shop-pick__meta">
                  <span className="shop-pick__title">{a.title}</span>
                  <span className="shop-pick__by">{d ? d.name : 'You'}</span>
                </span>
                <PriceTag price={money(a.price)} was={a.was ? money(a.was) : undefined} />
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/* ---------- page ---------- */
function Shop({ param }) {
  const s = useStore();
  const isDesk = useMedia('(min-width: 1024px)');
  const [cat, setCat] = useState(CATEGORIES.some(c => c.id === param) ? param : 'all');
  const [f, setF] = useState(DEFAULTS);
  const [sort, setSort] = useState('trending');
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const set = patch => { setF(prev => ({ ...prev, ...patch })); setShown(PAGE); };
  const clear = () => { setF(DEFAULTS); setShown(PAGE); };
  useEffect(() => { if (isDesk) setDrawer(false); }, [isDesk]);

  // Category lives in the URL (#shop.ui) without remounting the page, so filters survive a category switch.
  function pickCat(id) {
    setCat(id); setShown(PAGE);
    history.replaceState(null, '', '#shop' + (id === 'all' ? '' : '.' + id));
  }

  const inCat = s.allAssets.filter(a => cat === 'all' || a.category === cat);
  const formats = useMemo(() => {
    const n = {};
    inCat.forEach(a => (a.formats || []).forEach(x => { n[x] = (n[x] || 0) + 1; }));
    f.formats.forEach(x => { if (!n[x]) n[x] = 0; });
    return Object.entries(n).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [cat, s.allAssets.length, f.formats.join()]);

  const q = f.q.trim().toLowerCase();
  const results = inCat.filter(a => {
    const p = a.price || 0;
    if (f.free ? p > 0 : (p < f.price[0] || (f.price[1] < PRICE_MAX && p > f.price[1]))) return false;
    if (f.formats.length && !(a.formats || []).some(x => f.formats.includes(x))) return false;
    if (f.rating && (a.rating || 0) < f.rating) return false;
    if (q) { const d = designer(a.by); if (!(a.title + ' ' + (a.desc || '') + ' ' + (d ? d.name : '')).toLowerCase().includes(q)) return false; }
    return true;
  }).sort(SORT_FN[sort]);

  const applied = [
    f.q.trim() && { key: 'q', label: '“' + f.q.trim() + '”', remove: () => set({ q: '' }) },
    f.free && { key: 'free', label: 'Free only', remove: () => set({ free: false }) },
    !f.free && (f.price[0] > 0 || f.price[1] < PRICE_MAX) && { key: 'price', label: usd(f.price[0]) + ' – ' + usd(f.price[1]), remove: () => set({ price: [0, PRICE_MAX] }) },
    ...f.formats.map(x => ({ key: 'f-' + x, label: x, remove: () => set({ formats: f.formats.filter(y => y !== x) }) })),
    f.rating > 0 && { key: 'rating', label: RATINGS.find(r => r.value === f.rating).label, remove: () => set({ rating: 0 }) },
  ].filter(Boolean);
  const filterCount = applied.filter(x => x.key !== 'q').length;
  const catLabel = (CATEGORIES.find(c => c.id === cat) || CATEGORIES[0]).label;
  const visible = results.slice(0, shown);

  function openFilters() { if (isDesk) setPanel(!panel); else setDrawer(true); }

  return (
    <div className="page shop">
      <header className="shop-head">
        <div className="shop-head__copy">
          <h1 className="shop-title">{cat === 'all' ? 'The shop' : catLabel}</h1>
          <p className="shop-intro">{INTRO[cat]}</p>
          <SearchField className="shop-search" size="lg" value={f.q} onChange={v => set({ q: v })} onSubmit={() => {}} shortcut={false}
            label="Search the shop" placeholder={'Search ' + inCat.length + ' ' + (cat === 'all' ? 'assets' : catLabel.toLowerCase())} />
        </div>
        <StaffPicks />
      </header>

      <div className="shop-bar">
        <Select className="shop-sort" size="sm" aria-label="Sort by" leadingIcon="arrow-up-down" value={sort} onChange={e => { setSort(e.target.value); setShown(PAGE); }} options={SORTS} />
        <div className="shop-cats" role="group" aria-label="Category">
          {CATEGORIES.map(c => <Chip key={c.id} dot={c.id === 'all' ? undefined : c.dot} selected={cat === c.id} onClick={() => pickCat(c.id)}>{c.label}</Chip>)}
        </div>
        <Button className="shop-filterbtn" variant={isDesk && panel ? 'tertiary' : 'secondary'} size="sm" leadingIcon="filter-horizontal" onClick={openFilters}
          aria-expanded={isDesk ? panel : undefined} aria-controls={isDesk ? 'shop-panel' : undefined}>
          Filters{filterCount > 0 && <span className="shop-count" aria-label={filterCount + ' applied'}>{filterCount}</span>}
        </Button>
      </div>

      {isDesk && panel && <div id="shop-panel" className="shop-panel"><FilterPanel f={f} set={set} formats={formats} idp="p" inline /></div>}

      <div className="shop-status">
        <p className="shop-found" aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? 'asset' : 'assets'}{cat !== 'all' && <> in {catLabel}</>}</p>
        {applied.length > 0 && (
          <div className="shop-applied" role="group" aria-label="Applied filters">
            {applied.map(x => <Chip key={x.key} removable onRemove={x.remove}>{x.label}</Chip>)}
            <Button variant="ghost" size="sm" onClick={clear}>Clear all</Button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="shop-empty">
          <EmptyState scene="search" headingLevel={2} title="Nothing matches all of that"
            body={applied.length ? 'Try a wider price range or fewer formats. Your filters are still here if you want them back.' : 'Nobody has listed anything in ' + catLabel + ' yet. Have a look around the rest of the shop.'}
            action={applied.length ? <Button variant="secondary" leadingIcon="refresh" onClick={clear}>Clear filters</Button> : <Button variant="secondary" onClick={() => pickCat('all')}>See every category</Button>} />
        </div>
      ) : (
        <>
          <AssetGrid items={visible} min={240} />
          <div className="shop-more-row">
            <p className="shop-more-row__count">Showing {visible.length} of {results.length}</p>
            {visible.length < results.length && <Button variant="secondary" size="lg" trailingIcon="arrow-down-01" onClick={() => setShown(shown + PAGE)}>Load {Math.min(PAGE, results.length - visible.length)} more</Button>}
          </div>
        </>
      )}

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filter assets" side={matchMedia('(max-width: 639px)').matches ? 'bottom' : 'right'} className="shop-drawer"
        footer={<><Button variant="ghost" onClick={clear} disabled={!filterCount}>Clear all</Button><Button onClick={() => setDrawer(false)}>{results.length ? 'Show ' + results.length + ' ' + (results.length === 1 ? 'asset' : 'assets') : 'No matches yet'}</Button></>}>
        <FilterPanel f={f} set={set} formats={formats} idp="d" />
      </Drawer>
    </div>
  );
}
Shop.title = 'Shop';
export default Shop;
