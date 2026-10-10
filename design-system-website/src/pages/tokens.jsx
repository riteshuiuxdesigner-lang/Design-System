import { Lead, P, H2, List, Callout, CodeBlock, copyText, notify } from '../ui.jsx';
import T from '../gen/tokens.json';

const PRIM = Object.fromEntries(T.primitives.map(p => [p.n, p]));
const SEM = Object.fromEntries(T.semantic.map(p => [p.n, p]));
const isColor = v => typeof v === 'string' && /^#|^rgba?\(/.test(v);
function resolve(n) { // component alias → semantic → value
  if (SEM[n]) return { light: SEM[n].rl, dark: SEM[n].rd };
  if (PRIM[n]) return { light: PRIM[n].v, dark: PRIM[n].v };
  return { light: '', dark: '' };
}
function fmt(v, n) { if (typeof v === 'number') return /weight|count|columns/.test(n) ? String(v) : /duration/.test(n) ? v + 'ms' : v + 'px'; return String(v); }

function Copyable({ text, children }) {
  return <button type="button" className="tcopy" onClick={() => copyText(text).then(() => notify('Copied ' + text))} title={'Copy ' + text}>{children || <code>{text}</code>}<Icon name="copy-01" size={16} /></button>;
}
function Val({ v, n }) {
  return <span className="tval">{isColor(v) && <span className="swatch swatch--sm" style={{ background: v }} />}<span>{fmt(v, n)}</span></span>;
}

