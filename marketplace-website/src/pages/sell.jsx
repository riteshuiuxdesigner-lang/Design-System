import { Icon, Button, IconButton, Badge, Chip, TextField, Select, Textarea, Checkbox, Switch, Stepper, FileUpload, FileRow, Alert, useState, useEffect, useRef, useMemo } from '../ds.js';
import { AssetTile, Done, cx } from '../ui/kit.jsx';
import { art } from '../art.js';
import { CATEGORIES, LICENSES, ME, priceFor, money } from '../data.js';
import { useStore, go } from '../store.jsx';

const STEPS = [
  { label: 'Files', description: 'Upload or link' },
  { label: 'Details', description: 'What it is' },
  { label: 'Cover', description: 'How it looks' },
  { label: 'Pricing', description: 'What it costs' },
  { label: 'Review', description: 'Go live' },
];
const HEADS = [
  ['Add your files', 'Drop in the files buyers will download, or paste a Figma link. You need at least one.'],
  ['Tell buyers what it is', 'A clear title and an honest list of what’s inside sell more than any adjective.'],
  ['Pick a cover', 'This is the first thing people see in the shop. Choose a style, then a color.'],
  ['Set your price', 'You set the Personal price. Commercial and Extended licenses scale from it.'],
  ['Check it, then go live', 'Everything look right? You can edit the listing any time after it’s live.'],
];
const SELL_CATS = CATEGORIES.filter(c => c.id !== 'all');
const FORMATS = ['Figma', 'Sketch', 'Framer', 'SVG', 'PNG', 'PDF', 'Blender', 'OTF', 'WOFF2', 'React'];
const KINDS = [
  { id: 'ui', label: 'Dashboard' }, { id: 'mobile', label: 'Mobile screens' }, { id: 'icons', label: 'Icon grid' }, { id: '3d', label: '3D shapes' },
  { id: 'type', label: 'Type specimen' }, { id: 'poster', label: 'Poster' }, { id: 'scene', label: 'Illustration' }, { id: 'brand', label: 'Brand board' },
];
const COLORS = [
  { id: 'violet', label: 'Violet' }, { id: 'yellow', label: 'Yellow' }, { id: 'lime', label: 'Lime' }, { id: 'pink', label: 'Pink' },
  { id: 'orange', label: 'Orange' }, { id: 'blue', label: 'Blue' }, { id: 'grey', label: 'Grey' }, { id: 'ink', label: 'Ink' },
];
const KIND_FOR = { ui: 'ui', icons: 'icons', '3d': '3d', type: 'type', templates: 'poster', illustration: 'scene', brand: 'brand' };
const OK_EXT = ['fig', 'sketch', 'zip', 'pdf', 'png', 'jpg', 'jpeg', 'svg', 'otf', 'ttf', 'woff2', 'blend', 'ai', 'psd', 'xd', 'framerx'];
const MAX = 2 * 1024 ** 3;
const FIGMA = /^https:\/\/(www\.)?figma\.com\/(file|design|proto|community\/file)\/[A-Za-z0-9]+/;
const SUGGESTED = [19, 29, 49, 79];

const size = b => b >= 1024 ** 3 ? (b / 1024 ** 3).toFixed(1) + ' GB' : b >= 1024 ** 2 ? Math.round(b / 1024 ** 2) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const cash = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const wordOf = t => (t.trim().replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2) || 'Aa').replace(/^(.)(.?)$/, (m, a, b) => a.toUpperCase() + (b || '').toLowerCase());
let fid = 0;

/* Swatch: a crop of the real cover art, so the color matches the preview exactly (no hard-coded hex). */
const swatchCache = {};
const swatch = c => swatchCache[c] || (swatchCache[c] = art('3d', c, 'swatch'));

