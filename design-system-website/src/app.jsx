import DOCS from './gen/docs-index.js';
import PAGES from './pages/index.js';
import { Example, CodeBlock, PropsTable, DoDont, SourceOf, cssFor, classesIn, tokensIn, CopyButton, useToast, List, H2, EXPORTS } from './ui.jsx';

const D = window.MarketplaceDS;
const { useState, useEffect, useRef, useMemo } = React;
const FIGMA = 'https://www.figma.com/design/sc4yzKdTRekt8TLQZYPkAV/Claude-design-system';
const VERSION = '1.0.0';
const GROUPS = ['Actions', 'Inputs', 'Selection', 'Data display', 'Feedback', 'Navigation', 'Overlays', 'Media', 'Layout'];
const DOC_BY_ID = Object.fromEntries(DOCS.map(d => [d.id, d]));
const PAGE_BY_ID = Object.fromEntries(PAGES.map(p => [p.id, p]));

/* ---------- navigation model ---------- */
function navSections() {
  const sec = name => PAGES.filter(p => p.section === name).sort((a, b) => (a.order || 0) - (b.order || 0)).map(p => ({ id: p.id, label: p.title }));
  const comps = GROUPS.map(g => ({ group: g, items: DOCS.filter(d => d.group === g).sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name)).map(d => ({ id: d.id, label: d.name, badge: d.status === 'Beta' ? 'Beta' : null })) })).filter(g => g.items.length);
  return [
    { label: 'Get started', icon: 'rocket-01', items: sec('Get started') },
    { label: 'Foundations', icon: 'paint-board', items: sec('Foundations') },
    { label: 'Tokens', icon: 'layers-01', items: sec('Tokens') },
    { label: 'Accessibility', icon: 'view', items: sec('Accessibility') },
    { label: 'Components', icon: 'package', groups: comps },
    { label: 'Patterns', icon: 'dashboard-square-01', items: sec('Patterns') },
    { label: 'Resources', icon: 'folder-01', items: sec('Resources') },
  ];
}
function flatNav() {
  const out = [];
  for (const s of navSections()) {
    (s.items || []).forEach(i => out.push({ ...i, section: s.label }));
    (s.groups || []).forEach(g => g.items.forEach(i => out.push({ ...i, section: 'Components · ' + g.group })));
  }
  return out;
}

/* ---------- routing: #page or #page.tab (bare tokens only) ---------- */
function parseHash() {
  const h = decodeURIComponent((location.hash || '').slice(1));
  const [page, tab] = h.split('.');
  return { page: page || 'overview', tab: tab || null };
}
function useRoute() {
  const [r, setR] = useState(parseHash());
  useEffect(() => { const f = () => { setR(parseHash()); }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return r;
}
export function go(page, tab) { location.hash = page + (tab ? '.' + tab : ''); }

/* ---------- theme ---------- */
function readTheme() { try { return localStorage.getItem('mds-theme') || 'system'; } catch (e) { return 'system'; } }
function applyTheme(t) {
  const el = document.documentElement;
  if (t === 'system') el.removeAttribute('data-theme'); else el.setAttribute('data-theme', t);
  try { localStorage.setItem('mds-theme', t); } catch (e) {}
}

/* ---------- shell ---------- */
function Header({ theme, setTheme, onMenu, onSearch }) {
  return (
    <header className="hdr">
      <D.IconButton className="hdr__menu" icon="menu-01" label="Open navigation" onClick={onMenu} />
      <a className="hdr__brand" href="#overview" aria-label="Marketplace Design System home">
        <span className="mds-logo__mark" />
        <span className="hdr__name">Marketplace <span className="hdr__ds">Design System</span></span>
      </a>
      <D.Badge variant="neutral" className="hdr__ver">v{VERSION}</D.Badge>
      <button className="hdr__search" type="button" onClick={onSearch} aria-label="Search the docs">
        <D.Icon name="search-01" size={20} /><span>Search components, tokens, guides</span><kbd className="mds-kbd">⌘K</kbd>
      </button>
      <span className="grow" />
      <D.Tabs className="hdr__theme" label="Theme" value={theme} onChange={setTheme}
        items={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'Auto' }]} />
      <a className="mds-btn mds-btn--secondary mds-btn--sm hdr__figma" href={FIGMA} target="_blank" rel="noopener noreferrer"><D.Icon name="pen-tool-01" size={16} />Figma library</a>
    </header>
  );
}

