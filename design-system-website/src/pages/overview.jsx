import { Lead, P, H2, List, Callout, CodeBlock, Grid, DoDont } from '../ui.jsx';
import DOCS from '../gen/docs-index.js';

const FIGMA = 'https://www.figma.com/design/sc4yzKdTRekt8TLQZYPkAV/Claude-design-system';

function Hero() {
  return (
    <div className="hero">
      <div className="hero__text">
        <h1 className="h1">Marketplace Design System</h1>
        <Lead>The shared language for everything we ship: tokens, components and rules, in Figma and in code. Playful in shape and motion, calm in color.</Lead>
        <div className="hero__ctas">
          <Button size="lg" leadingIcon="pen-tool-01" onClick={() => { location.hash = 'designers'; }}>Start as a designer</Button>
          <Button size="lg" variant="secondary" leadingIcon="command" onClick={() => { location.hash = 'engineers'; }}>Start as an engineer</Button>
        </div>
      </div>
      <div className="hero__art" aria-hidden="true">
        <span className="hero__b hero__b--y" /><span className="hero__b hero__b--b" /><span className="hero__b hero__b--p" /><span className="hero__b hero__b--l" /><span className="hero__b hero__b--k" />
        <div className="hero__demo">
          <Badge variant="yellow">New</Badge>
          <Button leadingIcon="shopping-bag-01">Buy for $49</Button>
          <Chip selected dot="pop-yellow">UI kits</Chip>
          <Switch defaultChecked label="Dark previews" />
        </div>
      </div>
    </div>
  );
}

export const overview = {
  id: 'overview', title: 'Overview', section: 'Get started', order: 1,
  render: () => (
    <>
      <Hero />
      <Grid min={220} gap={16}>
        {[
          ['Foundations', 'Color, type, spacing, shape, elevation, motion, layout and icons.', 'color', 'paint-board', 'pop-yellow'],
          ['Tokens', '772 variables in four tiers, with Light and Dark values and CSS names.', 'tokens', 'layers-01', 'pop-lime'],
          ['Components', DOCS.length + ' components with live examples, props and code you can copy.', 'button', 'package', 'pop-pink'],
          ['Accessibility', 'Contrast, focus, keyboard, touch targets and reduced motion.', 'accessibility', 'view', 'pop-violet'],
        ].map(([t, b, href, icon, c]) => (
          <a key={t} className="card" href={'#' + href}>
            <span className="sticker" style={{ background: 'var(--' + c + ')' }}><Icon name={icon} variant="twotone" size={24} /></span>
            <span className="card__title">{t}</span><span className="card__body">{b}</span>
          </a>
        ))}
      </Grid>
      <H2>Principles</H2>
      <div className="principles">
        {[
          ['Content is the interface', 'Creators’ work leads. Chrome only separates or ranks content.'],
          ['Play in shape and motion, calm in color', 'Personality comes from pills, springs, confident type and small pop stickers. Surfaces stay white, grey and black.'],
          ['One decision, made once', 'Every value is a token and every pattern is a component. Never hardcode a hex, size or radius.'],
          ['Accessible by construction', 'Text is 4.5:1, controls and focus are 3:1, touch targets are 44px, and color is never the only signal.'],
          ['Delight on response', 'Every action answers at once with a squish, pop or check. Nothing moves under reduced motion.'],
          ['Density is a choice', 'Use the 4px grid. Be generous by default and compact only on purpose.'],
        ].map(([t, b], i) => <div key={t} className="principle"><span className="principle__n">{i + 1}</span><div><div className="card__title">{t}</div><div className="card__body">{b}</div></div></div>)}
      </div>
      <H2>What’s in the system</H2>
      <div className="tbl-wrap"><table className="tbl"><tbody>
        <tr><td><strong>Figma library</strong></td><td>772 variables, 12 text styles, 7 effect styles and 70 components with docs. <a href={FIGMA} target="_blank" rel="noopener noreferrer">Open in Figma</a></td></tr>
        <tr><td><strong>Code</strong></td><td>{DOCS.length} documented React components in one bundle, styled only with tokens. The same files power this site.</td></tr>
        <tr><td><strong>Tokens</strong></td><td>Primitives → Semantic (Light/Dark) → Component, plus Responsive (Desktop/Tablet/Mobile).</td></tr>
        <tr><td><strong>Typeface</strong></td><td>Inter Display at 400, 500, 600 and 700. Nothing else.</td></tr>
        <tr><td><strong>Icons</strong></td><td>Hugeicons Pro. Stroke · Rounded by default, Twotone · Rounded for highlights.</td></tr>
      </tbody></table></div>
      <Callout icon="message-01" title="Something missing or wrong?" sticker="pop-orange">Ask in #design-system with a screenshot. Never fork a component quietly. If the system can’t do what you need, we add it once for everyone.</Callout>
    </>
  ),
};