function Sell() {
  const s = useStore();
  const [id] = useState(() => 'sam-' + Date.now().toString(36));
  const [step, setStep] = useState(0);
  const [doneId, setDoneId] = useState(null);
  const [err, setErr] = useState({});
  // step 1
  const [files, setFiles] = useState([]);
  const [figma, setFigma] = useState('');
  // step 2
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [formats, setFormats] = useState([]);
  const [includes, setIncludes] = useState([]);
  const [inc, setInc] = useState('');
  // step 3
  const [kind, setKind] = useState(null);
  const [bg, setBg] = useState('violet');
  // step 4
  const [price, setPrice] = useState('29');
  const [free, setFree] = useState(false);
  // step 5
  const [rights, setRights] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const headRef = useRef(null);
  const topRef = useRef(null);
  const first = useRef(true);

  /* Simulated upload: each file climbs to 100% at its own pace. */
  const uploading = files.some(f => f.status === 'uploading');
  useEffect(() => {
    if (!uploading) return;
    const t = setInterval(() => setFiles(fs => fs.map(f => {
      if (f.status !== 'uploading') return f;
      const p = Math.min(100, f.progress + (4 + Math.random() * 14) * (60 * 1024 ** 2 / Math.max(f.size, 20 * 1024 ** 2)) ** 0.5);
      return p >= 100 ? { ...f, progress: 100, status: 'complete' } : { ...f, progress: p };
    })), 240);
    return () => clearInterval(t);
  }, [uploading]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (topRef.current && topRef.current.getBoundingClientRect().top < 0) topRef.current.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    if (headRef.current) headRef.current.focus({ preventScroll: true });
  }, [step]);

  function addFiles(list) {
    const next = list.map(f => {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      const base = { id: ++fid, name: f.name, size: f.size, progress: 0 };
      if (!OK_EXT.includes(ext)) return { ...base, status: 'error', meta: `Nudge can’t open .${ext} files. Use .fig, .sketch, .zip or .pdf.` };
      if (f.size > MAX) return { ...base, status: 'error', meta: `${size(f.size)} is over 2 GB. Compress it or split it into parts.` };
      return { ...base, status: 'uploading' };
    });
    setFiles(fs => [...fs, ...next]);
    setErr(e => ({ ...e, files: null }));
  }
  function fileAction(f) {
    setFiles(fs => fs.filter(x => x.id !== f.id));
    if (f.status === 'uploading') s.toast('Upload of ' + f.name + ' cancelled', { variant: 'neutral' });
    else if (f.status === 'complete') s.toast('Removed ' + f.name, { variant: 'neutral' });
    else s.toast('Removed ' + f.name + '. Fix it, then drop it in again.', { variant: 'neutral' });
  }
  function addInclude() {
    const v = inc.trim();
    if (!v) { setErr(e => ({ ...e, inc: 'Type something first, like “120 desktop screens”.' })); return; }
    if (includes.length >= 8) { setErr(e => ({ ...e, inc: 'Eight is plenty. Remove one to add another.' })); return; }
    if (includes.some(x => x.toLowerCase() === v.toLowerCase())) { setErr(e => ({ ...e, inc: '“' + v + '” is already on the list.' })); return; }
    setIncludes(l => [...l, v]); setInc(''); setErr(e => ({ ...e, inc: null, includes: null }));
  }

  const num = parseFloat(price);
  const personal = free ? 0 : (isFinite(num) && num > 0 ? Math.round(num * 100) / 100 : 0);
  const pv = { kind: kind || KIND_FOR[category] || 'ui', bg };
  const word = wordOf(title);
  const image = useMemo(() => art(pv.kind, pv.bg, id, { word }), [pv.kind, pv.bg, word]);
  const draft = {
    id, title: title.trim() || 'Your listing title', by: 'me', byName: ME.name, byInitials: ME.initials, category: category || 'ui',
    kind: pv.kind, bg: pv.bg, word, price: personal, badge: 'New', badgeVariant: 'pink', rating: 0, reviews: 0, sales: 0, likes: 0,
    formats, updated: 'Today', desc: desc.trim(), includes, image,
  };

  function validate(i) {
    const e = {};
    if (i === 0) {
      const done = files.filter(f => f.status === 'complete').length;
      if (figma.trim() && !FIGMA.test(figma.trim())) e.figma = 'That isn’t a Figma file link. Copy it from Share in Figma; it starts with https://www.figma.com/design/';
      else if (!done && !figma.trim()) e.files = uploading ? 'Hang on, your files are still uploading.' : 'Add at least one file, or paste a Figma link below.';
      else if (uploading) e.files = 'Hang on, ' + files.filter(f => f.status === 'uploading').length + ' file is still uploading.';
    }
    if (i === 1) {
      const t = title.trim();
      if (t.length < 6) e.title = t ? 'Make the title at least 6 characters. Say what it is, like “Orbit Dashboard UI Kit”.' : 'Add a title. Say what it is, like “Orbit Dashboard UI Kit”.';
      if (!category) e.category = 'Pick a category so buyers can find it in the shop.';
      const d = desc.trim().length;
      if (d < 40) e.desc = `Tell buyers what’s inside in at least 40 characters. You’re at ${d}.`;
      if (!formats.length) e.formats = 'Pick at least one format so buyers know it will open for them.';
      if (!includes.length) e.includes = 'Add at least one thing that’s included, like “120 desktop screens”.';
    }
    if (i === 2 && !kind) e.cover = 'Pick a cover style. Listings with a cover get about 3× more clicks.';
    if (i === 3 && !free) {
      if (!price.trim()) e.price = 'Set a price, or switch on Make it free.';
      else if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) e.price = 'Use numbers only, like 29 or 29.50.';
      else if (num < 1) e.price = 'The lowest price is $1. Switch on Make it free to give it away.';
      else if (num > 999) e.price = 'The highest price is $999. Split bigger bundles into a few listings.';
    }
    if (i === 4 && !rights) e.rights = 'Tick this to confirm the work is yours. We can’t list files you don’t own.';
    setErr(e);
    return Object.keys(e).length === 0;
  }
  function next(ev) {
    if (ev) ev.preventDefault();
    if (!validate(step)) {
      setTimeout(() => { const el = document.querySelector('.sell-form .mds-dropzone--error, .sell-form [aria-invalid="true"], .sell-form .sell-error'); if (el) { el.focus && el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 0);
      return;
    }
    if (step < 4) { setStep(step + 1); return; }
    publish();
  }
  function back() { setErr({}); setStep(Math.max(0, step - 1)); }
  function jump(i) { setErr({}); setStep(i); }
  function publish() {
    setPublishing(true);
    setTimeout(() => {
      const { image: _img, ...rest } = draft;
      const a = { ...rest, title: title.trim(), category, desc: desc.trim(), price: personal, badgeVariant: personal === 0 ? 'lime' : 'pink', figma: figma.trim() || undefined, files: files.filter(f => f.status === 'complete').map(f => ({ name: f.name, size: f.size })) };
      s.publishAsset(a);
      setPublishing(false);
      setDoneId(a.id);
      window.scrollTo(0, 0);
    }, 900);
  }

  if (doneId) {
    const a = s.asset(doneId) || draft;
    return (
      <div className="page sell-done">
        <Done icon="rocket-01" sticker="pop-lime" title="Your stall is open"
          body={`“${a.title}” is live in the shop. We’ll ping you the moment someone buys it.`}
          actions={<><Button variant="secondary" leadingIcon="dashboard-square-01" onClick={() => go('dashboard')}>Go to dashboard</Button><Button leadingIcon="view" onClick={() => go('asset', a.id)}>View listing</Button></>} />
        <div className="sell-done__tile"><AssetTile a={a} /></div>
      </div>
    );
  }

  const done = files.filter(f => f.status === 'complete').length;
  return (
    <div className="page sell" ref={topRef}>
      <header className="sell-head">
        <div className="sell-head__copy">
          <h1 className="sell-title">Open your stall</h1>
          <p className="sell-lead">List a kit, a font or an icon set in about five minutes. Keep 90% of every sale, paid every Monday.</p>
        </div>
        <span className="sell-keep" aria-hidden="true"><b>90%</b>is yours</span>
      </header>

      <div className="sell-stepper"><Stepper current={step} steps={STEPS} /></div>

      <div className="sell-layout">
        <form className="sell-form" onSubmit={next} noValidate>
          <div className="sell-card">
            <div className="sell-card__head">
              <span className="sell-card__n">Step {step + 1} of 5</span>
              <h2 className="sell-card__title" ref={headRef} tabIndex={-1}>{HEADS[step][0]}</h2>
              <p className="sell-card__sub">{HEADS[step][1]}</p>
            </div>

            {step === 0 && <div className="sell-fields">
              <FileUpload onFiles={addFiles} error={err.files || undefined} title="Drop your files here" body="or browse · .fig, .sketch, .zip, .pdf, fonts and images up to 2 GB each" />
              {files.length > 0 && <div className="sell-files" aria-live="polite">
                {files.map(f => <FileRow key={f.id} name={f.name} status={f.status} progress={f.progress}
                  meta={f.status === 'uploading' ? `${size(f.size * f.progress / 100)} of ${size(f.size)} · ${Math.max(1, Math.round((100 - f.progress) / 12))} seconds left` : f.status === 'complete' ? size(f.size) + ' · Uploaded' : f.meta}
                  onAction={() => fileAction(f)} />)}
              </div>}
              {!files.length && <button type="button" className="sell-sample" onClick={() => addFiles([{ name: 'Pocket-Planner-UI-kit.fig', size: 48 * 1024 ** 2 }, { name: 'Pocket-Planner-icons.zip', size: 12 * 1024 ** 2 }])}>
                <Icon name="sparkles" size={16} />No files handy? Add two sample files</button>}
              <div className="sell-or" aria-hidden="true"><span>or</span></div>
              <TextField label="Paste a Figma link" optional leadingIcon="link-01" type="url" inputMode="url" placeholder="https://www.figma.com/design/…" value={figma}
                onChange={e => { setFigma(e.target.value); if (err.figma || err.files) setErr(x => ({ ...x, figma: null, files: null })); }}
                onBlur={() => { if (figma.trim() && !FIGMA.test(figma.trim())) setErr(x => ({ ...x, figma: 'That isn’t a Figma file link. Copy it from Share in Figma; it starts with https://www.figma.com/design/' })); }}
                error={err.figma || undefined} helper={figma.trim() && FIGMA.test(figma.trim()) ? 'Looks good. Buyers get their own copy of this file.' : 'Turn on “Anyone with the link can view”. Buyers get their own copy.'} />
              <p className="sell-note"><Icon name="information-circle" size={16} />{done || (figma.trim() && FIGMA.test(figma.trim())) ? `Ready: ${[done ? done + ' file' + (done > 1 ? 's' : '') : '', figma.trim() && FIGMA.test(figma.trim()) ? 'a Figma link' : ''].filter(Boolean).join(' and ')}.` : 'We scan every upload for malware before it goes live.'}</p>
            </div>}

            {step === 1 && <div className="sell-fields">
              <TextField label="Title" required value={title} maxLength={60} onChange={e => { setTitle(e.target.value); if (err.title) setErr(x => ({ ...x, title: null })); }}
                placeholder="Orbit Dashboard UI Kit" error={err.title || undefined} helper={`Say what it is. ${title.length} / 60`} />
              <Select label="Category" required placeholder="Pick a category" value={category} onChange={e => { setCategory(e.target.value); setErr(x => ({ ...x, category: null })); }}
                options={SELL_CATS.map(c => ({ value: c.id, label: c.label }))} error={err.category || undefined} />
              <Textarea label="Description" required value={desc} maxLength={600} rows={5} onChange={e => { setDesc(e.target.value); if (err.desc && e.target.value.trim().length >= 40) setErr(x => ({ ...x, desc: null })); }}
                placeholder="240 components and 120 screens for SaaS dashboards. Auto layout everywhere, variables for Light and Dark…" error={err.desc || undefined}
                helper="What’s inside, who it’s for and what makes it good to work with." />
              <fieldset className="sell-set">
                <legend className="mds-field__label">Formats<span className="mds-field__req" aria-hidden="true">*</span></legend>
                <div className="sell-formats">{FORMATS.map(f => <Checkbox key={f} label={f} checked={formats.includes(f)}
                  onChange={e => { setFormats(l => e.target.checked ? [...l, f] : l.filter(x => x !== f)); setErr(x => ({ ...x, formats: null })); }} />)}</div>
                {err.formats && <p className="sell-error" tabIndex={-1}><Icon name="alert-circle" size={16} />{err.formats}</p>}
              </fieldset>
              <div className="sell-set">
                <span className="mds-field__label" id="sell-inc-label">What’s included<span className="mds-field__req" aria-hidden="true">*</span></span>
                {includes.length > 0 && <ul className="sell-incs" aria-labelledby="sell-inc-label">
                  {includes.map((x, i) => <li key={x} className="sell-inc"><Icon name="tick-02" size={16} /><span>{x}</span>
                    <IconButton size="sm" icon="cancel-01" label={'Remove ' + x} onClick={() => setIncludes(l => l.filter((_, j) => j !== i))} /></li>)}
                </ul>}
                <div className="sell-incadd">
                  <TextField aria-label="Add something that’s included" placeholder={includes.length ? 'Add another, like “Free updates for life”' : 'Like “120 desktop screens”'} value={inc}
                    onChange={e => { setInc(e.target.value); if (err.inc) setErr(x => ({ ...x, inc: null })); }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInclude(); } }} error={err.inc || undefined} />
                  <Button variant="secondary" leadingIcon="add-01" onClick={addInclude}>Add</Button>
                </div>
                {err.includes && <p className="sell-error" tabIndex={-1}><Icon name="alert-circle" size={16} />{err.includes}</p>}
              </div>
            </div>}

            {step === 2 && <div className="sell-fields">
              <fieldset className="sell-set">
                <legend className="mds-field__label">Style</legend>
                <div className="sell-covers">
                  {[...KINDS].sort((a, b) => (b.id === KIND_FOR[category]) - (a.id === KIND_FOR[category])).map(k => {
                    const on = kind === k.id;
                    return (
                      <label key={k.id} className={cx('sell-cover', on && 'is-on')}>
                        <input type="radio" name="sell-kind" value={k.id} checked={on} className="sell-sr" onChange={() => { setKind(k.id); setErr(x => ({ ...x, cover: null })); }} />
                        <span className="sell-cover__img"><img src={k.id === pv.kind ? image : art(k.id, bg, id, { word })} alt="" />
                          {on && <span className="sell-cover__check"><Icon name="tick-02" size={16} /></span>}
                          {k.id === KIND_FOR[category] && <Badge className="sell-cover__tag" variant="yellow">Suggested</Badge>}</span>
                        <span className="sell-cover__name">{k.label}</span>
                      </label>
                    );
                  })}
                </div>
                {err.cover && <p className="sell-error" tabIndex={-1}><Icon name="alert-circle" size={16} />{err.cover}</p>}
              </fieldset>
              <fieldset className="sell-set">
                <legend className="mds-field__label">Color</legend>
                <div className="sell-swatches">
                  {COLORS.map(c => <label key={c.id} className={cx('sell-swatch', bg === c.id && 'is-on')} title={c.label}>
                    <input type="radio" name="sell-bg" value={c.id} checked={bg === c.id} className="sell-sr" onChange={() => setBg(c.id)} />
                    <img src={swatch(c.id)} alt="" /><span className="sell-sr">{c.label}</span>
                  </label>)}
                </div>
              </fieldset>
            </div>}

            {step === 3 && <div className="sell-fields">
              <Switch label="Make it free" checked={free} onChange={e => { setFree(e.target.checked); setErr(x => ({ ...x, price: null })); }} />
              {free ? <Alert variant="info" title="Free listings grow your following">Free kits get about 8× more downloads, and every download follows you for new drops. You can add a price later.</Alert>
                : <>
                  <TextField label="Personal license price" required leadingIcon="dollar-01" inputMode="decimal" value={price}
                    onChange={e => { setPrice(e.target.value); if (err.price) setErr(x => ({ ...x, price: null })); }} error={err.price || undefined}
                    helper="Most UI kits sell for $29 to $59. Icon packs for $19 to $39." />
                  <div className="sell-quick" role="group" aria-label="Suggested prices">{SUGGESTED.map(p => <Chip key={p} selected={num === p} onClick={() => { setPrice(String(p)); setErr(x => ({ ...x, price: null })); }}>${p}</Chip>)}</div>
                </>}
              <div className="sell-lics" aria-live="polite">
                {LICENSES.map(l => {
                  const p = priceFor({ price: personal }, l.value);
                  return (
                    <div key={l.value} className="sell-lic">
                      <div className="sell-lic__text"><span className="sell-lic__name">{l.title}{l.mult > 1 && <span className="sell-lic__mult">×{l.mult}</span>}</span><span className="sell-lic__desc">{l.description}</span></div>
                      <div className="sell-lic__price"><span className="mds-num">{money(p)}</span>{p > 0 && <small className="mds-num">you keep {cash(p * 0.9)}</small>}</div>
                    </div>
                  );
                })}
              </div>
              <p className="sell-keepnote"><span className="sell-keepnote__pct">90%</span><span>You keep 90% of every sale{personal > 0 ? `. On a ${money(personal)} Personal sale that’s ${cash(personal * 0.9)}` : ''}. Payouts land every Monday.</span></p>
            </div>}

            {step === 4 && <div className="sell-fields">
              <dl className="sell-review">
                {[
                  ['Files', [done && done + ' file' + (done > 1 ? 's' : ''), figma.trim() && 'Figma link'].filter(Boolean).join(' + '), 0],
                  ['Title', title.trim(), 1],
                  ['Category', (SELL_CATS.find(c => c.id === category) || {}).label, 1],
                  ['Formats', formats.join(', '), 1],
                  ['Included', includes.join(' · '), 1],
                  ['Cover', (KINDS.find(k => k.id === pv.kind) || {}).label + ', ' + (COLORS.find(c => c.id === bg) || {}).label.toLowerCase(), 2],
                  ['Price', free ? 'Free' : `${money(personal)} Personal · ${money(priceFor({ price: personal }, 'commercial'))} Commercial · ${money(priceFor({ price: personal }, 'extended'))} Extended`, 3],
                ].map(([k, v, i]) => <div key={k} className="sell-review__row"><dt>{k}</dt><dd>{v || '—'}</dd><Button variant="tertiary" size="sm" onClick={() => jump(i)} aria-label={'Edit ' + k.toLowerCase()}>Edit</Button></div>)}
              </dl>
              <div className="sell-review__tile"><span className="sell-aside__label">How it shows in the shop</span><Preview a={draft} /></div>
              <div>
                <Checkbox label="I made this, and I have the rights to sell it" checked={rights} onChange={e => { setRights(e.target.checked); setErr(x => ({ ...x, rights: null })); }} aria-invalid={err.rights ? 'true' : undefined} />
                {err.rights && <p className="sell-error" tabIndex={-1}><Icon name="alert-circle" size={16} />{err.rights}</p>}
              </div>
            </div>}
          </div>

          <div className="sell-nav">
            {step > 0 ? <Button variant="secondary" leadingIcon="arrow-left-01" onClick={back}>Back</Button> : <Button variant="ghost" onClick={() => go('dashboard')}>Cancel</Button>}
            <Button type="submit" size="lg" loading={publishing} trailingIcon={step < 4 ? 'arrow-right-01' : undefined} leadingIcon={step === 4 && !publishing ? 'rocket-01' : undefined}>
              {step < 4 ? 'Next: ' + STEPS[step + 1].label : publishing ? 'Publishing' : 'Publish listing'}</Button>
          </div>
        </form>

        <aside className="sell-aside" aria-label="Live preview">
          <div className="sell-aside__in">
            <span className="sell-aside__label"><span className="dot" />Live preview</span>
            <Preview a={draft} />
            <dl className="sell-aside__facts">
              <div><dt>Personal</dt><dd className="mds-num">{money(personal)}</dd></div>
              <div><dt>Commercial</dt><dd className="mds-num">{money(priceFor({ price: personal }, 'commercial'))}</dd></div>
              <div><dt>Extended</dt><dd className="mds-num">{money(priceFor({ price: personal }, 'extended'))}</dd></div>
            </dl>
            {(formats.length > 0 || includes.length > 0) && <div className="sell-aside__tags">{formats.map(f => <span key={f} className="tag">{f}</span>)}</div>}
            <p className="sell-aside__hint">Updates as you type. Buyers see this card in the shop, on your profile and in search.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* The real shop card, made inert so the draft can't be opened, saved or added to a cart. */
function Preview({ a }) {
  return <div className="sell-preview" ref={el => { if (el) el.setAttribute('inert', ''); }}><AssetTile a={a} /></div>;
}

Sell.title = 'Open your stall';
export default Sell;
