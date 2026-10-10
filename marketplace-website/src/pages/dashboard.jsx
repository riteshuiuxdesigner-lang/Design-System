import { Icon, Button, IconButton, Badge, Avatar, Tabs, SidebarNav, StatTile, Table, Tooltip, ProgressBar, Modal, EmptyState, useState, useMemo } from '../ds.js';
import { AssetGrid, assetArt, cx } from '../ui/kit.jsx';
import { ME, money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* ---------- Sam's seeded history: freelance work done through Nudge. Listings come only from the store. ---------- */
const WEEKLY = [420, 610, 380, 920, 1240, 760, 1480, 990, 1320, 1710, 1150, 1240]; // last 12 weeks, oldest first
const PAYMENTS = [
  { id: 'p9', date: 'Oct 8', item: 'Booking flow redesign · milestone 2 of 3', who: 'Fernway Travel', initials: 'FT', color: 'pop-lime', type: 'Gig', amount: 1240 },
  { id: 'p8', date: 'Oct 1', item: 'Invoice templates · final delivery', who: 'Tidy Books', initials: 'TB', color: 'pop-violet', type: 'Gig', amount: 850 },
  { id: 'p7', date: 'Sep 29', item: 'Invoice templates · milestone 1', who: 'Tidy Books', initials: 'TB', color: 'pop-violet', type: 'Gig', amount: 300 },
  { id: 'p6', date: 'Sep 24', item: 'App icon and splash screen', who: 'Oddly Coffee', initials: 'OC', color: 'pop-orange', type: 'Gig', amount: 1710 },
  { id: 'p5', date: 'Sep 16', item: 'Booking flow redesign · milestone 1 of 3', who: 'Fernway Travel', initials: 'FT', color: 'pop-lime', type: 'Gig', amount: 1320 },
  { id: 'p4', date: 'Sep 9', item: 'Reminder flows, discovery sprint', who: 'Kite Health', initials: 'KH', color: 'pop-pink', type: 'Gig', amount: 990 },
  { id: 'p3', date: 'Sep 2', item: 'Landing page tweaks · tip included', who: 'Jotter', initials: 'JT', color: 'pop-yellow', type: 'Gig', amount: 1480 },
];
const PROJECTS = [
  { id: 'fernway', client: 'Fernway Travel', initials: 'FT', color: 'pop-lime', title: 'Booking flow redesign', price: 3960, status: 'Hired', progress: 66, due: 'Oct 24', next: 'Milestone 3: hi-fi prototype' },
  { id: 'kite', client: 'Kite Health', initials: 'KH', color: 'pop-pink', title: 'Appointment reminders for iOS', price: 2200, status: 'Hired', progress: 30, due: 'Nov 7', next: 'Wireframes review on Tuesday' },
  { id: 'tidy', client: 'Tidy Books', initials: 'TB', color: 'pop-violet', title: 'Invoice templates', price: 1150, status: 'Completed' },
  { id: 'oddly', client: 'Oddly Coffee', initials: 'OC', color: 'pop-orange', title: 'App icon and splash screen', price: 1710, status: 'Completed' },
  { id: 'northwind', client: 'Northwind Labs', initials: 'NL', color: 'pop-yellow', title: 'Pitch deck refresh', price: 1800, status: 'Not picked' },
  { id: 'parcel', client: 'Parcelly', initials: 'PA', color: 'pop-lime', title: 'Driver app audit', price: 2400, status: 'Not picked' },
  { id: 'loom', client: 'Loomwork', initials: 'LW', color: 'pop-violet', title: 'Marketing site, 6 pages', price: 3200, status: 'Not picked' },
];
const PAYOUTS = [
  { id: 'po3', date: 'Oct 5', amount: 1150, status: 'Paid' },
  { id: 'po2', date: 'Sep 28', amount: 1710, status: 'Paid' },
  { id: 'po1', date: 'Sep 21', amount: 1320, status: 'Paid' },
];
const BADGE = { Sent: ['info', 'mail-01', 'Waiting to hear back'], Hired: ['violet', 'rocket-01', 'In progress'], Completed: ['success', 'checkmark-circle-02', 'Completed'], 'Not picked': ['neutral', 'cancel-01', 'Not picked'], Shortlisted: ['yellow', 'star', 'Shortlisted'] };
const VIEWS = [
  { label: 'Overview', icon: 'dashboard-square-01' }, { label: 'Listings', icon: 'package' }, { label: 'Sales', icon: 'shopping-bag-01' },
  { label: 'Pitches', icon: 'message-01' }, { label: 'Payouts', icon: 'dollar-01' },
];
const cash = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const short = n => n >= 1000 ? '$' + (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k' : '$' + n;

function weeks() {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday this week
  return WEEKLY.map((v, i) => { const w = new Date(d); w.setDate(d.getDate() - (WEEKLY.length - 1 - i) * 7); return { v, label: w.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }; });
}

/* ---------- Earnings chart: one series, ink bars, this week in lime, values on hover and focus. ---------- */
function EarningsChart() {
  const data = useMemo(weeks, []);
  const max = Math.ceil(Math.max(...WEEKLY) / 1000) * 1000;
  const ticks = [max, max / 2, 0];
  const total = WEEKLY.reduce((a, b) => a + b, 0);
  return (
    <figure className="dash-chart">
      <figcaption className="dash-chart__head">
        <div><h2 className="dash-h2">Earnings</h2><p className="dash-sub">Weekly, last 12 weeks · <b className="mds-num">{cash(total)}</b> in total</p></div>
        <span className="dash-chart__legend"><span className="dash-chart__key" />This week</span>
      </figcaption>
      <div className="dash-chart__plot">
        <span className="dash-chart__ylabel">USD</span>
        <div className="dash-chart__grid" aria-hidden="true">{ticks.map(t => <div key={t} className="dash-chart__tick"><span>{short(t)}</span></div>)}</div>
        <ol className="dash-chart__bars" aria-label="Weekly earnings">
          {data.map((w, i) => {
            const now = i === data.length - 1;
            return (
              <li key={w.label} className="dash-chart__col">
                <div className="dash-chart__track">
                  {now && <span className="dash-chart__val mds-num" style={{ bottom: (w.v / max * 100) + '%' }}>{short(w.v)}</span>}
                  <div className="dash-chart__fill" style={{ height: (w.v / max * 100) + '%', '--d': i * 30 + 'ms' }}>
                    <Tooltip content={`Week of ${w.label}: ${cash(w.v)}`}>
                      <button type="button" className={cx('dash-chart__bar', now && 'is-now')} aria-label={`Week of ${w.label}: ${cash(w.v)}${now ? ', this week' : ''}`} />
                    </Tooltip>
                  </div>
                </div>
                <span className={cx('dash-chart__x', i % 2 === 1 && 'dash-chart__x--odd')} aria-hidden="true">{w.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="dash-chart__xlabel">Week starting</p>
    </figure>
  );
}

function PayTable({ rows, compact }) {
  return <Table label="Recent sales" rowKey="id" rows={rows} empty="No sales match this filter yet."
    columns={[
      { key: 'item', label: 'Sale', render: r => <span className="dash-cell"><Avatar size="xs" initials={r.initials} color={r.color} /><span className="dash-cell__text"><b>{r.item}</b><small>{r.who}{compact ? ' · ' + r.date : ''}</small></span></span> },
      ...(compact ? [] : [{ key: 'type', label: 'Type', render: r => <Badge variant={r.type === 'Gig' ? 'neutral' : 'yellow'} icon={r.type === 'Gig' ? 'message-01' : 'package'}>{r.type === 'Gig' ? 'Gig' : 'Asset'}</Badge> }]),
      ...(compact ? [] : [{ key: 'date', label: 'Date' }]),
      { key: 'amount', label: 'You earned', numeric: true, render: r => cash(r.amount) },
    ]} />;
}

function Projects({ list }) {
  return <div className="dash-projects">{list.map(p => (
    <article key={p.id} className="dash-project">
      <div className="dash-project__top"><Avatar size="sm" initials={p.initials} color={p.color} /><div className="dash-project__id"><b>{p.title}</b><span>{p.client} · {money(p.price)} · due {p.due}</span></div></div>
      <ProgressBar value={p.progress} label={p.next} />
    </article>
  ))}</div>;
}

function PitchList({ list }) {
  return <ul className="dash-pitches">{list.map(p => {
    const b = BADGE[p.status] || BADGE.Sent;
    return (
      <li key={p.id} className="dash-pitch">
        <Avatar size="sm" initials={p.initials} color={p.color} />
        <div className="dash-pitch__body">{p.href ? <a href={p.href}>{p.title}</a> : <b>{p.title}</b>}<span>{p.client} · {p.price ? money(p.price) : 'Price on request'}</span></div>
        <Badge variant={b[0]} icon={b[1]}>{b[2]}</Badge>
      </li>
    );
  })}</ul>;
}

function Dashboard({ param }) {
  const s = useStore();
  const start = VIEWS.find(v => v.label.toLowerCase() === param);
  const [view, setView] = useState(start ? start.label : 'Overview');
  const [balance, setBalance] = useState(1240);
  const [payouts, setPayouts] = useState(PAYOUTS);
  const [confirm, setConfirm] = useState(false);
  const [paying, setPaying] = useState(false);
  const [milestone, setMilestone] = useState(true);
  const [salesFilter, setSalesFilter] = useState('all');

  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const first = ME.name.split(' ')[0];
  const mine = s.myAssets;
  const assetSales = mine.reduce((n, a) => n + (a.sales || 0), 0);
  const live = s.pitches.map(p => { const g = s.gig(p.gigId); return g && { id: 'live-' + p.gigId, title: g.title, client: g.client.name, initials: g.client.initials, color: g.client.color, price: Number(p.price) || 0, status: p.status || 'Sent', href: '#gig.' + p.gigId }; }).filter(Boolean);
  const allPitches = [...live, ...PROJECTS];
  const won = PROJECTS.filter(p => p.status === 'Hired' || p.status === 'Completed').length;
  const decided = PROJECTS.length;
  const active = PROJECTS.filter(p => p.status === 'Hired');
  const total = WEEKLY.reduce((a, b) => a + b, 0);
  const prev = 8860;
  const sales = PAYMENTS.length + assetSales;
  const rows = PAYMENTS.filter(r => salesFilter === 'all' || (salesFilter === 'gigs' ? r.type === 'Gig' : r.type !== 'Gig'));

  function withdraw() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false); setConfirm(false);
      setPayouts(p => [{ id: 'po' + Date.now(), date: 'Today', amount: balance, status: 'On its way' }, ...p]);
      s.toast(cash(balance) + ' is on its way. It lands in 1–2 business days.');
      setBalance(0);
    }, 1000);
  }

  const payoutCard = (
    <section className="dash-card dash-payout" aria-labelledby="dash-payout-h">
      <span className="dash-payout__icon"><Icon name="dollar-01" variant="twotone" size={24} /></span>
      <h2 id="dash-payout-h" className="dash-payout__label">{balance ? 'Next payout Monday' : 'Nothing to pay out'}</h2>
      <p className="dash-payout__amount mds-num">{cash(balance)}</p>
      <p className="dash-sub">{balance ? 'Lands automatically every Monday, or withdraw it now.' : 'Your next sale or milestone lands here.'}</p>
      <Button leadingIcon="download-01" onClick={() => setConfirm(true)} disabled={!balance}>Withdraw</Button>
    </section>
  );

  const listings = mine.length ? <AssetGrid items={view === 'Overview' ? mine.slice(0, 4) : mine} min={220} />
    : <div className="dash-card"><EmptyState scene="listings" headingLevel={3} title="No listings yet" body="List a kit, a font or an icon set in about five minutes. You keep 90% of every sale." action={<Button leadingIcon="upload-01" onClick={() => go('sell')}>Open your stall</Button>} /></div>;

  return (
    <div className="page dash">
      <aside className="dash-side">
        <SidebarNav label="Dashboard" value={view} onChange={setView} sections={[{ label: 'Your studio', items: VIEWS }]} user={{ name: ME.name, initials: ME.initials, color: ME.color, plan: 'Seller · Freelancer' }} />
      </aside>

      <div className="dash-main">
        <header className="dash-head">
          <div className="dash-head__copy">
            <h1 className="dash-title">{view === 'Overview' ? `${hello}, ${first}` : view}</h1>
            <p className="dash-lead">{view === 'Overview' ? `You earned ${cash(WEEKLY[WEEKLY.length - 1])} this week, and Fernway’s milestone 3 is due in two weeks.` :
              view === 'Listings' ? 'Everything you sell in the shop.' : view === 'Sales' ? 'Every payment from gigs and the shop, newest first.' : view === 'Pitches' ? 'Gigs you’ve pitched for and projects you’re working on.' : 'Money on its way to you, and money already home.'}</p>
          </div>
          <div className="dash-head__actions">
            <Button variant="secondary" leadingIcon="search-01" onClick={() => go('gigs')}>Find gigs</Button>
            <Button leadingIcon="upload-01" onClick={() => go('sell')}>New listing</Button>
          </div>
        </header>

        <div className="dash-tabs"><Tabs label="Dashboard sections" value={view} onChange={setView} items={VIEWS.map(v => ({ value: v.label, label: v.label }))} /></div>

        <div className="dash-view" key={view}>
          {view === 'Overview' && <>
            {milestone && <section className="dash-milestone" aria-label="Milestone">
              <button type="button" className="dash-milestone__badge" onClick={() => { s.celebrate(); s.toast('Here’s to the next $10k.'); }} aria-label="Celebrate your $10k milestone"><b>$10k</b><small>earned</small></button>
              <div className="dash-milestone__text"><h2 className="dash-h2">You passed $10,000 on Nudge</h2><p className="dash-sub">It happened last week, right as the Tidy Books templates shipped. Tap the sticker, you’ve earned it.</p></div>
              <IconButton size="sm" icon="cancel-01" label="Hide milestone" onClick={() => setMilestone(false)} />
            </section>}

            <div className="dash-stats">
              <StatTile label="Revenue" value={'$' + total.toLocaleString('en-US')} change={'+' + Math.round((total - prev) / prev * 100) + '% vs previous 12 weeks'} trend="up" icon="dollar-01" color="pop-lime" />
              <StatTile label="Sales" value={String(sales)} change={assetSales ? assetSales + ' from your listings' : mine.length ? 'Your listings are live. First sale soon.' : 'All from gigs. List an asset to sell too.'} icon="shopping-bag-01" color="pop-yellow" />
              <StatTile label="Pitch win rate" value={Math.round(won / decided * 100) + '%'} change={live.length ? live.length + ' pitch' + (live.length > 1 ? 'es' : '') + ' waiting to hear back' : won + ' of ' + decided + ' pitches won'} icon="message-01" color="pop-violet" />
              <StatTile label="Rating" value="4.9" change="from 23 client reviews" icon="star" color="pop-pink" />
            </div>

            <div className="dash-row">
              <div className="dash-card dash-card--chart"><EarningsChart /></div>
              {payoutCard}
            </div>

            <section className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-h2">Recent sales</h2><Button variant="tertiary" size="sm" trailingIcon="arrow-right-01" onClick={() => setView('Sales')}>All sales</Button></div>
              <PayTable rows={PAYMENTS.slice(0, 4)} compact />
            </section>

            <section className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-h2">Active projects</h2><Button variant="tertiary" size="sm" trailingIcon="arrow-right-01" onClick={() => setView('Pitches')}>All pitches</Button></div>
              <Projects list={active} />
            </section>

            <section className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-h2">Your listings</h2>{mine.length > 0 && <Button variant="tertiary" size="sm" trailingIcon="arrow-right-01" onClick={() => setView('Listings')}>Manage listings</Button>}</div>
              {listings}
            </section>
          </>}

          {view === 'Listings' && <>
            {mine.length > 0 && <Table label="Your listings" rowKey="id" rows={mine} columns={[
              { key: 'title', label: 'Listing', render: a => <span className="dash-cell"><img className="dash-thumb" src={assetArt(a)} alt="" /><span className="dash-cell__text"><a href={'#asset.' + a.id}>{a.title}</a><small>Updated {a.updated}</small></span></span> },
              { key: 'status', label: 'Status', render: () => <Badge variant="success" icon="checkmark-circle-02">Live</Badge> },
              { key: 'price', label: 'Price', numeric: true, render: a => money(a.price) },
              { key: 'sales', label: 'Sales', numeric: true, render: a => String(a.sales || 0) },
            ]} />}
            <section className="dash-sec">{mine.length > 0 && <div className="dash-sec__head"><h2 className="dash-h2">How they look in the shop</h2></div>}{listings}</section>
          </>}

          {view === 'Sales' && <>
            <div className="dash-filter"><Tabs label="Filter sales" value={salesFilter} onChange={setSalesFilter} items={[{ value: 'all', label: 'All', count: PAYMENTS.length + assetSales }, { value: 'gigs', label: 'Gigs', count: PAYMENTS.length }, { value: 'assets', label: 'Assets', count: assetSales }]} /></div>
            {salesFilter === 'assets' && !rows.length ? <div className="dash-card"><EmptyState scene="listings" headingLevel={2} title={mine.length ? 'No asset sales yet' : 'Nothing in the shop yet'}
              body={mine.length ? 'Your listings are live. Share them on your socials to get the first sale moving.' : 'List an asset and its sales show up here, next to your gig payments.'}
              action={mine.length ? <Button variant="secondary" onClick={() => go('designer', 'me')}>View your profile</Button> : <Button leadingIcon="upload-01" onClick={() => go('sell')}>Open your stall</Button>} /></div>
              : <PayTable rows={rows} />}
          </>}

          {view === 'Pitches' && <>
            <section className="dash-sec dash-sec--first"><div className="dash-sec__head"><h2 className="dash-h2">Active projects</h2></div><Projects list={active} /></section>
            <section className="dash-sec"><div className="dash-sec__head"><h2 className="dash-h2">All pitches</h2><Button variant="tertiary" size="sm" trailingIcon="arrow-right-01" onClick={() => go('gigs')}>Find more gigs</Button></div><PitchList list={allPitches} /></section>
          </>}

          {view === 'Payouts' && <div className="dash-row dash-row--payouts">
            {payoutCard}
            <Table label="Payout history" rowKey="id" rows={payouts} columns={[
              { key: 'date', label: 'Date' },
              { key: 'status', label: 'Status', render: r => <Badge variant={r.status === 'Paid' ? 'success' : 'info'} icon={r.status === 'Paid' ? 'checkmark-circle-02' : 'refresh'}>{r.status}</Badge> },
              { key: 'amount', label: 'Amount', numeric: true, render: r => cash(r.amount) },
            ]} />
          </div>}
        </div>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} icon="dollar-01" title={`Withdraw ${cash(balance)} now?`} primaryLabel={'Withdraw ' + cash(balance)} loading={paying} onPrimary={withdraw}>
        It goes to the bank account on your payout settings and lands in 1–2 business days. Withdrawing early is free.
      </Modal>
    </div>
  );
}
Dashboard.title = 'Dashboard';
export default Dashboard;
