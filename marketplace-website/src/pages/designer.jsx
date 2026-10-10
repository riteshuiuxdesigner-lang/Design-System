import { Icon, Button, IconButton, Badge, Avatar, Tabs, Rating, Modal, Radio, Textarea, TextField, EmptyState, useState, useMemo } from '../ds.js';
import { AssetGrid, cx, compact } from '../ui/kit.jsx';
import { art } from '../art.js';
import { DESIGNERS, designer, ME, REVIEWS, money } from '../data.js';
import { useStore, go } from '../store.jsx';

/* Portfolio shots per designer: "Title|kind|color|likes". Stand-ins for uploaded case-study images. */
const WORK = {
  mira: ['Orbit, analytics overview|ui|violet|2140', 'Pocket, savings pots|mobile|lime|1820', 'Helm CRM pipeline|ui|orange|960', 'Paystack checkout refresh|mobile|yellow|1510', 'Token audit board|brand|violet|640', 'Settings, every state|ui|grey|880'],
  leo: ['Checkout flow, low-fi|mobile|grey|1320', 'Onboarding map|ui|grey|990', 'Grocery app wireframes|mobile|yellow|870', 'Admin IA sketch|ui|lime|540', 'Usability test board|poster|grey|410', 'Booking flow, v3|mobile|orange|760'],
  ana: ['Jazz at Blue Hour|poster|violet|3120', 'Swiss grid no. 12|poster|orange|2480', 'Gridlock specimen|type|ink|1660', 'Festival wristbands|brand|pink|920', 'Stockholm design week|poster|lime|1980', 'Editorial spread|type|grey|1210'],
  tomas: ['Squishy app icons|3d|pink|2860', 'Blobby hero shapes|3d|yellow|1940', 'Earbuds tumble loop|3d|violet|1420', 'Glossy badges|icons|pink|980', 'Bouncy loader|3d|lime|1150', 'Toy shop scene|scene|orange|720'],
  priya: ['Stroke icons, 2,400|icons|yellow|3410', 'Duotone set|icons|pink|1760', 'Fintech glyphs|icons|lime|1290', 'Weather pack|icons|blue|1120', 'Brand icon audit|brand|yellow|630', 'Emoji-ish reactions|icons|violet|1480'],
  jonah: ['Wobble Variable|type|lime|2210', 'Party axis demo|type|pink|1340', 'Mono for code|type|ink|980', 'Lettering for Kiosk|brand|orange|720', 'Specimen poster|poster|yellow|860', 'Display serif, draft|type|grey|540'],
  kemi: ['Hello Humans|scene|grey|3980', 'Oddballs cast|scene|violet|2650', 'Empty state, lost sock|scene|lime|1870', 'Mural for Owlet|scene|yellow|1420', 'Onboarding, step 2|mobile|pink|1100', 'Character builder|scene|orange|1560'],
  yuki: ['Kiosk brand system|brand|ink|1980', 'Mint starter|brand|lime|1240', 'Little shop logos|brand|orange|980', 'Guideline spreads|poster|grey|760', 'Packaging, tea co.|brand|pink|1120', 'Wordmark sketches|type|yellow|690'],
};
const SERVICES = {
  mira: [['Design system audit', 1800, '1 week', 'A deep look at your Figma library: naming, tokens, variants and gaps, with a prioritized fix list.'], ['Dashboard UI kit, custom', 6500, '4 weeks', 'A kit built around your data and your brand, with every state drawn.'], ['Figma variables setup', 1200, '5 days', 'Light, Dark and brand modes wired to variables your engineers can read.']],
  leo: [['UX audit + wireframes', 1500, '1 week', 'Heuristic review of one flow, then low-fi wireframes for the fix.'], ['Prototype for user tests', 2200, '2 weeks', 'A clickable prototype and a test script for five sessions.']],
  ana: [['Poster series', 3500, '3 weeks', 'Five to eight posters on one grid, with print files and social cut-downs.'], ['Editorial layout system', 4200, '4 weeks', 'Grids, type scale and templates for a magazine or report.']],
  tomas: [['3D icon set, 12 icons', 2400, '2 weeks', 'Squishy, glossy icons in your colors, with Blender source.'], ['Product hero loop', 4000, '3 weeks', 'A 10-second 4K loop of your product doing something delightful.']],
  priya: [['Custom icon set, 60 icons', 2800, '3 weeks', 'Drawn on a 24px grid, delivered as SVG, Figma components and a React package.'], ['Icon system audit', 900, '4 days', 'Consistency check of your current icons, with redraws for the worst offenders.']],
  jonah: [['Custom wordmark', 3200, '3 weeks', 'Lettering for your logo, with a few alternates and a usage sheet.'], ['Font licensing consult', 400, '1 day', 'Which licenses you actually need for apps, web and brand.']],
  kemi: [['Onboarding illustrations', 2600, '2 weeks', 'Five scenes in one style, with light and dark versions.'], ['Mascot + 6 poses', 2400, '10 days', 'A character with feelings, plus six poses in SVG.'], ['Empty-state set', 1400, '1 week', 'Eight small scenes for 404s, empty lists and errors.']],
  yuki: [['Brand identity', 2500, '2 weeks', 'Logo, color, type and a short guideline for a small, ambitious company.'], ['Brand guidelines', 3800, '3 weeks', 'A 30-page guide your whole team can use without asking.']],
};
const ABOUT = {
  mira: ['English, Yoruba', 'within 2 hours', '2021'], leo: ['Korean, English', 'within 4 hours', '2020'], ana: ['Swedish, English, German', 'within a day', '2022'],
  tomas: ['Spanish, English', 'within 3 hours', '2021'], priya: ['English, Hindi, Malayalam', 'within 2 hours', '2019'], jonah: ['German, English', 'within a day', '2022'],
  kemi: ['English', 'within an hour', '2020'], yuki: ['Japanese, English', 'within 6 hours', '2023'],
};
const ME_PROFILE = { ...ME, rate: 75, bio: 'Product designer in Lisbon. I like messy problems, calm interfaces and teams who ship weekly.', skills: ['Product design', 'Figma', 'Prototyping', 'Design systems'], followers: '312', available: true };
const STATUS = { Sent: ['info', 'mail-01', 'Waiting'], Shortlisted: ['violet', 'star', 'Shortlisted'], Hired: ['success', 'checkmark-circle-02', 'Hired'], Declined: ['neutral', 'cancel-01', 'Not picked'] };

