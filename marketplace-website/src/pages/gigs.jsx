import { Icon, Button, Badge, Chip, Tabs, Select, SearchField, Switch, EmptyState, useState, useMemo } from '../ds.js';
import { GigFlyer, cx } from '../ui/kit.jsx';
import { GIG_CATEGORIES, money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* ---------- small helpers, shared with gig.jsx and post.jsx ---------- */
// "Just now" / "2h ago" / "1d ago" → minutes, for sorting by newest.
export const postedMins = p => {
  if (!p || /just now/i.test(p)) return 0;
  const m = /(\d+)\s*([mhdw])/.exec(p);
  return m ? +m[1] * { m: 1, h: 60, d: 1440, w: 10080 }[m[2]] : 1e6;
};
// Rough project size so fixed and hourly gigs can share one sort (hourly ≈ 80 hours of work).
export const budgetSize = b => (b.type === 'hourly' ? b.max * 80 : b.max);
export const priceText = (n, type) => money(n) + (type === 'hourly' ? '/hr' : '');
export const timeAgo = t => {
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return Math.round(s / 60) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + 'h ago';
  return Math.round(s / 86400) + 'd ago';
};
export const TIMELINES = [
  { value: '5', label: 'Within a week' }, { value: '10', label: '10 days' }, { value: '14', label: '2 weeks' }, { value: '21', label: '3 weeks' },
  { value: '30', label: '4 weeks' }, { value: '45', label: '6 weeks' }, { value: '60', label: '2 months' }, { value: '90', label: '3 months' },
];
export const timelineLabel = days => (TIMELINES.find(t => t.value === String(days)) || { label: days + ' days' }).label;
export const pitchStatus = st => ({ Sent: ['info', 'Sent'], Viewed: ['neutral', 'Viewed'], Shortlisted: ['warning', 'Shortlisted'], Hired: ['success', 'Hired'], Declined: ['error', 'Declined'] }[st] || ['info', st || 'Sent']);

const LEVELS = [{ value: 'all', label: 'Any level' }, { value: 'Senior', label: 'Senior' }, { value: 'Mid', label: 'Mid-level' }, { value: 'Any', label: 'Open to all levels' }];
const SORTS = [{ value: 'new', label: 'Newest first' }, { value: 'budget', label: 'Biggest budget' }, { value: 'quiet', label: 'Fewest pitches' }];
const MATCH_SKILLS = ['Figma', 'Mobile', 'Brand', 'Logo', 'Illustration', 'Icons', 'Motion', 'Blender', 'Web', 'Dashboards', 'Typography', 'Design systems'];
const CAT_DOT = { 'Product design': 'pop-violet', Brand: 'pop-pink', Illustration: 'pop-lime', '3D & motion': 'pop-orange', 'Web design': 'pop-yellow', Icons: 'pop-yellow' };

const lc = s => s.toLowerCase();
const skillHit = (g, skills) => g.skills.some(k => skills.some(m => lc(k).includes(lc(m)) || lc(m).includes(lc(k))));

function YourPitches() {
  const s = useStore();
  const rows = s.pitches.map(p => ({ p, g: s.gig(p.gigId) })).filter(r => r.g);
  return (
    <section className="gigs-card" aria-labelledby="gigs-pitches-h">
      <div className="gigs-card__head">
        <h2 id="gigs-pitches-h" className="gigs-card__title">Your pitches</h2>
        {rows.length > 0 && <span className="gigs-card__count">{rows.length}</span>}
      </div>
      {rows.length === 0 ? (
        <p className="gigs-card__empty">Nothing sent yet. Hit Apply on any gig and your pitches will show up here with their status.</p>
      ) : (
        <ul className="gigs-pitches">
          {rows.map(({ p, g }) => {
            const [variant, label] = pitchStatus(p.status);
            return (
              <li key={p.gigId} className="gigs-pitch">
                <a className="gigs-pitch__title" href={'#gig.' + g.id}>{g.title}</a>
                <span className="gigs-pitch__meta">{g.client.name} · <span className="mds-num">{priceText(p.price, g.budget.type)}</span> · {timeAgo(p.at)}</span>
                <Badge variant={variant}>{label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function GetMatched({ skills, setSkills, matches, onShow }) {
  const s = useStore();
  const [email, setEmail] = useState(false);
  function toggle(k) { setSkills(cur => cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k]); }
  function flip(e) {
    const on = e.target.checked;
    if (on && !skills.length) { s.toast('Pick at least one skill first, so we know what to send you.', { variant: 'neutral' }); return; }
    setEmail(on);
    s.toast(on ? 'Done. We’ll email you new ' + skills.slice(0, 2).join(' and ') + (skills.length > 2 ? ' and more' : '') + ' gigs, usually 3–5 a week.' : 'Okay, no more gig emails.', { variant: on ? 'success' : 'neutral' });
  }
  return (
    <section className="gigs-card gigs-match" aria-labelledby="gigs-match-h">
      <span className="gigs-match__icon" aria-hidden="true"><Icon name="sparkles" variant="twotone" size={24} /></span>
      <h2 id="gigs-match-h" className="gigs-card__title">Get matched</h2>
      <p className="gigs-card__body">Pick what you’re great at. We’ll surface gigs that fit and skip the rest.</p>
      <div className="gigs-match__skills" role="group" aria-label="Your skills">
        {MATCH_SKILLS.map(k => <Chip key={k} selected={skills.includes(k)} onClick={() => toggle(k)}>{k}</Chip>)}
      </div>
      {skills.length > 0 && (
        <Button variant="secondary" size="sm" trailingIcon="arrow-right-01" onClick={onShow} disabled={!matches}>
          {matches ? 'Show ' + matches + (matches === 1 ? ' match' : ' matches') : 'No matches on the board yet'}
        </Button>
      )}
      <Switch label="Email me new gigs like these" checked={email} onChange={flip} />
    </section>
  );
}

function Gigs() {
  const s = useStore();
  const [cat, setCat] = useState('All');
  const [type, setType] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('new');
  const [q, setQ] = useState('');
  const [skills, setSkills] = useState([]);
  const [matchOnly, setMatchOnly] = useState(false);

  const items = useMemo(() => {
    const term = lc(q.trim());
    const list = s.allGigs.filter(g =>
      (cat === 'All' || g.category === cat) &&
      (type === 'all' || g.budget.type === type) &&
      (level === 'all' || g.level === level) &&
      (!matchOnly || (skills.length && skillHit(g, skills))) &&
      (!term || [g.title, g.client.name, g.category, ...g.skills].some(t => lc(t).includes(term))));
    const by = { new: (a, b) => postedMins(a.posted) - postedMins(b.posted), budget: (a, b) => budgetSize(b.budget) - budgetSize(a.budget), quiet: (a, b) => a.pitches - b.pitches }[sort];
    return list.slice().sort(by);
  }, [s.allGigs, cat, type, level, sort, q, matchOnly, skills]);

  const matches = skills.length ? s.allGigs.filter(g => skillHit(g, skills)).length : 0;
  const newest = s.allGigs.slice().sort((a, b) => postedMins(a.posted) - postedMins(b.posted))[0];
  const total = s.allGigs.filter(g => g.budget.type === 'fixed').reduce((n, g) => n + g.budget.max, 0);

  const active = [
    cat !== 'All' && { k: 'cat', label: cat, clear: () => setCat('All') },
    type !== 'all' && { k: 'type', label: type === 'fixed' ? 'Fixed price' : 'Hourly', clear: () => setType('all') },
    level !== 'all' && { k: 'level', label: LEVELS.find(l => l.value === level).label, clear: () => setLevel('all') },
    matchOnly && { k: 'match', label: 'Matches your skills', clear: () => setMatchOnly(false) },
    q.trim() && { k: 'q', label: '“' + q.trim() + '”', clear: () => setQ('') },
  ].filter(Boolean);
  function clearAll() { setCat('All'); setType('all'); setLevel('all'); setMatchOnly(false); setQ(''); }
  function showMatches() { setMatchOnly(true); setCat('All'); document.getElementById('gigs-results').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  return (
    <div className="page gigs">
      <header className="gigs-hero">
        <div className="gigs-hero__copy">
          <span className="gigs-hero__eyebrow"><span className="dot" />{s.allGigs.length} open gigs from verified clients</span>
          <h1 className="gigs-hero__title">Find your next <span className="gigs-hero__pop">gig</span></h1>
          <p className="gigs-hero__lead">Real projects with real budgets. Send a short pitch with your price and timeline. No bidding wars, no fees to apply.</p>
        </div>
        <div className="gigs-hero__side">
          <dl className="gigs-stats">
            <div><dt>Up for grabs</dt><dd className="mds-num">{money(total)}+</dd></div>
            <div><dt>First reply</dt><dd>~2h</dd></div>
          </dl>
          <Button size="lg" leadingIcon="add-01" onClick={() => go('post')}>Post a gig</Button>
        </div>
      </header>

      <div className="gigs-layout">
        <aside className="gigs-filters" aria-label="Filter gigs">
          <SearchField value={q} onChange={setQ} label="Search gigs" placeholder="Search gigs or skills" shortcut={false} className="gigs-filters__search" />
          <div className="gigs-filters__group">
            <h2 className="gigs-filters__h">Category</h2>
            <div className="gigs-filters__chips">
              {GIG_CATEGORIES.map(c => <Chip key={c} dot={c === 'All' ? undefined : CAT_DOT[c]} selected={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
            </div>
          </div>
          <div className="gigs-filters__row">
            <div className="gigs-filters__group">
              <h2 className="gigs-filters__h" id="gigs-type-h">Budget type</h2>
              <Tabs label="Budget type" value={type} onChange={setType} items={[{ value: 'all', label: 'All' }, { value: 'fixed', label: 'Fixed' }, { value: 'hourly', label: 'Hourly' }]} className="gigs-filters__tabs" />
            </div>
            <Select label="Experience level" value={level} onChange={e => setLevel(e.target.value)} options={LEVELS} className="gigs-filters__select" />
          </div>
        </aside>

        <section className="gigs-main" id="gigs-results" aria-labelledby="gigs-count">
          <div className="gigs-main__head">
            <h2 className="gigs-main__count" id="gigs-count" aria-live="polite"><span className="mds-num">{items.length}</span> {items.length === 1 ? 'gig' : 'gigs'}{active.length ? ' match' : ' on the board'}</h2>
            <Select label="Sort" size="sm" value={sort} onChange={e => setSort(e.target.value)} options={SORTS} className="gigs-sort" />
          </div>
          {active.length > 0 && (
            <div className="gigs-active" role="group" aria-label="Applied filters">
              {active.map(a => <Chip key={a.k} removable onRemove={a.clear}>{a.label}</Chip>)}
              <Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>
            </div>
          )}
          {items.length === 0 ? (
            <EmptyState scene="search" headingLevel={3} title="No gigs match those filters"
              body={'Try another category or level, or clear the filters to see all ' + s.allGigs.length + ' open gigs.'}
              action={<Button variant="secondary" onClick={clearAll}>Clear filters</Button>} />
          ) : (
            <ul className="gigs-list">
              {items.map((g, i) => (
                <li key={g.id} className={cx('gigs-list__item', newest && g.id === newest.id && 'gigs-list__item--new')} style={{ '--i': Math.min(i, 8) }}>
                  {newest && g.id === newest.id && <span className="gigs-new" aria-hidden="true"><Icon name="fire" size={16} />Newest</span>}
                  <GigFlyer g={g} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="gigs-rail" aria-label="Your gig activity">
          <YourPitches />
          <GetMatched skills={skills} setSkills={setSkills} matches={matches} onShow={showMatches} />
          <section className="gigs-card gigs-hire">
            <h2 className="gigs-card__title">Hiring instead?</h2>
            <p className="gigs-card__body">Post a gig in about four minutes. Most clients get a first pitch within two hours.</p>
            <Button variant="tertiary" size="sm" trailingIcon="arrow-right-01" onClick={() => go('post')}>Post a gig</Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
Gigs.title = 'Gigs';
export default Gigs;