function Sidebar({ route, open, onClose }) {
  const sections = useMemo(navSections, []);
  const [closed, setClosed] = useState({});
  const current = route.page;
  const link = (it) => (
    <a key={it.id} href={'#' + it.id} className="nav__item" aria-current={current === it.id ? 'page' : undefined} onClick={onClose}>
      <span>{it.label}</span>{it.badge && <D.Badge variant="yellow">{it.badge}</D.Badge>}
    </a>
  );
  return (
    <>
      <div className={'nav-scrim' + (open ? ' nav-scrim--open' : '')} onClick={onClose} />
      <nav className={'nav' + (open ? ' nav--open' : '')} aria-label="Documentation">
        {sections.map(s => {
          const isClosed = closed[s.label];
          return (
            <div className="nav__section" key={s.label}>
              <button type="button" className="nav__head" aria-expanded={String(!isClosed)} onClick={() => setClosed({ ...closed, [s.label]: !isClosed })}>
                <D.Icon name={s.icon} size={20} /><span>{s.label}</span><D.Icon name="arrow-down-01" size={16} className={'nav__chev' + (isClosed ? ' nav__chev--closed' : '')} />
              </button>
              {!isClosed && <div className="nav__items">
                {(s.items || []).map(link)}
                {(s.groups || []).map(g => <div key={g.group} className="nav__group"><div className="nav__glabel">{g.group}</div>{g.items.map(link)}</div>)}
              </div>}
            </div>
          );
        })}
      </nav>
    </>
  );
}

class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() { return this.state.err ? <div className="mds-alert mds-alert--error" role="alert" data-page-error="true"><D.Icon name="alert-circle" size={20} /><div><div className="mds-alert__title">This page failed to render</div><div className="mds-alert__body">{String(this.state.err && this.state.err.message)}</div></div><span /></div> : this.props.children; }
}

/* ---------- component page ---------- */
const TABS = [{ value: 'examples', label: 'Examples' }, { value: 'code', label: 'Code' }, { value: 'usage', label: 'Usage' }, { value: 'changelog', label: 'Changelog' }];

function ComponentPage({ doc, tab }) {
  const t = TABS.some(x => x.value === tab) ? tab : 'examples';
  const figmaUrl = FIGMA + (doc.figma ? '?node-id=' + doc.figma.replace(':', '-') : '');
  return (
    <article className="page">
      <nav className="crumbs" aria-label="Breadcrumb"><a href="#overview">Docs</a><D.Icon name="arrow-right-01" size={16} /><span>Components</span><D.Icon name="arrow-right-01" size={16} /><span>{doc.group}</span></nav>
      <h1 className="h1">{doc.name}</h1>
      <p className="lead">{doc.summary}</p>
      <div className="meta">
        <D.Badge variant={doc.status === 'Beta' ? 'yellow' : 'lime'} icon={doc.status === 'Beta' ? 'fire' : 'checkmark-circle-02'}>{doc.status || 'Stable'}</D.Badge>
        <a className="meta__link" href={figmaUrl} target="_blank" rel="noopener noreferrer"><D.Icon name="pen-tool-01" size={16} />Figma component</a>
        <a className="meta__link" href={'#' + doc.id + '.code'}><D.Icon name="command" size={16} />Source</a>
        <span className="meta__pkg"><code>{`import { ${(doc.exports || [doc.name.replace(/\s/g, '')]).join(', ')} } from "@marketplace/ds"`}</code><CopyButton text={`import { ${(doc.exports || [doc.name.replace(/\s/g, '')]).join(', ')} } from "@marketplace/ds";`} label="" done="" variant="ghost" /></span>
      </div>
      <div className="page__tabs"><D.Tabs label={doc.name + ' documentation'} value={t} onChange={v => go(doc.id, v === 'examples' ? null : v)} items={TABS} /></div>
      {t === 'examples' && <ExamplesTab doc={doc} />}
      {t === 'code' && <CodeTab doc={doc} />}
      {t === 'usage' && <UsageTab doc={doc} />}
      {t === 'changelog' && <ChangelogTab doc={doc} />}
      <PageFooter doc={doc} />
    </article>
  );
}

function ExamplesTab({ doc }) {
  return <div className="tabpanel">{doc.examples.map((e, i) => <Example key={doc.id + i} ex={e} title={e.title} desc={e.desc} stage={e.stage} align={e.align} open={i === 0} id={doc.id + '-ex-' + i} />)}</div>;
}

