import { Icon, Button, IconButton, Badge, Avatar, AvatarGroup, TextField, Select, Textarea, FileUpload, FileRow, EmptyState, Alert, Divider, useState, useEffect, useRef } from '../ds.js';
import { GigFlyer, Crumbs, Done, cx } from '../ui/kit.jsx';
import { DESIGNERS, ME, budgetText, money } from '../data.js';
import { useStore, go } from '../store.jsx';
import { TIMELINES, timelineLabel, priceText, timeAgo, pitchStatus } from './gigs.jsx';

const NOTE_MIN = 40, NOTE_MAX = 600, MAX_FILES = 3, MAX_MB = 50;
const hash = str => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const memberSince = c => c.spent === 'New client' ? 'Joined this month' : 'Member since ' + (2019 + (hash(c.name) % 6));
const replyTime = c => c.spent === 'New client' ? 'Usually replies within a day' : ['Usually replies within 2 hours', 'Usually replies within 4 hours', 'Usually replies same day'][hash(c.name) % 3];
const fmtSize = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const looksLikeLink = v => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.trim());

/* Validate a price against the gig budget. Returns { error } or { note } (a gentle heads-up). */
function checkPrice(raw, g) {
  const v = String(raw || '').replace(/[\s,$]/g, '');
  const unit = g.budget.type === 'hourly' ? 'hourly rate' : 'price';
  if (!v) return { error: 'Add your ' + unit + ' so ' + g.client.name + ' can compare pitches.' };
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return { error: 'Use numbers only, like ' + (g.budget.type === 'hourly' ? '90' : '4500') + '. Leave out letters and symbols.' };
  const n = +v, { min, max, type } = g.budget, lo = Math.ceil(min * 0.5), hi = Math.floor(max * 1.5);
  if (n < lo) return { error: 'That’s well under the ' + budgetText(g.budget) + ' budget. Pitch at least ' + priceText(lo, type) + '. Very low prices make clients nervous.' };
  if (n > hi) return { error: 'That’s more than 50% over the ' + budgetText(g.budget) + ' budget. Pitch ' + priceText(hi, type) + ' or less, or offer a smaller first phase.' };
  if (n < min) return { n, note: 'A little under budget. That’s fine, but don’t undersell yourself.' };
  if (n > max) return { n, note: 'A little over budget. Say why in your note, like extra scope or rush delivery.' };
  return { n, note: 'Right inside the budget. Nice.' };
}

function Fact({ icon, label, value, sub }) {
  return (
    <div className="gig-fact">
      <span className="gig-fact__icon" aria-hidden="true"><Icon name={icon} size={20} /></span>
      <div className="gig-fact__text"><span className="gig-fact__label">{label}</span><span className="gig-fact__value">{value}</span>{sub && <span className="gig-fact__sub">{sub}</span>}</div>
    </div>
  );
}

function ClientCard({ g }) {
  const c = g.client;
  return (
    <section className="gig-client" aria-label="About the client">
      <Avatar initials={c.initials} color={c.color} size="lg" />
      <div className="gig-client__who">
        <div className="gig-client__name">{c.name}{c.verified && <Icon name="checkmark-circle-02" size={20} label="Verified client" />}</div>
        <div className="gig-client__meta">Posted by {c.person}</div>
      </div>
      <dl className="gig-client__stats">
        <div><dt>Spent on Nudge</dt><dd>{c.spent === 'New client' ? 'New client' : c.spent.replace(' spent', '')}</dd></div>
        <div><dt>On Nudge</dt><dd>{memberSince(c).replace('Member since ', 'Since ')}</dd></div>
        <div><dt>Payment</dt><dd>{c.verified ? 'Verified' : 'Pending check'}</dd></div>
      </dl>
      <p className="gig-client__reply"><Icon name="message-01" size={16} />{replyTime(c)}</p>
    </section>
  );
}