function Shot({ title, kind, color, likes, seed }) {
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);
  const src = useMemo(() => art(kind, color, seed), [kind, color, seed]);
  return (
    <figure className="designer-shot">
      <div className="designer-shot__media"><img src={src} alt={title} loading="lazy" /></div>
      <figcaption className="designer-shot__cap">
        <span className="designer-shot__title">{title}</span>
        <button type="button" className={cx('designer-like', liked && 'is-on', pop && 'is-pop')} aria-pressed={String(liked)} aria-label={(liked ? 'Unlike ' : 'Like ') + title}
          onClick={() => { setLiked(!liked); setPop(true); setTimeout(() => setPop(false), 420); }}>
          <Icon name="favourite" size={16} /><span className="mds-num">{compact(likes + (liked ? 1 : 0))}</span>
        </button>
      </figcaption>
    </figure>
  );
}

function HireModal({ d, open, onClose, service }) {
  const s = useStore();
  const first = d.name.split(' ')[0];
  const [pick, setPick] = useState(s.myGigs.length && !service ? s.myGigs[0].id : 'new');
  const [brief, setBrief] = useState(service ? `I’d like to book your “${service[0]}” service. ` : '');
  const [budget, setBudget] = useState(service ? String(service[1]) : '');
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);
  function send() {
    const e = {};
    if (pick === 'new') {
      if (brief.trim().length < 30) e.brief = `Give ${first} a bit more to quote on: what it is, who it’s for and when you need it. At least 30 characters (you’re at ${brief.trim().length}).`;
      const b = Number(String(budget).replace(/[$,\s]/g, ''));
      if (!String(budget).trim()) e.budget = 'Add a budget so ' + first + ' knows the size of the project.';
      else if (!isFinite(b)) e.budget = 'Use numbers only, like 2500.';
      else if (b < 100) e.budget = 'Set a budget of at least $100. Projects like this usually land between $1,500 and $5,000.';
    }
    setErr(e);
    if (Object.keys(e).length) return;
    setSending(true);
    setTimeout(() => { setSending(false); onClose(true); s.toast('Invite sent to ' + first + '. Most people reply ' + ((ABOUT[d.id] || [])[1] || 'within a day') + '.'); s.celebrate(); }, 900);
  }
  return (
    <Modal open={open} onClose={() => onClose(false)} size="md" icon="mail-01" title={`Invite ${first} to a project`} primaryLabel={'Send invite'} loading={sending} onPrimary={send}>
      <div className="designer-hire">
        {s.myGigs.length > 0 && <fieldset className="designer-hire__set">
          <legend className="mds-field__label">What’s it for?</legend>
          {s.myGigs.map(g => <Radio key={g.id} name="hire-pick" label={g.title} checked={pick === g.id} onChange={() => setPick(g.id)} />)}
          <Radio name="hire-pick" label="Something new (write a short brief)" checked={pick === 'new'} onChange={() => setPick('new')} />
        </fieldset>}
        {pick === 'new' ? <>
          <Textarea label="Brief" required rows={4} maxLength={500} value={brief} onChange={e => { setBrief(e.target.value); if (err.brief) setErr(x => ({ ...x, brief: null })); }}
            placeholder={`Hi ${first}, we’re a small team building… We need… by…`} error={err.brief || undefined} helper="Say what it is, who it’s for and when you need it." />
          <TextField label="Budget" required leadingIcon="dollar-01" inputMode="numeric" placeholder="2500" value={budget} onChange={e => { setBudget(e.target.value); if (err.budget) setErr(x => ({ ...x, budget: null })); }}
            error={err.budget || undefined} helper={`${first} charges $${d.rate}/hr. Payment waits safely in escrow until you approve the work.`} />
        </> : <p className="designer-hire__note"><Icon name="information-circle" size={16} />{first} gets your gig brief, budget and deadline, and can reply with a pitch.</p>}
      </div>
    </Modal>
  );
}

