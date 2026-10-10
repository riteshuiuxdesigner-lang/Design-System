import { Button, Chip, Switch, Select, SearchField, EmptyState, useState } from '../ds.js';
import { DesignerTile, assetArt } from '../ui/kit.jsx';
import { DESIGNERS, asset } from '../data.js';

/* Skill groups: each chip matches any of these skills. */
const SKILLS = [
  { id: 'all', label: 'All skills', dot: 'text-primary', match: [] },
  { id: 'product', label: 'UI & systems', dot: 'pop-violet', match: ['Design systems', 'Figma', 'SaaS UI', 'Dashboards'] },
  { id: 'ux', label: 'UX & wireframes', dot: 'pop-orange', match: ['Wireframing', 'UX', 'Prototyping'] },
  { id: 'brand', label: 'Brand', dot: 'pop-pink', match: ['Brand identity', 'Logo', 'Guidelines', 'Brand'] },
  { id: 'illustration', label: 'Illustration', dot: 'pop-lime', match: ['Illustration', 'Characters', 'Onboarding art'] },
  { id: 'icons', label: 'Icons', dot: 'pop-yellow', match: ['Icons', '3D icons'] },
  { id: '3d', label: '3D & motion', dot: 'pop-pink', match: ['Blender', '3D icons', 'Motion'] },
  { id: 'type', label: 'Type & print', dot: 'pop-violet', match: ['Type design', 'Lettering', 'Variable fonts', 'Typography', 'Editorial', 'Print'] },
];
const SORTS = [{ value: 'rating', label: 'Top rated' }, { value: 'sales', label: 'Most sales' }, { value: 'rate', label: 'Rate: low to high' }];

function Designers() {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('all');
  const [avail, setAvail] = useState(false);
  const [sort, setSort] = useState('rating');

  const needle = q.trim().toLowerCase();
  const group = SKILLS.find(k => k.id === skill);
  let list = DESIGNERS.filter(d =>
    (!needle || [d.name, d.title, d.location, d.handle, ...d.skills].some(x => x.toLowerCase().includes(needle))) &&
    (skill === 'all' || d.skills.some(k => group.match.includes(k))) &&
    (!avail || d.available));
  list = [...list].sort(sort === 'rating' ? (a, b) => b.rating - a.rating || b.reviews - a.reviews : sort === 'sales' ? (a, b) => b.sales - a.sales : (a, b) => a.rate - b.rate);
  const filtered = needle || skill !== 'all' || avail;
  const open = DESIGNERS.filter(d => d.available).length;
  const fan = ['orbit', 'hello', 'stroke'].map(asset).filter(Boolean);

  function clear() { setQ(''); setSkill('all'); setAvail(false); }

  return (
    <div className="page designers">
      <header className="designers-head">
        <div className="designers-head__copy">
          <span className="designers-eyebrow"><span className="dot" />{open} designers taking new work this week</span>
          <h1 className="designers-title">Hire designers who’ve shipped it before</h1>
          <p className="designers-lead">Browse portfolios, compare rates and message people directly. No agency markup, no bidding wars.</p>
        </div>
        <div className="designers-fan" aria-hidden="true">
          {fan.map((a, i) => <img key={a.id} src={assetArt(a)} alt="" className={'designers-fan__img designers-fan__img--' + i} />)}
        </div>
      </header>

      <div className="designers-bar">
        <SearchField value={q} onChange={setQ} shortcut={false} label="Search designers" placeholder="Search by name, skill or city" className="designers-search" />
        <div className="designers-bar__right">
          <Switch label="Available now" checked={avail} onChange={e => setAvail(e.target.checked)} />
          <Select aria-label="Sort designers" value={sort} onChange={e => setSort(e.target.value)} options={SORTS} leadingIcon="arrow-up-down" className="designers-sort" />
        </div>
      </div>
      <div className="chips designers-chips" role="group" aria-label="Filter by skill">
        {SKILLS.map(k => <Chip key={k.id} dot={k.dot} selected={skill === k.id} onClick={() => setSkill(k.id)}>{k.label}</Chip>)}
      </div>

      <div className="designers-meta">
        <p className="designers-count" aria-live="polite">{list.length === DESIGNERS.length ? `All ${list.length} designers` : `${list.length} of ${DESIGNERS.length} designers`}</p>
        {filtered && list.length > 0 && <Button variant="tertiary" size="sm" leadingIcon="cancel-01" onClick={clear}>Clear filters</Button>}
      </div>

      {list.length ? <div className="tgrid designers-grid">{list.map((d, i) => <div key={d.id} className="designers-cell" style={{ '--i': i }}><DesignerTile d={d} /></div>)}</div>
        : <EmptyState scene="search" headingLevel={2} title="No one matches that yet"
          body={needle ? `Nobody on Nudge lists “${q.trim()}”${avail ? ' and is free right now' : ''}. Try a broader skill, or turn off Available now.` : 'Try another skill, or turn off Available now to see designers who are booked.'}
          action={<Button variant="secondary" onClick={clear}>Clear filters</Button>} />}
    </div>
  );
}
Designers.title = 'Hire designers';
export default Designers;
