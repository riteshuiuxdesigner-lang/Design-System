// Shared documentation UI: code blocks, live examples, do/don't cards, props tables.
import SRC from './gen/sources.json';

const D = window.MarketplaceDS;
const { useState, useEffect, useRef } = React;

/* ---------- copy ---------- */
export function copyText(text) {
  try {
    return navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
  } catch (e) { return Promise.resolve(fallbackCopy(text)); }
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta); return ok;
}
let toastTimer;
export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { window.__siteToast = (m) => { setMsg(m); clearTimeout(toastTimer); toastTimer = setTimeout(() => setMsg(null), 2200); }; }, []);
  return msg;
}
export function notify(m) { if (window.__siteToast) window.__siteToast(m); }

export function CopyButton({ text, label = 'Copy', done = 'Copied', size = 'sm', variant = 'secondary' }) {
  const [ok, setOk] = useState(false);
  return <D.Button size={size} variant={variant} leadingIcon={ok ? 'tick-02' : 'copy-01'}
    onClick={() => { copyText(typeof text === 'function' ? text() : text).then(() => { setOk(true); notify(done); setTimeout(() => setOk(false), 1600); }); }}>{ok ? done : label}</D.Button>;
}

/* ---------- syntax highlighting (JSX / HTML / CSS) ---------- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function highlight(code, lang) {
  const rules = lang === 'css'
    ? [[/\/\*[\s\S]*?\*\//y, 'c'], [/@[a-z-]+/y, 'k'], [/--[\w-]+/y, 'v'], [/[.#][\w-]+(?=[^{}]*\{)/y, 't'], [/"[^"]*"|'[^']*'/y, 's'], [/-?\d*\.?\d+(px|ms|%|deg|s|vh|vw)?/y, 'n'], [/[a-z-]+(?=\s*:)/y, 'a']]
    : [[/\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/y, 'c'], [/"[^"]*"|'[^']*'|`[^`]*`/y, 's'], [/<\/?[A-Za-z][\w.-]*|\/?>/y, 't'], [/\b(import|from|export|const|let|var|function|return|if|else|true|false|null|undefined|new)\b/y, 'k'], [/\b[A-Z][A-Za-z]+\b/y, 'v'], [/[\w-]+(?==)/y, 'a'], [/\b\d+(\.\d+)?\b/y, 'n']];
  let i = 0, outp = '', plain = '';
  while (i < code.length) {
    let hit = null;
    for (const [re, cls] of rules) { re.lastIndex = i; const m = re.exec(code); if (m && m[0].length) { hit = [m[0], cls]; break; } }
    if (hit) { outp += esc(plain) + `<span class="tk-${hit[1]}">${esc(hit[0])}</span>`; plain = ''; i += hit[0].length; }
    else { plain += code[i]; i++; }
  }
  return outp + esc(plain);
}

export function CodeBlock({ code, lang = 'jsx', title, maxHeight, copy = true }) {
  return (
    <div className="code">
      {(title || copy) && <div className="code__bar">
        <span className="code__lang">{title || lang.toUpperCase()}</span>
        {copy && <CopyButton text={code} variant="ghost" />}
      </div>}
      <pre className="code__pre" style={{ maxHeight }} tabIndex={0}><code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} /></pre>
    </div>
  );
}

/* ---------- HTML + CSS extraction from a rendered example ---------- */
const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
export function prettyHTML(html, keepSvg) {
  if (!keepSvg) html = html.replace(/(<svg[^>]*data-icon="([^"]+)"[^>]*>)[\s\S]*?<\/svg>/g, (m, open, name) => open + `<!-- ${name}.svg paths -->` + '</svg>');
  html = html.replace(/ style=""/g, '');
  const tokens = html.split(/(<[^>]+>)/).filter(t => t.trim() !== '');
  let depth = 0; const lines = [];
  for (const t of tokens) {
    if (t.startsWith('</')) { depth = Math.max(0, depth - 1); lines.push('  '.repeat(depth) + t); }
    else if (t.startsWith('<!--')) lines.push('  '.repeat(depth) + t);
    else if (t.startsWith('<')) { lines.push('  '.repeat(depth) + t); const name = (t.match(/^<([\w-]+)/) || [])[1] || ''; if (!VOID.test(name) && !t.endsWith('/>')) depth++; }
    else lines.push('  '.repeat(depth) + t.trim());
  }
  // collapse <tag>text</tag> onto one line
  const outl = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i], b = lines[i + 1], c = lines[i + 2];
    if (b && c && /^\s*<[^/!][^>]*>$/.test(a) && !/^\s*</.test(b) && /^\s*<\//.test(c) && (a.trim() + b.trim() + c.trim()).length < 110) { outl.push(a + b.trim() + c.trim()); i += 2; }
    else if (b && /^\s*<[^/!][^>]*>$/.test(a) && /^\s*<\//.test(b) && (a.trim() + b.trim()).length < 110 && a.match(/^\s*/)[0].length === b.match(/^\s*/)[0].length) { outl.push(a + b.trim()); i += 1; }
    else outl.push(a);
  }
  return outl.join('\n');
}
let bundleRules = null;
function getBundleRules() {
  if (bundleRules) return bundleRules;
  bundleRules = [];
  for (const sh of document.styleSheets) {
    if (!sh.href || !/bundle\.css/.test(sh.href)) continue;
    try { for (const r of sh.cssRules) bundleRules.push(r); } catch (e) {}
  }
  return bundleRules;
}
export function cssFor(classes) {
  const out = [], frames = new Set();
  const match = sel => classes.some(c => new RegExp('\\.' + c + '(?![\\w-])').test(sel));
  for (const r of getBundleRules()) {
    if (r.selectorText && match(r.selectorText)) { out.push(r.cssText); (r.style.animationName || r.style.animation || '').split(/[\s,]+/).forEach(n => /^mds-/.test(n) && frames.add(n)); }
    else if (r.media && r.cssRules) {
      const inner = [...r.cssRules].filter(x => x.selectorText && match(x.selectorText)).map(x => '  ' + x.cssText);
      if (inner.length) out.push(`@media ${r.media.mediaText} {\n${inner.join('\n')}\n}`);
    }
  }
  for (const r of getBundleRules()) if (r.type === 7 && frames.has(r.name)) out.push(r.cssText);
  return out.map(fmtRule).join('\n');
}
function fmtRule(t) {
  if (/^@/.test(t)) return t;
  const m = t.match(/^([^{]+)\{([\s\S]*)\}$/);
  if (!m) return t;
  const decls = m[2].split(/;(?![^(]*\))/).map(s => s.trim()).filter(Boolean);
  return `${m[1].trim()} {\n${decls.map(d => '  ' + d + ';').join('\n')}\n}`;
}
export function classesIn(el) {
  const set = new Set();
  el.querySelectorAll('[class]').forEach(n => String(n.className.baseVal !== undefined ? n.className.baseVal : n.className).split(/\s+/).forEach(c => /^mds-/.test(c) && set.add(c.replace(/--.*$/, '').replace(/__.*$/, ''))));
  return [...set];
}
export function tokensIn(css) { return [...new Set(css.match(/var\(--[\w-]+\)/g) || [])].map(v => v.slice(4, -1)); }

/* ---------- live example with code panel ---------- */
export function importsFor(code) {
  const used = SRC.exports.filter(n => new RegExp('<' + n + '[\\s/>]').test(code));
  const hooks = ['useState', 'useEffect', 'useRef'].filter(n => code.includes(n + '('));
  let s = '';
  if (hooks.length) s += `import { ${hooks.join(', ')} } from "react";\n`;
  if (used.length) s += `import { ${used.join(', ')} } from "@marketplace/ds";\n`;
  return s ? s + '\n' : '';
}

export function Example({ ex, title, desc, stage = 'default', align, open: openDefault, id }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(!!openDefault);
  const [lang, setLang] = useState('react');
  const [svg, setSvg] = useState(false);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const Render = ex.render;
  useEffect(() => {
    if (!open || !ref.current) return;
    const read = () => { setHtml(prettyHTML(ref.current.innerHTML, svg)); setCss(cssFor(classesIn(ref.current))); };
    read();
    const mo = new MutationObserver(read); mo.observe(ref.current, { subtree: true, childList: true, attributes: true, characterData: true });
    return () => mo.disconnect();
  }, [open, svg, lang]);
  const react = importsFor(ex.code) + (/^function\s/.test(ex.code) ? ex.code : `export default function Example() {\n  return (\n    <>\n${ex.code.split('\n').map(l => '    ' + l).join('\n')}\n    </>\n  );\n}`);
  return (
    <section className="ex" id={id}>
      {title && <h3 className="ex__title">{title}</h3>}
      {desc && <p className="ex__desc">{desc}</p>}
      <div className={'ex__frame' + (open ? ' ex__frame--open' : '')}>
        <div className={'ex__stage ex__stage--' + stage} style={align ? { justifyContent: align } : undefined}>
          <div className="ex__render" ref={ref}><Render /></div>
        </div>
        <div className="ex__toolbar">
          <D.Button size="sm" variant="ghost" leadingIcon="command" aria-expanded={String(open)} onClick={() => setOpen(!open)}>{open ? 'Hide code' : 'Show code'}</D.Button>
          <span className="grow" />
          <CopyButton text={react} label="Copy React" variant="ghost" />
        </div>
        {open && <div className="ex__code">
          <div className="ex__code-tabs">
            <D.Tabs label="Code format" value={lang} onChange={setLang} items={[{ value: 'react', label: 'React' }, { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' }]} />
            {lang === 'html' && <D.Switch label="Include icon SVG" checked={svg} onChange={e => setSvg(e.target.checked)} />}
          </div>
          {lang === 'react' && <CodeBlock code={react} lang="jsx" title="React · uses window.MarketplaceDS / @marketplace/ds" />}
          {lang === 'html' && <CodeBlock code={html} lang="html" title="HTML · rendered markup (needs tokens.css + bundle.css)" maxHeight={420} />}
          {lang === 'css' && <CodeBlock code={css} lang="css" title="CSS · the rules this example uses, from bundle.css" maxHeight={420} />}
        </div>}
      </div>
    </section>
  );
}

/* ---------- Do / Don't ---------- */
export function DoDont({ items }) {
  return (
    <div className="dd">
      {items.map((it, i) => (
        <div className="dd__pair" key={i}>
          <figure className="dd__card dd__card--do">
            <div className="dd__stage">{it.do}</div>
            <figcaption><span className="dd__label dd__label--do"><D.Icon name="checkmark-circle-02" size={20} />Do</span>{it.doText}</figcaption>
          </figure>
          <figure className="dd__card dd__card--dont">
            <div className="dd__stage">{it.dont}</div>
            <figcaption><span className="dd__label dd__label--dont"><D.Icon name="cancel-01" size={20} />Don’t</span>{it.dontText}</figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}
/* Single caution card (for “avoid” examples that have no paired “do”). */
export function Caution({ children, text }) {
  return <figure className="dd__card dd__card--caution"><div className="dd__stage">{children}</div><figcaption><span className="dd__label dd__label--caution"><D.Icon name="alert-02" size={20} />Caution</span>{text}</figcaption></figure>;
}

/* ---------- Props table ---------- */
export function PropsTable({ props }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>{props.map(([name, type, def, desc]) => (
          <tr key={name}><td><code className="ic ic--prop">{name}</code></td><td><code className="ic ic--type">{type}</code></td><td>{def ? <code className="ic">{def}</code> : <span className="muted">–</span>}</td><td>{desc}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function SourceOf(name) { return SRC.sources[name] || ''; }
export const EXPORTS = SRC.exports;

/* ---------- small layout helpers ---------- */
export function H2({ id, children }) { return <h2 className="h2" id={id}>{children}<a className="h2__anchor" href={'#' + (window.__route || '') } aria-hidden="true" tabIndex={-1} /></h2>; }
export function Lead({ children }) { return <p className="lead">{children}</p>; }
export function P({ children }) { return <p className="p">{children}</p>; }
export function List({ items, tone }) {
  return <ul className={'list' + (tone ? ' list--' + tone : '')}>{items.map((x, i) => <li key={i}>{tone && <D.Icon name={tone === 'yes' ? 'tick-02' : 'cancel-01'} size={16} />}<span>{x}</span></li>)}</ul>;
}
export function Callout({ icon = 'sparkles', title, children, sticker = 'pop-yellow' }) {
  return <div className="callout"><span className="callout__icon" style={{ background: 'var(--' + sticker + ')' }}><D.Icon name={icon} variant="twotone" size={24} /></span><div><div className="callout__title">{title}</div><div className="callout__body">{children}</div></div></div>;
}
export function TokenRef({ name }) { return <a className="tokref" href={'#tokens'} onClick={() => { window.__tokenQuery = name; }}><code>{name}</code></a>; }
export function Grid({ min = 240, gap = 16, children }) { return <div className="grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`, gap }}>{children}</div>; }
