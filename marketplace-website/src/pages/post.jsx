import { Icon, Button, IconButton, Chip, TextField, Select, Textarea, Radio, Slider, DatePicker, Stepper, Alert, useState, useRef, useEffect } from '../ds.js';
import { GigFlyer, Done, cx } from '../ui/kit.jsx';
import { ME, GIGS, GIG_CATEGORIES, budgetText, money } from '../data.js';
import { useStore, go } from '../store.jsx';

const STEPS = [{ label: 'Basics' }, { label: 'Details' }, { label: 'Budget' }, { label: 'Review' }];
const TITLE_MAX = 80, DESC_MIN = 80, DESC_MAX = 1200, MAX_SKILLS = 5, MAX_DELIVERABLES = 8;
const TAPES = ['pop-yellow', 'pop-pink', 'pop-lime', 'pop-violet', 'pop-orange'];
const SKILLS_BY_CAT = {
  'Product design': ['Figma', 'Mobile', 'Web', 'Onboarding', 'Dashboards', 'Design systems', 'Prototyping', 'UX research'],
  Brand: ['Logo', 'Brand', 'Packaging', 'Typography', 'Guidelines', 'Print', 'Posters'],
  Illustration: ['Illustration', 'Characters', 'Vector', 'Editorial', 'Onboarding art', 'Procreate'],
  '3D & motion': ['Blender', 'Motion', '3D icons', 'Product render', 'After Effects', 'Cinema 4D'],
  'Web design': ['Web', 'Framer', 'Webflow', 'Landing pages', 'Copy', 'Figma'],
  Icons: ['Icons', 'Grid', 'SVG', 'Figma', 'Illustration'],
};
const ANY_SKILLS = ['Figma', 'Brand', 'Logo', 'Illustration', 'Mobile', 'Web', 'Icons', 'Motion', 'Typography', 'Design systems'];
const RANGES = { fixed: { min: 250, max: 20000, step: 250, init: [2000, 4000] }, hourly: { min: 25, max: 250, step: 5, init: [60, 100] } };
const LEVELS = [
  { value: 'Any', label: 'Open to all levels', hint: 'Best for small, well-defined work' },
  { value: 'Mid', label: 'Mid-level', hint: '3–5 years, works on their own' },
  { value: 'Senior', label: 'Senior', hint: '6+ years, can lead the project' },
];
const EXAMPLE = 'We roast 40kg of coffee a week in a garage and sell at two weekend markets. We need a logo, a bag label system and a stamp for our cups. Playful, not hipster. You’ll get our photos, a moodboard and replies within a day.';

const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysUntil = d => Math.round((startOfDay(d) - startOfDay(new Date())) / 86400000);
function durationFor(deadline) {
  if (!deadline) return 'Flexible';
  const d = daysUntil(deadline);
  if (d <= 10) return d + (d === 1 ? ' day' : ' days');
  if (d <= 56) return Math.round(d / 7) + ' weeks';
  return Math.round(d / 30) + ' months';
}
const slug = t => t.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-') || 'gig';
const fmt = type => v => money(v) + (type === 'hourly' ? '/hr' : '');

/* What similar gigs pay, so the budget step has a real anchor. */
function typicalFor(category, type) {
  const list = GIGS.filter(g => g.category === category && g.budget.type === type);
  if (!list.length) return null;
  const min = Math.round(list.reduce((n, g) => n + g.budget.min, 0) / list.length / 50) * 50;
  const max = Math.round(list.reduce((n, g) => n + g.budget.max, 0) / list.length / 50) * 50;
  return budgetText({ type, min, max });
}

function buildGig(f, id, tape) {
  return {
    id, title: f.title.trim() || 'Your gig title shows up here',
    client: { name: ME.name, person: ME.name, initials: ME.initials, color: ME.color, verified: true, spent: 'New client' },
    category: f.category || 'Product design',
    budget: { type: f.type, min: f.range[0], max: f.range[1] },
    duration: durationFor(f.deadline), posted: 'Just now', pitches: 0, level: f.level,
    skills: f.skills, tape,
    desc: f.desc.trim() || 'Your description appears here. Say who it’s for, what’s not working and what good looks like.',
    deliverables: f.deliverables,
  };
}