const TIERS = {
  color: { label: 'Color', rows: () => T.semantic.filter(t => t.t === 'color') },
  space: { label: 'Spacing, size, radius', rows: () => T.semantic.filter(t => /^(space|size|radius|border-width)\//.test(t.n)) },
  effects: { label: 'Elevation, motion, opacity', rows: () => T.semantic.filter(t => t.t !== 'color' && !/^(space|size|radius|border-width)\//.test(t.n)) },
  responsive: { label: 'Responsive', rows: () => T.responsive },
  component: { label: 'Component', rows: () => T.component },
  primitives: { label: 'Primitives', rows: () => T.primitives },
};

function TokenTable({ tier }) {
  const [q, setQ] = React.useState(window.__tokenQuery || '');
  React.useEffect(() => { window.__tokenQuery = ''; }, []);
  const all = TIERS[tier].rows();
  const query = q.trim().toLowerCase().replace(/^--/, '');
  const rows = all.filter(t => !query || [t.n, t.css, t.code, t.note, t.alias].filter(Boolean).join(' ').toLowerCase().replace(/\//g, '-').includes(query.replace(/\//g, '-')));
  const shown = rows.slice(0, 400);
  return (
    <div>
      <div className="ttools"><SearchField placeholder={'Filter ' + all.length + ' tokens'} value={q} onChange={setQ} shortcut={false} className="tsearch" /><span className="card__body">{rows.length} shown</span></div>
      <div className="tbl-wrap"><table className="tbl ttbl">
        {tier === 'responsive' ? <>
          <thead><tr><th>Token</th><th>Desktop</th><th>Tablet</th><th>Mobile</th></tr></thead>
          <tbody>{shown.map(t => <tr key={t.n}><td><Copyable text={'var(' + t.css + ')'} /><div className="tfig">{t.n}</div></td>{['Desktop', 'Tablet', 'Mobile'].map(m => <td key={m}><Val v={t.r[m]} n={t.n} /></td>)}</tr>)}</tbody>
        </> : tier === 'component' ? <>
          <thead><tr><th>Token</th><th>Alias of</th><th>Light</th><th>Dark</th></tr></thead>
          <tbody>{shown.map(t => { const r = resolve(t.alias); return <tr key={t.n}><td><Copyable text={'var(' + t.css + ')'} /><div className="tfig">{t.n}</div></td><td><code className="ic">{t.alias}</code></td><td><Val v={r.light} n={t.alias} /></td><td><Val v={r.dark} n={t.alias} /></td></tr>; })}</tbody>
        </> : tier === 'primitives' ? <>
          <thead><tr><th>Token</th><th>Value</th></tr></thead>
          <tbody>{shown.map(t => <tr key={t.n}><td><Copyable text={'var(' + t.css + ')'} /><div className="tfig">{t.n}</div></td><td><Val v={t.v} n={t.n} /></td></tr>)}</tbody>
        </> : <>
          <thead><tr><th>Token (code)</th><th>Light</th><th>Dark</th><th>Use for</th></tr></thead>
          <tbody>{shown.map(t => <tr key={t.n}>
            <td><Copyable text={'var(' + (t.code || t.css) + ')'} /><div className="tfig">Figma: {t.n}{t.code ? <> · <span>{'var(' + t.css + ')'}</span></> : null}</div></td>
            <td><Val v={t.rl} n={t.n} /><div className="tfig">{typeof t.light === 'string' && PRIM[t.light] ? t.light : ''}</div></td>
            <td><Val v={t.rd} n={t.n} /><div className="tfig">{typeof t.dark === 'string' && PRIM[t.dark] ? t.dark : ''}</div></td>
            <td className="tnote">{t.note}</td>
          </tr>)}</tbody>
        </>}
      </table></div>
      {rows.length > shown.length && <P>Showing the first {shown.length}. Filter to narrow it down.</P>}
    </div>
  );
}

function tierPage(id, tier, order, title, lead) {
  return { id, title, section: 'Tokens', order, render: () => <><h1 className="h1">{title}</h1><Lead>{lead}</Lead><div style={{ marginTop: 32 }}><TokenTable tier={tier} /></div></> };
}

const tokensOverview = {
  id: 'tokens', title: 'Overview', section: 'Tokens', order: 1,
  render: () => (
    <>
      <h1 className="h1">Tokens</h1>
      <Lead>Tokens are named design decisions. The same names live in Figma variables and in CSS, so a change in one place updates every screen in both.</Lead>
      <div className="tiers">
        {[
          ['Primitives', T.primitives.length, 'Raw values: the neutral scale, blue scale, 4px steps, radii, font sizes. Hidden from Figma pickers.', 'color/blue/600 = #3263e4', 'pop-yellow'],
          ['Semantic', T.semantic.length, 'Roles with Light and Dark values. This is what you use day to day.', 'action-primary-default → blue/600', 'pop-lime'],
          ['Component', T.component.length, 'Per-component decisions that alias semantic tokens, so one component can change without touching the rest.', 'button/primary/bg/default → action/primary/default', 'pop-pink'],
          ['Responsive', T.responsive.length, 'Type sizes and layout values for Desktop, Tablet and Mobile.', 'type/heading-1/size: 48 → 40 → 36', 'pop-violet'],
        ].map(([n, c, b, e, s], i) => (
          <div className="tier" key={n}>
            <span className="tier__n" style={{ background: 'var(--' + s + ')' }}>{c}</span>
            <div className="card__title">{n}</div><div className="card__body">{b}</div><code className="ic ic--type">{e}</code>
            {i < 2 && <span className="tier__arrow" aria-hidden="true"><Icon name="arrow-right-01" size={20} /></span>}
          </div>
        ))}
      </div>
      <H2>How to use them</H2>
      <List items={[
        'Use semantic tokens for everything you build. They switch with Light and Dark on their own.',
        'Use component tokens only when you style a library component or build a close variant of one.',
        'Never use primitives or raw values in product code. If no semantic token fits, ask for one.',
        'In Figma, bind every fill, stroke, gap, padding and radius to a variable. Dev Mode then shows engineers the CSS name.',
      ]} />
      <CodeBlock lang="css" title="Example" code={'.license-card {\n  background: var(--bg-surface);              /* white · #181818 in Dark */\n  border: 1px solid var(--border-default);\n  border-radius: var(--radius-lg);             /* 16px */\n  padding: var(--space-md);                    /* 16px */\n}\n.license-card[aria-checked="true"] {\n  border: 2px solid var(--border-selected);\n}'} />
      <H2>Names in Figma and code</H2>
      <P>Figma variables use slashes (<code className="ic">color/bg/surface</code>). In CSS they become <code className="ic">--color-bg-surface</code>, and the bundle also gives each one a short name (<code className="ic">--bg-surface</code>). Both are defined in <code className="ic">tokens.css</code> and resolve to the same value.</P>
      <H2>Browse</H2>
      <div className="related">{Object.entries({ 'tokens-color': ['Color', T.semantic.filter(t => t.t === 'color').length], 'tokens-space': ['Spacing, size, radius', TIERS.space.rows().length], 'tokens-effects': ['Elevation, motion, opacity', TIERS.effects.rows().length], 'tokens-responsive': ['Responsive', T.responsive.length], 'tokens-component': ['Component', T.component.length], 'tokens-primitives': ['Primitives', T.primitives.length] }).map(([id, [l, c]]) => <a key={id} href={'#' + id} className="related__card"><span className="related__name">{l}</span><span className="related__sum">{c} tokens</span></a>)}</div>
    </>
  ),
};

export default [
  tokensOverview,
  tierPage('tokens-color', 'color', 2, 'Color tokens', 'Every semantic color with its Light and Dark value. Click a name to copy the CSS variable.'),
  tierPage('tokens-space', 'space', 3, 'Spacing, size and radius', 'Space on the 4px grid, fixed sizes for controls, icons and avatars, and corner radii.'),
  tierPage('tokens-effects', 'effects', 4, 'Elevation, motion and more', 'Shadow colors, motion durations and easing curves, and opacity.'),
  tierPage('tokens-responsive', 'responsive', 5, 'Responsive tokens', 'Type sizes and layout values that change at the Tablet (< 1024px) and Mobile (< 640px) breakpoints.'),
  tierPage('tokens-component', 'component', 6, 'Component tokens', 'Per-component decisions. Each one aliases a semantic token, so you can retune one component without touching the rest.'),
  tierPage('tokens-primitives', 'primitives', 7, 'Primitives', 'The raw palette and scales behind everything. Don’t use these directly in product code.'),
];