/* ---------- pitch form ---------- */
function PitchForm({ g, existing, onSent, onCancel, autoFocus }) {
  const s = useStore();
  const hourly = g.budget.type === 'hourly';
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [days, setDays] = useState(existing ? String(existing.days) : '');
  const [note, setNote] = useState(existing ? existing.note : '');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState(existing ? (existing.files || []).filter(f => f.kind === 'link').map(f => f.name) : []);
  const [files, setFiles] = useState(existing ? (existing.files || []).filter(f => f.kind === 'file').map((f, i) => ({ id: 'e' + i, name: f.name, size: f.size || 0, progress: 100, status: 'complete' })) : []);
  const [errs, setErrs] = useState({});
  const [uploadErr, setUploadErr] = useState('');
  const [sending, setSending] = useState(false);
  const timers = useRef({});
  const priceCheck = checkPrice(price, g);

  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), []);
  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => {
      const panel = document.getElementById('pitch'), el = document.getElementById('pitch-price');
      if (el) el.focus({ preventScroll: true });
      if (!panel) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hdr = document.querySelector('.hdr');
      const top = () => Math.max(0, panel.getBoundingClientRect().top + scrollY - (hdr ? hdr.offsetHeight : 0) - 16);
      window.scrollTo({ top: top(), behavior: reduce ? 'auto' : 'smooth' });
      // A smooth scroll can be cut short by late layout (fonts, images). Land it for sure.
      setTimeout(() => { if (Math.abs(scrollY - top()) > 40) window.scrollTo({ top: top(), behavior: 'auto' }); }, 900);
    }, 120);
    return () => clearTimeout(t);
  }, [autoFocus]);

  function noteError(v) {
    const t = v.trim();
    if (!t) return 'Write a short cover note. It’s the first thing ' + g.client.person.split(' ')[0] + ' reads.';
    if (t.length < NOTE_MIN) return 'Add ' + (NOTE_MIN - t.length) + ' more characters. Clients skip pitches that don’t mention their project, so say what you’d do first.';
    return '';
  }
  function validate() {
    const e = {};
    if (priceCheck.error) e.price = priceCheck.error;
    if (!days) e.days = 'Pick a timeline so the client knows when to expect the work.';
    const ne = noteError(note); if (ne) e.note = ne;
    if (files.some(f => f.status === 'uploading')) e.files = 'Wait for your files to finish uploading, then send.';
    return e;
  }

  function addLink() {
    const v = link.trim();
    if (!v) { setErrs(e => ({ ...e, link: 'Paste a link first, like dribbble.com/you.' })); return; }
    if (!looksLikeLink(v)) { setErrs(e => ({ ...e, link: 'That doesn’t look like a link. Try something like behance.net/you/project.' })); return; }
    if (links.includes(v)) { setErrs(e => ({ ...e, link: 'You already added that link.' })); return; }
    if (links.length >= 3) { setErrs(e => ({ ...e, link: 'Three links is plenty. Remove one to add another.' })); return; }
    setLinks(l => [...l, v]); setLink(''); setErrs(e => ({ ...e, link: '' }));
  }

  function onFiles(list) {
    setUploadErr('');
    const room = MAX_FILES - files.length;
    if (room <= 0) { setUploadErr('You can attach up to ' + MAX_FILES + ' files. Remove one to add another.'); return; }
    const tooBig = list.find(f => f.size > MAX_MB * 1048576);
    if (tooBig) setUploadErr(tooBig.name + ' is ' + fmtSize(tooBig.size) + '. Files can be up to ' + MAX_MB + ' MB.');
    const ok = list.filter(f => f.size <= MAX_MB * 1048576);
    if (ok.length > room) setUploadErr('Only ' + MAX_FILES + ' files per pitch, so we added the first ' + room + '.');
    ok.slice(0, room).forEach(f => {
      const id = Math.random().toString(36).slice(2);
      setFiles(cur => [...cur, { id, name: f.name, size: f.size, progress: 4, status: 'uploading' }]);
      timers.current[id] = setInterval(() => {
        setFiles(cur => cur.map(x => {
          if (x.id !== id) return x;
          const p = Math.min(100, x.progress + 8 + Math.random() * 22);
          if (p >= 100) { clearInterval(timers.current[id]); delete timers.current[id]; return { ...x, progress: 100, status: 'complete' }; }
          return { ...x, progress: p };
        }));
      }, 240);
    });
    setErrs(e => ({ ...e, files: '' }));
  }
  function removeFile(id) { clearInterval(timers.current[id]); delete timers.current[id]; setFiles(cur => cur.filter(f => f.id !== id)); setUploadErr(''); }

  function submit(e) {
    e.preventDefault();
    const found = validate();
    setErrs(found);
    const first = ['price', 'days', 'note'].find(k => found[k]);
    if (first) { const el = document.getElementById('pitch-' + first); if (el) el.focus(); return; }
    if (found.files) return;
    setSending(true);
    setTimeout(() => {
      const payload = { gigId: g.id, price: priceCheck.n, days: +days, note: note.trim(), files: [...links.map(name => ({ kind: 'link', name })), ...files.map(f => ({ kind: 'file', name: f.name, size: f.size }))] };
      s.pitch(payload);
      setSending(false);
      onSent(!!existing);
    }, 900);
  }

  const unit = hourly ? '/hr' : '';
  return (
    <form className="gig-form" onSubmit={submit} noValidate aria-labelledby="pitch-h">
      <div className="gig-form__head">
        <h2 className="gig-form__title" id="pitch-h">{existing ? 'Edit your pitch' : 'Pitch for this gig'}</h2>
        <p className="gig-form__sub">Short and specific wins. Pitches are free to send.</p>
      </div>
      <TextField id="pitch-price" label={hourly ? 'Your hourly rate' : 'Your price'} required leadingIcon="dollar-01" inputMode="decimal" autoComplete="off"
        placeholder={hourly ? String(g.budget.min + 10) : String(Math.round((g.budget.min + g.budget.max) / 2))}
        value={price} onChange={e => { setPrice(e.target.value); if (errs.price) setErrs(x => ({ ...x, price: checkPrice(e.target.value, g).error || '' })); }}
        onBlur={() => price && setErrs(x => ({ ...x, price: priceCheck.error || '' }))}
        error={errs.price} helper={price && !priceCheck.error ? priceCheck.note : 'Client’s budget: ' + budgetText(g.budget) + '. You keep 100%; the fee is on the client.'} />
      <Select id="pitch-days" label="Timeline" required placeholder="How long will it take?" value={days} options={TIMELINES}
        onChange={e => { setDays(e.target.value); setErrs(x => ({ ...x, days: '' })); }} error={errs.days} helper={'The client expects ' + g.duration + '.'} />
      <Textarea id="pitch-note" label="Cover note" required rows={6} maxLength={NOTE_MAX} value={note}
        placeholder={'Hi ' + g.client.person.split(' ')[0] + ', I’d start by…'}
        onChange={e => { setNote(e.target.value); if (errs.note) setErrs(x => ({ ...x, note: noteError(e.target.value) })); }}
        onBlur={() => note && setErrs(x => ({ ...x, note: noteError(note) }))}
        error={errs.note} helper={'Say what you’d do first and point to one similar project. ' + NOTE_MIN + ' characters minimum.'} />

      <fieldset className="gig-form__attach">
        <legend className="mds-field__label">Show your work <span className="mds-field__opt">(optional)</span></legend>
        <div className="gig-form__linkrow">
          <TextField id="pitch-link" label="Portfolio link" leadingIcon="link-01" placeholder="dribbble.com/you" value={link} inputMode="url"
            onChange={e => { setLink(e.target.value); if (errs.link) setErrs(x => ({ ...x, link: '' })); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }} error={errs.link} />
          <Button variant="secondary" onClick={addLink} className="gig-form__add">Add</Button>
        </div>
        {links.length > 0 && (
          <ul className="gig-links">
            {links.map(l => <li key={l} className="gig-link"><Icon name="link-01" size={16} /><span>{l.replace(/^https?:\/\//, '')}</span><IconButton icon="cancel-01" size="sm" label={'Remove ' + l} onClick={() => setLinks(x => x.filter(y => y !== l))} /></li>)}
          </ul>
        )}
        <FileUpload onFiles={onFiles} error={uploadErr || errs.files} title="Drop a case study or PDF" body={'PDF, PNG, JPG or .fig · up to ' + MAX_MB + ' MB · ' + MAX_FILES + ' files max'} accept=".pdf,.png,.jpg,.jpeg,.fig,.zip" />
        {files.length > 0 && (
          <div className="gig-files">
            {files.map(f => <FileRow key={f.id} name={f.name} status={f.status} progress={f.progress}
              meta={f.status === 'uploading' ? 'Uploading… ' + Math.round(f.progress) + '%' : fmtSize(f.size) + ' · Uploaded'} onAction={() => removeFile(f.id)} />)}
          </div>
        )}
      </fieldset>

      <div className="gig-form__actions">
        <Button type="submit" size="lg" loading={sending} leadingIcon={sending ? undefined : 'rocket-01'} className="gig-form__send">{sending ? 'Sending' : existing ? 'Update pitch' : 'Send pitch'}</Button>
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
      <p className="gig-form__fine"><Icon name="license" size={16} />Payment sits in escrow and releases when {g.client.name} approves the work.</p>
    </form>
  );
}

function PitchSummary({ g, p, onEdit }) {
  const [variant, label] = pitchStatus(p.status);
  const files = p.files || [];
  return (
    <section className="gig-summary" aria-labelledby="pitch-h">
      <div className="gig-summary__head">
        <h2 className="gig-form__title" id="pitch-h">Your pitch</h2>
        <Badge variant={variant}>{label}</Badge>
      </div>
      <p className="gig-form__sub">Sent {timeAgo(p.at)}. {replyTime(g.client)}.</p>
      <dl className="gig-summary__facts">
        <div><dt>Price</dt><dd className="mds-num">{priceText(p.price, g.budget.type)}</dd></div>
        <div><dt>Timeline</dt><dd>{timelineLabel(p.days)}</dd></div>
      </dl>
      <blockquote className="gig-summary__note">{p.note}</blockquote>
      {files.length > 0 && <ul className="gig-links">{files.map(f => <li key={f.name} className="gig-link"><Icon name={f.kind === 'link' ? 'link-01' : 'file-01'} size={16} /><span>{f.name.replace(/^https?:\/\//, '')}</span></li>)}</ul>}
      <div className="gig-form__actions">
        <Button variant="secondary" leadingIcon="edit-02" onClick={onEdit}>Edit pitch</Button>
        <Button variant="ghost" onClick={() => go('gigs')}>Back to the board</Button>
      </div>
    </section>
  );
}

function Gig({ param }) {
  const s = useStore();
  const raw = param || '';
  let id = raw, focusPitch = false;
  if (!s.gig(raw) && raw.endsWith('-pitch')) { id = raw.slice(0, -6); focusPitch = true; }
  const g = s.gig(id);
  const existing = g ? s.pitchFor(g.id) : null;
  const mine = g ? s.myGigs.some(x => x.id === g.id) : false;
  const [editing, setEditing] = useState(focusPitch && !!existing);
  const [sent, setSent] = useState(null); // 'new' | 'updated'

  if (!g) {
    return (
      <div className="page">
        <Crumbs items={[{ label: 'Gigs', href: '#gigs' }, { label: 'Not found' }]} />
        <EmptyState scene="search" headingLevel={1} title="This gig isn’t on the board"
          body="It may have been filled or taken down by the client. There are plenty more where it came from."
          action={<Button onClick={() => go('gigs')} trailingIcon="arrow-right-01">Browse open gigs</Button>} />
      </div>
    );
  }

  if (sent && existing) {
    const first = g.client.person.split(' ')[0];
    return (
      <div className="page gig-sent">
        <Done icon="rocket-01" sticker="pop-lime"
          title={sent === 'updated' ? 'Pitch updated' : 'Pitch sent to ' + g.client.name}
          body={(sent === 'updated' ? first + ' will see your new numbers next time they open your pitch. ' : first + ' gets a heads-up right now. ') + replyTime(g.client) + '. We’ll ping you the moment they reply.'}
          actions={<><Button variant="secondary" onClick={() => { setSent(null); setEditing(false); }}>View your pitch</Button><Button trailingIcon="arrow-right-01" onClick={() => go('gigs')}>Back to the board</Button></>} />
        <div className="gig-sent__card">
          <div className="gig-sent__row"><span>Your {g.budget.type === 'hourly' ? 'rate' : 'price'}</span><strong className="mds-num">{priceText(existing.price, g.budget.type)}</strong></div>
          <div className="gig-sent__row"><span>Timeline</span><strong>{timelineLabel(existing.days)}</strong></div>
          <div className="gig-sent__row"><span>Pitches on this gig</span><strong className="mds-num">{g.pitches + 1}</strong></div>
        </div>
      </div>
    );
  }

  const count = g.pitches + (existing ? 1 : 0);
  const seed = g.id.length % DESIGNERS.length;
  const people = [...(existing ? [{ initials: ME.initials, color: ME.color, name: 'You' }] : []), ...DESIGNERS.slice(seed).concat(DESIGNERS.slice(0, seed)).map(d => ({ initials: d.initials, color: d.color, name: d.name }))];
  while (people.length < count) people.push({ initials: '', color: 'pop-yellow', name: '' });
  const similar = s.allGigs.filter(x => x.id !== g.id && (x.category === g.category || x.skills.some(k => g.skills.includes(k)))).slice(0, 3);
  const fill = similar.length < 3 ? s.allGigs.filter(x => x.id !== g.id && !similar.includes(x)).slice(0, 3 - similar.length) : [];
  const typical = g.budget.type === 'hourly' ? budgetText(g.budget) : budgetText({ type: 'fixed', min: Math.round(g.budget.min * 0.95 / 100) * 100, max: Math.round(g.budget.max * 1.05 / 100) * 100 });

  return (
    <div className="page gig">
      <Crumbs items={[{ label: 'Gigs', href: '#gigs' }, { label: g.category, href: '#gigs' }, { label: g.title }]} />
      <div className="gig-layout">
        <article className="gig-main">
          <div className="gig-head">
            <div className="gig-head__tags">
              <Badge variant="neutral">{g.category}</Badge>
              {mine && <Badge variant="yellow" icon="crown">Your gig</Badge>}
              <span className="gig-head__posted">Posted {g.posted.toLowerCase()}</span>
            </div>
            <h1 className="gig-head__title">{g.title}</h1>
          </div>

          <div className="gig-facts">
            <Fact icon="dollar-01" label="Budget" value={budgetText(g.budget)} sub={g.budget.type === 'hourly' ? 'Hourly' : 'Fixed price'} />
            <Fact icon="calendar-03" label="Duration" value={g.duration} />
            <Fact icon="crown" label="Level" value={g.level === 'Any' ? 'Any level' : g.level} />
            <Fact icon="message-01" label="Pitches" value={count} sub={count > 20 ? 'Busy' : 'Room to stand out'} />
          </div>

          <ClientCard g={g} />

          <section className="gig-sec" aria-labelledby="gig-about">
            <h2 className="gig-sec__title" id="gig-about">About the project</h2>
            <p className="gig-desc">{g.desc}</p>
          </section>

          {g.deliverables && g.deliverables.length > 0 && (
            <section className="gig-sec" aria-labelledby="gig-del">
              <h2 className="gig-sec__title" id="gig-del">What you’ll deliver</h2>
              <ul className="gig-checks">{g.deliverables.map((d, i) => <li key={d} style={{ '--i': i }}><span className="gig-checks__tick" aria-hidden="true"><Icon name="tick-02" size={16} /></span>{d}</li>)}</ul>
            </section>
          )}

          <section className="gig-sec" aria-labelledby="gig-skills">
            <h2 className="gig-sec__title" id="gig-skills">Skills</h2>
            <ul className="gig-skills">{g.skills.map(k => <li key={k} className="tag">{k}</li>)}</ul>
          </section>

          <section className="gig-sec gig-crowd" aria-labelledby="gig-crowd">
            <h2 className="gig-sec__title" id="gig-crowd">Pitches so far</h2>
            {count > 0 ? (
              <div className="gig-crowd__row">
                <AvatarGroup people={people} max={4} label={count + ' designers have pitched'} />
                <p className="gig-crowd__text"><strong>{count} {count === 1 ? 'designer has' : 'designers have'} pitched</strong>{existing ? ', including you' : ''}. Most pitches land around {typical}.</p>
              </div>
            ) : <p className="gig-crowd__text">No pitches yet. {mine ? 'Designers usually start pitching within two hours.' : 'Be the first. Early pitches get read first.'}</p>}
          </section>
        </article>

        <aside className="gig-rail" id="pitch" aria-label="Pitch">
          {mine ? (
            <section className="gig-summary" aria-labelledby="pitch-h">
              <h2 className="gig-form__title" id="pitch-h">This is your gig</h2>
              <p className="gig-form__sub">Pitches will land here and in your dashboard. We’ll notify you as each one arrives.</p>
              <Alert variant="info" title="Tip">Gigs with three or more deliverables get 40% more pitches from senior designers.</Alert>
              <div className="gig-form__actions">
                <Button onClick={() => go('dashboard')} leadingIcon="dashboard-square-01">Open dashboard</Button>
                <Button variant="ghost" onClick={() => go('gigs')}>See the board</Button>
              </div>
            </section>
          ) : existing && !editing ? (
            <PitchSummary g={g} p={existing} onEdit={() => setEditing(true)} />
          ) : (
            <PitchForm key={existing ? 'edit' : 'new'} g={g} existing={existing} autoFocus={focusPitch || editing}
              onCancel={existing ? () => setEditing(false) : null}
              onSent={updated => { setEditing(false); setSent(updated ? 'updated' : 'new'); window.scrollTo(0, 0); s.toast(updated ? 'Pitch updated' : 'Pitch sent. Fingers crossed!', { variant: 'success' }); }} />
          )}
        </aside>
      </div>

      <section className="gig-similar" aria-labelledby="gig-similar-h">
        <div className="gig-similar__head">
          <h2 className="gig-sec__title gig-similar__title" id="gig-similar-h">Similar gigs</h2>
          <Button variant="tertiary" trailingIcon="arrow-right-01" onClick={() => go('gigs')}>See all gigs</Button>
        </div>
        <div className="gig-similar__grid">{similar.concat(fill).map(x => <GigFlyer key={x.id} g={x} />)}</div>
      </section>
    </div>
  );
}
Gig.title = 'Gig';
export default Gig;