function validateStep(i, f) {
  const e = {};
  if (i === 0) {
    const t = f.title.trim();
    if (!t) e.title = 'Give your gig a title. Name the thing and who it’s for.';
    else if (t.length < 12) e.title = 'Add ' + (12 - t.length) + ' more characters. Short titles like “Logo” get skipped; try “Logo for a tiny coffee roaster”.';
    if (!f.category) e.category = 'Pick a category so the right designers see your gig.';
    if (!f.skills.length) e.skills = 'Pick at least one skill. We use skills to match you with designers.';
  }
  if (i === 1) {
    const d = f.desc.trim();
    if (!d) e.desc = 'Describe the project. Who is it for, what’s not working, and what does good look like?';
    else if (d.length < DESC_MIN) e.desc = 'Add ' + (DESC_MIN - d.length) + ' more characters. Designers pitch better when they know the goal and the context.';
    if (!f.deliverables.length) e.deliverables = 'Add at least one deliverable, like “Logo + wordmark”, so designers can price the work.';
  }
  if (i === 2) {
    if (f.range[1] <= f.range[0]) e.range = 'Leave a little room: set the top of the range above the bottom.';
    if (!f.deadline) e.deadline = 'Pick a deadline so designers can plan their time.';
    else if (daysUntil(f.deadline) < 3) e.deadline = 'Give designers at least 3 days. Pick a date after ' + new Date(Date.now() + 2 * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '.';
  }
  return e;
}

function Preview({ g, label = 'Live preview' }) {
  return (
    <div className="post-preview">
      <div className="post-preview__label"><span className="post-preview__dot" aria-hidden="true" />{label}</div>
      {/* inert: the preview is a picture of the card, not something to click yet */}
      <div className="post-preview__card" inert="" aria-hidden="true"><GigFlyer g={g} /></div>
      <p className="post-preview__hint">This is how designers will see your gig on the board.</p>
    </div>
  );
}

function Post() {
  const s = useStore();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ title: '', category: '', skills: [], desc: '', deliverables: [], type: 'fixed', range: RANGES.fixed.init, deadline: null, level: 'Any' });
  const [deliv, setDeliv] = useState('');
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const tape = useRef(TAPES[Math.floor(Math.random() * TAPES.length)]).current;
  const headRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const top = document.getElementById('post-form');
    if (top) top.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (headRef.current) headRef.current.focus({ preventScroll: true });
  }, [step]);

  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); if (errs[k]) setErrs(e => ({ ...e, [k]: '' })); };
  const draft = buildGig(f, 'preview', tape);

  function toggleSkill(k) {
    if (f.skills.includes(k)) return set('skills', f.skills.filter(x => x !== k));
    if (f.skills.length >= MAX_SKILLS) { setErrs(e => ({ ...e, skills: 'Five skills is plenty. Remove one to add ' + k + '.' })); return; }
    set('skills', [...f.skills, k]);
  }
  function addDeliverable() {
    const v = deliv.trim();
    if (!v) { setErrs(e => ({ ...e, deliv: 'Type a deliverable first, like “Clickable prototype”.' })); return; }
    if (f.deliverables.some(d => d.toLowerCase() === v.toLowerCase())) { setErrs(e => ({ ...e, deliv: 'That one’s already on the list.' })); return; }
    if (f.deliverables.length >= MAX_DELIVERABLES) { setErrs(e => ({ ...e, deliv: 'Eight deliverables is the limit. Group small items together.' })); return; }
    set('deliverables', [...f.deliverables, v]); setDeliv(''); setErrs(e => ({ ...e, deliv: '', deliverables: '' }));
  }
  function setType(t) { setF(x => ({ ...x, type: t, range: RANGES[t].init })); setErrs(e => ({ ...e, range: '' })); }

  function next() {
    const e = validateStep(step, f);
    setErrs(e);
    const bad = Object.keys(e).find(k => e[k]);
    if (bad) {
      const el = document.getElementById('post-' + bad) || document.querySelector('[data-field="' + bad + '"] button, [data-field="' + bad + '"] input');
      if (el) el.focus();
      return;
    }
    setStep(step + 1);
  }
  function back() { setErrs({}); setStep(Math.max(0, step - 1)); }
  function editStep(i) { setErrs({}); setStep(i); }

  function publish() {
    for (let i = 0; i < 3; i++) { const e = validateStep(i, f); if (Object.keys(e).length) { setErrs(e); setStep(i); return; } }
    setPublishing(true);
    setTimeout(() => {
      const base = slug(f.title.trim());
      let id = base, n = 2;
      while (s.gig(id) || id.endsWith('-pitch')) id = base + '-' + n++;
      const g = buildGig(f, id, tape);
      s.postGig(g);
      setPublishing(false);
      setDone(g);
      window.scrollTo(0, 0);
      s.toast('Your gig is live on the board', { variant: 'success', actionLabel: 'View', onAction: () => go('gig', id) });
    }, 900);
  }

  if (done) {
    return (
      <div className="page post-done">
        <Done icon="rocket-01" sticker="pop-yellow" title="Your gig is live"
          body={'Designers who know ' + done.skills.slice(0, 2).join(' and ') + ' just got a heads-up. Most clients get their first pitch within two hours.'}
          actions={<><Button variant="secondary" onClick={() => go('gigs')}>See it on the board</Button><Button trailingIcon="arrow-right-01" onClick={() => go('gig', done.id)}>View gig</Button></>} />
        <div className="post-done__card"><GigFlyer g={s.gig(done.id) || done} /></div>
        <p className="post-done__again"><button type="button" className="post-link" onClick={() => { setDone(null); setStep(0); setF({ title: '', category: '', skills: [], desc: '', deliverables: [], type: 'fixed', range: RANGES.fixed.init, deadline: null, level: 'Any' }); }}>Post another gig</button></p>
      </div>
    );
  }

  const skillList = Array.from(new Set([...(SKILLS_BY_CAT[f.category] || ANY_SKILLS), ...f.skills]));
  const tLen = f.title.trim().length;
  const titleHelp = tLen === 0 ? 'Name the thing and who it’s for. ' + tLen + ' / ' + TITLE_MAX
    : tLen < 12 ? 'Keep going. ' + tLen + ' / ' + TITLE_MAX
    : tLen > 70 ? 'Getting long; cards cut titles past 70 characters. ' + tLen + ' / ' + TITLE_MAX
    : 'Nice and clear. ' + tLen + ' / ' + TITLE_MAX;
  const typical = f.category ? typicalFor(f.category, f.type) : null;
  const R = RANGES[f.type];
  const earliest = startOfDay(new Date(Date.now() + 3 * 86400000));

  return (
    <div className="page post">
      <header className="post-head">
        <h1 className="post-head__title">Post a gig</h1>
        <p className="post-head__lead">Four quick steps. Clear gigs get better pitches, and most land their first one within two hours.</p>
      </header>

      <Stepper steps={STEPS} current={step} className="post-stepper" />

      <div className="post-layout">
        <form id="post-form" className="post-form" noValidate onSubmit={e => { e.preventDefault(); step < 3 ? next() : publish(); }}>
          <h2 className="post-form__title" ref={headRef} tabIndex={-1}>
            <span className="post-form__n">Step {step + 1} of 4</span>
            {['The basics', 'The details', 'Budget and timing', 'Review and publish'][step]}
          </h2>

          {step === 0 && (
            <div className="post-fields" key="s0">
              <TextField id="post-title" label="Gig title" required maxLength={TITLE_MAX} value={f.title} onChange={e => set('title', e.target.value)}
                placeholder="Brand identity for a tiny coffee roaster" error={errs.title} helper={titleHelp} />
              <Select id="post-category" label="Category" required placeholder="Choose a category" value={f.category} options={GIG_CATEGORIES.filter(c => c !== 'All')}
                onChange={e => set('category', e.target.value)} error={errs.category} />
              <fieldset className="post-group" data-field="skills" aria-describedby="post-skills-help">
                <legend className="mds-field__label">Skills<span className="mds-field__req" aria-hidden="true">*</span></legend>
                <div className="post-chips">{skillList.map(k => <Chip key={k} selected={f.skills.includes(k)} onClick={() => toggleSkill(k)}>{k}</Chip>)}</div>
                <div id="post-skills-help" className={cx('mds-field__helper', errs.skills && 'mds-field__helper--error')}>
                  {errs.skills && <Icon name="alert-circle" size={16} />}{errs.skills || (f.skills.length ? f.skills.length + ' of ' + MAX_SKILLS + ' picked. We match designers on these.' : f.category ? 'Pick up to five.' : 'Pick up to five. Choose a category for better suggestions.')}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="post-fields" key="s1">
              <Textarea id="post-desc" label="Describe the project" required rows={7} maxLength={DESC_MAX} value={f.desc} onChange={e => set('desc', e.target.value)}
                placeholder={'For example: ' + EXAMPLE} error={errs.desc}
                helper={'Who it’s for, what’s not working, what good looks like. At least ' + DESC_MIN + ' characters.'} />
              {!f.desc && <button type="button" className="post-link post-example" onClick={() => set('desc', EXAMPLE)}><Icon name="sparkles" size={16} />Start from the example</button>}
              <fieldset className="post-group" data-field="deliverables">
                <legend className="mds-field__label">Deliverables<span className="mds-field__req" aria-hidden="true">*</span></legend>
                <div className="post-addrow">
                  <TextField id="post-deliverables" label="Add a deliverable" placeholder="Logo + wordmark" value={deliv} maxLength={60}
                    onChange={e => { setDeliv(e.target.value); if (errs.deliv) setErrs(x => ({ ...x, deliv: '' })); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(); } }}
                    error={errs.deliv || errs.deliverables} helper="Press Enter to add. One thing you’ll get back per line." />
                  <Button variant="secondary" leadingIcon="add-01" onClick={addDeliverable} className="post-addrow__btn">Add</Button>
                </div>
                {f.deliverables.length > 0 && (
                  <ol className="post-delivs">
                    {f.deliverables.map((d, i) => (
                      <li key={d} className="post-deliv">
                        <span className="post-deliv__n" aria-hidden="true">{i + 1}</span><span className="post-deliv__t">{d}</span>
                        <IconButton icon="delete-02" size="sm" label={'Remove ' + d} onClick={() => set('deliverables', f.deliverables.filter(x => x !== d))} />
                      </li>
                    ))}
                  </ol>
                )}
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="post-fields" key="s2">
              <fieldset className="post-group">
                <legend className="mds-field__label">How do you want to pay?</legend>
                <div className="post-radios post-radios--row">
                  <Radio name="post-type" value="fixed" checked={f.type === 'fixed'} onChange={() => setType('fixed')} label={<span className="post-radio"><strong>Fixed price</strong><span>One price for the whole project</span></span>} />
                  <Radio name="post-type" value="hourly" checked={f.type === 'hourly'} onChange={() => setType('hourly')} label={<span className="post-radio"><strong>Hourly</strong><span>Pay weekly for tracked time</span></span>} />
                </div>
              </fieldset>
              <div className="post-group" data-field="range">
                <Slider range label={f.type === 'hourly' ? 'Hourly rate' : 'Budget'} min={R.min} max={R.max} step={R.step} value={f.range} format={fmt(f.type)} onChange={v => set('range', v)} />
                <div className={cx('mds-field__helper', errs.range && 'mds-field__helper--error')}>
                  {errs.range && <Icon name="alert-circle" size={16} />}{errs.range || (typical ? 'Similar ' + f.category + ' gigs pay ' + typical + '.' : 'A range gets more pitches than a single number.')}
                </div>
              </div>
              <DatePicker id="post-deadline" label="Deadline" required value={f.deadline} onChange={d => set('deadline', d)} error={errs.deadline}
                isDisabled={d => d < earliest} helper={f.deadline ? 'That’s ' + durationFor(f.deadline) + ' from today.' : 'When do you need the final files? Give designers at least 3 days.'} />
              <fieldset className="post-group">
                <legend className="mds-field__label">Experience level</legend>
                <div className="post-radios">
                  {LEVELS.map(l => <Radio key={l.value} name="post-level" value={l.value} checked={f.level === l.value} onChange={() => set('level', l.value)} label={<span className="post-radio"><strong>{l.label}</strong><span>{l.hint}</span></span>} />)}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="post-fields" key="s3">
              <div className="post-review-card"><Preview g={draft} label="Your gig card" /></div>
              <dl className="post-review">
                {[
                  ['Title', draft.title, 0], ['Category', draft.category, 0], ['Skills', f.skills.join(', '), 0],
                  ['Description', draft.desc, 1], ['Deliverables', f.deliverables.join(' · '), 1],
                  ['Budget', budgetText(draft.budget) + (f.type === 'hourly' ? ' (hourly)' : ' (fixed)'), 2],
                  ['Deadline', f.deadline ? f.deadline.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + draft.duration : 'Flexible', 2],
                  ['Level', LEVELS.find(l => l.value === f.level).label, 2],
                ].map(([k, v, i]) => (
                  <div key={k} className="post-review__row">
                    <dt>{k}</dt><dd>{v}</dd>
                    <button type="button" className="post-link" onClick={() => editStep(i)} aria-label={'Edit ' + k.toLowerCase()}>Edit</button>
                  </div>
                ))}
              </dl>
              <Alert variant="info" title="Free to post">You only pay when you hire. Payment sits in escrow until you approve the work.</Alert>
            </div>
          )}

          <div className="post-nav">
            {step > 0 ? <Button variant="ghost" leadingIcon="arrow-left-01" onClick={back}>Back</Button> : <Button variant="ghost" onClick={() => go('gigs')}>Cancel</Button>}
            <span className="grow" />
            {step < 3
              ? <Button type="submit" trailingIcon="arrow-right-01">Continue</Button>
              : <Button type="submit" size="lg" leadingIcon={publishing ? undefined : 'rocket-01'} loading={publishing}>{publishing ? 'Publishing' : 'Publish gig'}</Button>}
          </div>
        </form>

        {step < 3 && <aside className="post-aside" aria-label="Live preview"><Preview g={draft} /></aside>}
      </div>
    </div>
  );
}
Post.title = 'Post a gig';
export default Post;