function CodeTab({ doc }) {
  const ref = useRef(null);
  const [css, setCss] = useState('');
  useEffect(() => { if (ref.current) setCss(cssFor(classesIn(ref.current))); }, [doc.id]);
  const names = doc.exports || [doc.name.replace(/\s/g, '')];
  const tokens = tokensIn(css);
  const deps = [...new Set(names.flatMap(n => (SourceOf(n).match(/h\(([A-Z][A-Za-z]+)[,)]/g) || []).map(x => x.slice(2, -1))))].filter(n => !names.includes(n) && EXPORTS.includes(n));
  return (
    <div className="tabpanel">
      <div hidden ref={ref}>{doc.examples.map((e, i) => { const R = e.render; return <R key={i} />; })}</div>
      <H2>Install</H2>
      <p className="p">Use the package in the app, or drop the four files into any page. Both ship the same components, styles and tokens.</p>
      <CodeBlock lang="jsx" title="React app" code={`import { ${names.join(', ')} } from "@marketplace/ds";\nimport "@marketplace/ds/tokens.css";\nimport "@marketplace/ds/bundle.css";`} />
      <CodeBlock lang="html" title="Plain HTML page (no build step)" code={`<link rel="stylesheet" href="tokens.css">\n<link rel="stylesheet" href="bundle.css">\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>\n<script src="bundle.js"></script>\n<script>\n  const { ${names.join(', ')} } = window.MarketplaceDS;\n</script>`} />
      <H2>Props</H2>
      {names.map(n => doc.props && doc.props[n] ? <div key={n}>{names.length > 1 && <h3 className="h3"><code>{n}</code></h3>}<PropsTable props={doc.props[n]} /></div> : null)}
      <H2>Copy the component</H2>
      <p className="p">This is the exact source in the bundle. Copy it when you need to fork a component; otherwise import it so you get fixes for free.{deps.length ? <> It uses {deps.map((d, i) => <span key={d}>{i ? ', ' : ''}<code className="ic">{d}</code></span>)} and the shared <code className="ic">cx()</code>/<code className="ic">omit()</code> helpers.</> : <> It uses the shared <code className="ic">cx()</code>/<code className="ic">omit()</code> helpers.</>}</p>
      {names.map(n => <CodeBlock key={n} lang="jsx" title={n + '.js · React'} code={SourceOf(n)} maxHeight={480} />)}
      <CodeBlock lang="jsx" title="helpers.js" code={'var R = window.React, h = R.createElement;\nfunction cx() { var out = []; for (var i = 0; i < arguments.length; i++) { if (arguments[i]) out.push(arguments[i]); } return out.join(" "); }\nfunction omit(o, keys) { var r = {}; for (var k in o) { if (keys.indexOf(k) < 0) r[k] = o[k]; } return r; }'} />
      <H2>CSS</H2>
      <p className="p">Every value is a token. Load <code className="ic">tokens.css</code> first; switch themes with <code className="ic">data-theme="dark"</code> on <code className="ic">&lt;html&gt;</code>.</p>
      <CodeBlock lang="css" title={doc.name + '.css'} code={css || '/* loading */'} maxHeight={480} />
      {tokens.length > 0 && <><H2>Tokens used</H2><div className="chips">{tokens.map(tk => <a key={tk} className="tokchip" href="#tokens" onClick={() => { window.__tokenQuery = tk.replace(/^--/, ''); }}><code>{tk}</code></a>)}</div></>}
    </div>
  );
}

function UsageTab({ doc }) {
  const u = doc.usage || {};
  return (
    <div className="tabpanel">
      {(u.when || u.whenNot) && <div className="when">
        {u.when && <div className="when__col"><h3 className="h3">When to use</h3><List items={u.when} tone="yes" /></div>}
        {u.whenNot && <div className="when__col"><h3 className="h3">When not to use</h3><List items={u.whenNot} tone="no" /></div>}
      </div>}
      {u.anatomy && <><H2>Anatomy</H2><div className="anatomy"><div className="anatomy__stage">{u.anatomy.render}</div><ol className="anatomy__list">{u.anatomy.parts.map((p, i) => <li key={i}><span className="anatomy__n">{i + 1}</span><span>{p}</span></li>)}</ol></div></>}
      {(u.sections || []).map((s, i) => <section key={i}><H2>{s.title}</H2>{typeof s.body === 'string' ? <p className="p">{s.body}</p> : s.body}{s.dos && <DoDont items={s.dos} />}</section>)}
      {u.dos && <><H2>Best practices</H2><DoDont items={u.dos} /></>}
      {u.content && <><H2>Content guidelines</H2><List items={u.content} /></>}
      {doc.a11y && <><H2>Accessibility</H2>
        {doc.a11y.keyboard && <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Key</th><th>Action</th></tr></thead><tbody>{doc.a11y.keyboard.map(([k, a]) => <tr key={k}><td><kbd className="mds-kbd">{k}</kbd></td><td>{a}</td></tr>)}</tbody></table></div>}
        {doc.a11y.notes && <List items={doc.a11y.notes} />}
      </>}
      {doc.related && <><H2>Related</H2><div className="related">{doc.related.filter(r => DOC_BY_ID[r]).map(r => <a key={r} href={'#' + r} className="related__card"><span className="related__name">{DOC_BY_ID[r].name}</span><span className="related__sum">{DOC_BY_ID[r].summary}</span></a>)}</div></>}
    </div>
  );
}