function DesignerPage({ param }) {
  const s = useStore();
  const isMe = param === 'me';
  const d = isMe ? ME_PROFILE : designer(param);
  const [tab, setTab] = useState(isMe ? 'shop' : 'work');
  const [hire, setHire] = useState(null); // null | { service }
  const [invited, setInvited] = useState(false);

  if (!d) return (
    <div className="page">
      <EmptyState scene="search" headingLevel={1} title="We couldn’t find that designer" body="The link might be old, or they changed their handle. Browse everyone who’s taking work right now."
        action={<Button onClick={() => go('designers')}>Browse designers</Button>} />
    </div>
  );

  const first = d.name.split(' ')[0];
  const following = !isMe && s.isFollowing(d.id);
  const shop = isMe ? s.myAssets : s.allAssets.filter(a => a.by === d.id);
  const work = isMe ? [] : (WORK[d.id] || []).map(w => w.split('|'));
  const services = isMe ? [] : SERVICES[d.id] || [];
  const about = ABOUT[d.id] || ['English, Portuguese', 'within a few hours', '2024'];
  const myPitches = s.pitches.map(p => ({ ...p, g: s.gig(p.gigId) })).filter(p => p.g);

  const tabs = isMe
    ? [{ value: 'shop', label: 'Shop', count: shop.length }, { value: 'pitches', label: 'Pitches', count: myPitches.length }, { value: 'about', label: 'About' }]
    : [{ value: 'work', label: 'Work', count: work.length }, { value: 'shop', label: 'Shop', count: shop.length }, { value: 'services', label: 'Services', count: services.length }, { value: 'reviews', label: 'Reviews', count: d.reviews }, { value: 'about', label: 'About' }];

  function follow() { s.toggleFollow(d.id); s.toast(following ? 'Unfollowed ' + d.name : 'Following ' + d.name + '. Their new drops show up in your feed.', { variant: following ? 'neutral' : 'success' }); }

  return (
    <div className="page designer">
      <header className="designer-head">
        <div className="designer-avatar" style={{ '--ring': 'var(--' + d.color + ')' }}><Avatar initials={d.initials} color={d.color} size="lg" name={d.name} /></div>
        <div className="designer-id">
          <h1 className="designer-name">{d.name}{!isMe && d.rating >= 4.9 && <Icon name="checkmark-circle-02" size={24} label="Top creator" className="designer-verified" />}</h1>
          <p className="designer-role">{d.title} · {d.location} · <span className="designer-handle">@{d.handle}</span></p>
          <div className="designer-facts">
            {d.available ? <span className="avail"><span className="dot" />Available for work</span> : <span className="avail avail--busy">Booked until November</span>}
            {isMe ? <Badge variant="yellow" icon="sparkles">New seller</Badge> : <Rating value={d.rating} count={d.reviews} size="sm" />}
            <span className="designer-fact"><b className="mds-num">{d.followers}</b> followers</span>
            <span className="designer-fact"><b className="mds-num">${d.rate}</b>/hr</span>
            {!isMe && <span className="designer-fact"><b className="mds-num">{compact(d.sales)}</b> sales</span>}
          </div>
        </div>
        <div className="designer-actions">
          {isMe ? <>
            <Button variant="secondary" leadingIcon="edit-02" onClick={() => s.toast('Profile editing opens here in the full app. Your dashboard has everything else.', { variant: 'neutral' })}>Edit profile</Button>
            <Button leadingIcon="dashboard-square-01" onClick={() => go('dashboard')}>Dashboard</Button>
          </> : <>
            <Button variant={following ? 'tertiary' : 'secondary'} leadingIcon={following ? 'tick-02' : 'add-01'} aria-pressed={String(following)} onClick={follow}>{following ? 'Following' : 'Follow'}</Button>
            <Button leadingIcon={invited ? 'tick-02' : 'mail-01'} onClick={() => setHire({})}>{invited ? 'Invited · Invite again' : 'Hire ' + first}</Button>
          </>}
        </div>
      </header>

      <section className="designer-bio" aria-label="About">
        <p>{d.bio}</p>
        <div className="designer-skills">{d.skills.map(k => <span key={k} className="tag">{k}</span>)}</div>
      </section>

      <div className="designer-tabs"><Tabs label={'Sections of ' + first + '’s profile'} value={tab} onChange={setTab} items={tabs.map(t => ({ ...t, controls: 'designer-panel' }))} /></div>

      <div id="designer-panel" role="tabpanel" aria-label={(tabs.find(t => t.value === tab) || {}).label} className="designer-panel" key={tab}>
        {tab === 'work' && <div className="designer-work">{work.map(([t, k, c, l]) => <Shot key={t} title={t} kind={k} color={c} likes={+l} seed={d.id + t} />)}</div>}

        {tab === 'shop' && (shop.length ? <AssetGrid items={shop} /> :
          isMe ? <EmptyState scene="listings" headingLevel={2} title="Sell your first asset" body="That kit in your drafts could be paying for lunch. List it in about five minutes and keep 90% of every sale." action={<Button leadingIcon="upload-01" onClick={() => go('sell')}>Open your stall</Button>} />
            : <EmptyState scene="listings" headingLevel={2} title={first + ' hasn’t listed anything yet'} body="Follow them to hear about their first drop." action={<Button variant="secondary" onClick={follow}>{following ? 'Following' : 'Follow ' + first}</Button>} />)}

        {tab === 'services' && <div className="designer-services">{services.map(sv => (
          <article key={sv[0]} className="designer-service">
            <h2 className="designer-service__title">{sv[0]}</h2>
            <p className="designer-service__desc">{sv[3]}</p>
            <div className="designer-service__foot">
              <span className="designer-service__price">from <b className="mds-num">{money(sv[1])}</b> · {sv[2]}</span>
              <Button size="sm" variant="secondary" onClick={() => setHire({ service: sv })}>Request</Button>
            </div>
          </article>
        ))}</div>}

        {tab === 'reviews' && <div className="designer-reviews">
          <div className="designer-score"><span className="designer-score__n mds-num">{d.rating.toFixed(1)}</span><Rating value={d.rating} count={d.reviews} /><span className="designer-score__sub">from buyers and clients</span></div>
          <ul className="designer-revlist">{REVIEWS.map(r => (
            <li key={r.by} className="designer-rev">
              <Avatar initials={r.initials} color={r.color} size="sm" />
              <div className="designer-rev__body"><div className="designer-rev__top"><b>{r.by}</b><Rating value={r.rating} size="sm" /><span className="designer-rev__when">{r.when}</span></div><p>{r.text}</p></div>
            </li>
          ))}</ul>
        </div>}

        {tab === 'pitches' && (myPitches.length ? <ul className="designer-pitches">{myPitches.map(p => {
          const st = STATUS[p.status] || STATUS.Sent;
          return (
            <li key={p.gigId} className="designer-pitch">
              <Avatar initials={p.g.client.initials} color={p.g.client.color} size="sm" />
              <div className="designer-pitch__body"><a href={'#gig.' + p.gigId}>{p.g.title}</a><span>{p.g.client.name} · {p.price ? money(Number(p.price)) : 'Price on request'}{p.days ? ' · ' + p.days + ' days' : ''}</span></div>
              <Badge variant={st[0]} icon={st[1]}>{st[2]}</Badge>
            </li>
          );
        })}</ul> : <EmptyState scene="search" headingLevel={2} title="No pitches yet" body="Find a gig you’d love, tear off a tab and send a short pitch. It takes about two minutes." action={<Button variant="secondary" onClick={() => go('gigs')}>Browse gigs</Button>} />)}

        {tab === 'about' && <dl className="designer-about">
          {[['Rate', '$' + d.rate + ' per hour'], ['Usually replies', about[1]], ['Languages', about[0]], ['Based in', d.location], ['On Nudge since', about[2]], ['Followers', d.followers]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>}
      </div>

      {hire && <HireModal key={hire.service ? hire.service[0] : 'hire'} d={d} service={hire.service} open onClose={sent => { setHire(null); if (sent) setInvited(true); }} />}
    </div>
  );
}
DesignerPage.title = 'Designer';
export default DesignerPage;