export const designers = {
  id: 'designers', title: 'For designers', section: 'Get started', order: 2,
  render: () => (
    <>
      <h1 className="h1">For designers</h1>
      <Lead>Design with the library, not around it. Everything you place should come from the Figma library: components, variables, text styles and icons.</Lead>
      <H2>Set up Figma</H2>
      <List items={[
        <>Open the <a href={FIGMA} target="_blank" rel="noopener noreferrer">Claude design system</a> file and enable it as a library in your team.</>,
        'Install Inter Display (400, 500, 600, 700) on your machine. The text styles use it, and nothing else.',
        'Enable the Hugeicons Pro library. Use Style=Stroke, Type=Rounded for interface icons and Style=Twotone, Type=Rounded only for highlights.',
        'Set your frame’s Semantic mode to Light or Dark to preview a theme. Never draw a separate dark component.',
      ]} />
      <H2>How to work</H2>
      <DoDontInline />
      <H2>Handoff checklist</H2>
      <List tone="yes" items={[
        'Every fill, stroke, gap, padding and radius is bound to a variable. Dev Mode shows the token name.',
        'Text uses a text style (display, heading-1…4, body, label, caption, numeric).',
        'Screens are checked in Light and Dark, and at Desktop, Tablet and Mobile widths.',
        'Interactive states are shown: hover, pressed, focus, disabled, loading, error and empty.',
        'Copy follows the content rules: sentence case, verbs on buttons, errors that explain the fix.',
      ]} />
    </>
  ),
};

function DoDontInline() {
  return <DoDont items={[
    {
      do: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary">Preview</Button><Button>Publish</Button></div>,
      doText: 'Use library components and change them only through their properties.',
      dont: <div style={{ display: 'flex', gap: 8 }}><button style={{ height: 40, padding: '0 18px', borderRadius: 8, border: 0, background: 'var(--blue-400)', color: 'var(--white)', font: '600 14px/20px var(--font-display)' }}>Publish</button></div>,
      dontText: 'Don’t detach and restyle. A square, lighter blue button breaks the system and misses its states.',
    },
    {
      do: <div style={{ padding: 16, borderRadius: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', width: 260 }}><div style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Orbit Dashboard UI Kit</div><div style={{ font: '400 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>120 screens · Figma</div></div>,
      doText: 'Put content on white, grey or black surfaces.',
      dont: <div style={{ padding: 16, borderRadius: 16, background: 'var(--blue-50)', width: 260 }}><div style={{ font: '600 15px/20px var(--font-display)', color: 'var(--blue-700)' }}>Orbit Dashboard UI Kit</div><div style={{ font: '400 14px/20px var(--font-display)', color: 'var(--blue-600)' }}>120 screens · Figma</div></div>,
      dontText: 'Don’t put a blue or tinted wash behind content. Blue is for actions and focus only.',
    },
  ]} />;
}

export const engineers = {
  id: 'engineers', title: 'For engineers', section: 'Get started', order: 3,
  render: () => (
    <>
      <h1 className="h1">For engineers</h1>
      <Lead>Import components instead of rebuilding them, and style anything custom with tokens. Every page on this site has code you can copy.</Lead>
      <H2>Install</H2>
      <CodeBlock lang="jsx" title="React app" code={'import { Button, TextField, AssetCard } from "@marketplace/ds";\nimport "@marketplace/ds/tokens.css";   // variables, Light + Dark + responsive\nimport "@marketplace/ds/bundle.css";   // component styles (tokens only)'} />
      <CodeBlock lang="html" title="Any HTML page, no build step" code={'<link rel="stylesheet" href="tokens.css">\n<link rel="stylesheet" href="bundle.css">\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>\n<script src="bundle.js"></script>\n<script>\n  const { Button } = window.MarketplaceDS;\n  ReactDOM.createRoot(document.getElementById("root"))\n    .render(React.createElement(Button, null, "Publish"));\n</script>'} />
      <H2>Theming</H2>
      <P>Light is the default. Dark follows the operating system. To force a theme, set <code className="ic">data-theme</code> on the root element. Components never need a dark variant.</P>
      <CodeBlock lang="jsx" code={'document.documentElement.setAttribute("data-theme", "dark");   // or "light"\ndocument.documentElement.removeAttribute("data-theme");         // follow the OS'} />
      <H2>Styling your own UI</H2>
      <P>When you build something the library doesn’t have, use semantic tokens. They switch with the theme on their own.</P>
      <CodeBlock lang="css" code={'.payout-card {\n  padding: var(--space-xl);\n  border: var(--border-width-default) solid var(--border-subtle);\n  border-radius: var(--radius-xl);\n  background: var(--bg-surface);\n  color: var(--text-primary);\n  font: var(--type-body-md);\n}\n.payout-card:hover { box-shadow: var(--elevation-3); }'} />
      <H2>Copying a component</H2>
      <List items={[
        'Open the component page and its Examples tab. Press Show code to get the React, HTML and CSS for that exact example.',
        'The Code tab has the full component source and every CSS rule it uses, ready to copy.',
        'Prefer importing over copying, so fixes and theme changes reach your screen.',
        'If you fork a component, keep the class names and tokens. Then theme switches and audits still work.',
      ]} />
      <H2>Names in Figma and code</H2>
      <P>Each Figma variable lists its CSS name in Dev Mode (for example <code className="ic">var(--color-bg-default)</code>). The bundle uses the short names (for example <code className="ic">var(--bg-default)</code>). <code className="ic">tokens.css</code> defines both, so either works. The Tokens pages show both names side by side.</P>
    </>
  ),
};

export default overview;