function ChangelogTab({ doc }) {
  const rows = doc.changelog || [{ v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'First release in Figma and code.' }];
  const tone = { Added: 'lime', Changed: 'violet', Fixed: 'orange', Removed: 'pink', Deprecated: 'pink' };
  return (
    <div className="tabpanel">
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Version</th><th>Date</th><th>Change</th><th>Notes</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><td><code className="ic">{r.v}</code></td><td className="mds-num">{r.date}</td><td><D.Badge variant={tone[r.type] || 'neutral'}>{r.type}</D.Badge></td><td>{r.notes}</td></tr>)}</tbody></table></div>
    </div>
  );
}

function PageFooter({ doc }) {
  const list = flatNav(); const i = list.findIndex(x => x.id === (doc ? doc.id : null));
  const prev = list[i - 1], next = list[i + 1];
  return (
    <footer className="pfoot">
      {prev ? <a className="pfoot__link" href={'#' + prev.id}><span className="pfoot__dir">Previous</span><span className="pfoot__name">{prev.label}</span></a> : <span />}
      {next ? <a className="pfoot__link pfoot__link--next" href={'#' + next.id}><span className="pfoot__dir">Next</span><span className="pfoot__name">{next.label}</span></a> : <span />}
    </footer>
  );
}

function Search({ open, onClose }) {
  const groups = useMemo(() => {
    const by = {};
    flatNav().forEach(it => { const s = it.section.split(' · ')[0]; (by[s] = by[s] || []).push({ label: it.label, hint: it.section.replace('Components · ', ''), icon: s === 'Components' ? 'package' : s === 'Tokens' ? 'layers-01' : s === 'Foundations' ? 'paint-board' : 'file-01', onSelect: () => go(it.id) }); });
    return Object.keys(by).map(k => ({ label: k, items: by[k] }));
  }, []);
  return <D.CommandPalette open={open} onClose={onClose} groups={groups} />;
}

function App() {
  const route = useRoute();
  const [theme, setThemeState] = useState(readTheme());
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const toast = useToast();
  window.__route = route.page;
  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => {
    // Links inside live examples and do/don't cards are demo content: keep people on the docs page.
    const c = e => { const a = e.target.closest && e.target.closest('a[href]'); if (a && a.closest('.ex__stage, .dd__stage, .anatomy__stage, .hero__demo')) e.preventDefault(); };
    document.addEventListener('click', c, true); return () => document.removeEventListener('click', c, true);
  }, []);
  useEffect(() => { const k = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(s => !s); } }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);
  useEffect(() => { const m = document.querySelector('.main'); if (m) m.scrollTop = 0; window.scrollTo(0, 0); }, [route.page, route.tab]);
  const doc = DOC_BY_ID[route.page];
  const page = PAGE_BY_ID[route.page];
  useEffect(() => { document.title = (doc ? doc.name : page ? page.title : 'Overview') + ' · Marketplace Design System'; }, [route.page]);
  let body;
  if (doc) body = <ComponentPage doc={doc} tab={route.tab} />;
  else if (page) { const Pg = page.render; body = <article className="page"><nav className="crumbs" aria-label="Breadcrumb"><a href="#overview">Docs</a><D.Icon name="arrow-right-01" size={16} /><span>{page.section}</span></nav><Pg tab={route.tab} /><PageFooter doc={{ id: page.id }} /></article>; }
  else body = <article className="page"><h1 className="h1">Page not found</h1><p className="lead">That page moved or never existed. Pick a page from the menu, or search with ⌘K.</p></article>;
  return (
    <div className="shell">
      <Header theme={theme} setTheme={setThemeState} onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
      <div className="body">
        <Sidebar route={route} open={menu} onClose={() => setMenu(false)} />
        <main className="main" key={route.page}><Boundary key={route.page + (route.tab || '')}>{body}</Boundary></main>
      </div>
      <Search open={search} onClose={() => setSearch(false)} />
      {toast && <div className="toast-dock"><D.Toast message={toast} /></div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
