import { Lead, P, H2, List, CodeBlock, copyText, notify } from '../ui.jsx';

const FIGMA = 'https://www.figma.com/design/sc4yzKdTRekt8TLQZYPkAV/Claude-design-system';

function FileRowCopy({ file, desc }) {
  const [state, setState] = React.useState('');
  async function copy() {
    setState('loading');
    try { const r = await fetch(file); const t = await r.text(); await copyText(t); notify('Copied ' + file); setState('done'); }
    catch (e) { setState('error'); }
    setTimeout(() => setState(''), 1800);
  }
  return (
    <div className="mds-file-row">
      <span className="mds-file-row__icon"><Icon name="file-01" size={20} /></span>
      <div className="mds-file-row__body"><div className="mds-file-row__name">{file}</div><div className="mds-file-row__meta">{desc}</div></div>
      <Button size="sm" variant="secondary" loading={state === 'loading'} leadingIcon={state === 'done' ? 'tick-02' : 'copy-01'} onClick={copy}>{state === 'done' ? 'Copied' : state === 'error' ? 'Try again' : 'Copy file'}</Button>
    </div>
  );
}

const files = {
  id: 'files', title: 'Files and links', section: 'Resources', order: 1,
  render: () => (
    <>
      <h1 className="h1">Files and links</h1>
      <Lead>Everything this site runs on. Copy a file’s contents into your project, or open the source library.</Lead>
      <div style={{ display: 'grid', gap: 12, marginTop: 32 }}>
        <FileRowCopy file="tokens.css" desc="All tokens: Light, Dark, responsive, Figma names and short names" />
        <FileRowCopy file="bundle.css" desc="Styles for every component, tokens only" />
        <FileRowCopy file="bundle.js" desc="All components as window.MarketplaceDS, with the 72 icons inlined" />
      </div>
      <H2>Links</H2>
      <List items={[
        <><a href={FIGMA} target="_blank" rel="noopener noreferrer">Figma library</a>: components, variables, text and effect styles.</>,
        <><a href="https://www.figma.com/design/elkBwz3WQxfMYRniweSYOw/Filled" target="_blank" rel="noopener noreferrer">Hugeicons Pro</a>: the full icon library (Stroke and Twotone, Rounded).</>,
        <><a href="https://claude.ai/artifact/8JEt2GBeRWRoJuPFoMsvvy" target="_blank" rel="noopener noreferrer">Design system for Claude</a>: the same tokens, icons and components, packaged for AI-assisted builds.</>,
      ]} />
    </>
  ),
};

const changelog = {
  id: 'changelog', title: 'Changelog', section: 'Resources', order: 2,
  render: () => (
    <>
      <h1 className="h1">Changelog</h1>
      <Lead>What changed in the system, newest first. Each component page also has its own changelog tab.</Lead>
      {[
        ['1.0.0', 'October 10, 2026', 'lime', 'Released', ['All 45 components coded in React and HTML/CSS, matching Figma.', 'This documentation site: examples, code you can copy, usage with visual do/don’ts, and tokens.', 'Overlays (Modal, Drawer, Command palette) gained an inline mode for previews.', 'Icons are tagged with data-icon so the HTML view stays readable.']],
        ['0.4.0', 'October 10, 2026', 'violet', 'Icons', ['Hugeicons Pro adopted: Stroke · Rounded by default, Twotone · Rounded for highlights.', 'Inter Display set as the only typeface in Figma and code.']],
        ['0.3.0', 'October 9, 2026', 'yellow', 'Foundations', ['Primary actions moved to blue-600 (#3263e4) for 5.2:1 contrast.', 'Token tiers locked: Primitives → Semantic (Light/Dark) → Component, plus Responsive.', '39 contrast pairs validated in both themes.']],
        ['0.2.0', 'October 8, 2026', 'pink', 'Direction', ['Playful direction: pills for every control, spring motion, pop stickers.', 'Neutrals became pure grey. Blue and tinted backgrounds were removed.']],
      ].map(([v, d, c, t, notes]) => (
        <section className="release" key={v}>
          <div className="release__head"><span className="release__v">{v}</span><Badge variant={c}>{t}</Badge><span className="release__date">{d}</span></div>
          <List items={notes} />
        </section>
      ))}
    </>
  ),
};

export default [files, changelog];
