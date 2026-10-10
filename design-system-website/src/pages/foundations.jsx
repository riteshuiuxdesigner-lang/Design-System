import { Lead, P, H2, List, Callout, CodeBlock, Grid, DoDont, Example, copyText, notify } from '../ui.jsx';
import T from '../gen/tokens.json';

const sem = T.semantic;
const byPrefix = p => sem.filter(t => t.n.startsWith(p) && t.t === 'color');
const cloudUsage = Object.fromEntries(T.colorCloud.map(t => [t.name, t.usage]));
const short = t => (t.code || t.css).replace(/^--/, '');

function Swatch({ token, big }) {
  return (
    <button type="button" className={'sw' + (big ? ' sw--big' : '')} onClick={() => copyText('var(--' + short(token) + ')').then(() => notify('Copied var(--' + short(token) + ')'))} title="Copy CSS variable">
      <span className="sw__chips"><span className="sw__chip" style={{ background: token.rl }} /><span className="sw__chip" style={{ background: token.rd }} /></span>
      <span className="sw__name">{short(token)}</span>
      <span className="sw__vals">{String(token.rl).toUpperCase()} · {String(token.rd).toUpperCase()}</span>
      {big && token.note && <span className="sw__note">{token.note}</span>}
    </button>
  );
}

function Scale({ name }) {
  const steps = T.primitives.filter(p => p.n.startsWith('color/' + name + '/'));
  return (
    <div className="scale">
      <div className="scale__name">{name}</div>
      <div className="scale__row">{steps.map(s => {
        const step = s.n.split('/').pop();
        return <button type="button" key={s.n} className="scale__step" style={{ background: s.v }} title={s.v} onClick={() => copyText(s.v).then(() => notify('Copied ' + s.v))}>
          <span className="scale__lbl" style={{ color: +step >= 500 || step === 'base' ? 'var(--white)' : 'var(--black)' }}>{step}<br />{s.v.replace('#', '')}</span></button>;
      })}</div>
    </div>
  );
}

const color = {
  id: 'color', title: 'Color', section: 'Foundations', order: 1,
  render: () => (
    <>
      <h1 className="h1">Color</h1>
      <Lead>Surfaces are white, grey and black. Brand blue marks actions and focus. Five pop stickers add the fun, always with ink text. Every color has a Light and a Dark value.</Lead>
      <Callout icon="paint-board" title="Use semantic tokens, never primitives or hex" sticker="pop-yellow">Pick by role: <code className="ic">bg-surface</code>, <code className="ic">text-secondary</code>, <code className="ic">action-primary-default</code>. Semantic tokens switch with the theme. A hex value or a primitive like <code className="ic">neutral-100</code> does not. Click any swatch to copy its CSS variable.</Callout>
      <H2>Backgrounds</H2>
      <P>Pages sit on <code className="ic">bg-default</code>. Cards and inputs sit on <code className="ic">bg-surface</code>, and menus and modals on <code className="ic">bg-raised</code>. Use <code className="ic">bg-muted</code> for quiet fills like chips and search, and <code className="ic">bg-subtle</code> for wells.</P>
      <Grid min={200} gap={12}>{byPrefix('color/bg/').map(t => <Swatch key={t.n} token={t} big />)}</Grid>
      <H2>Text and icons</H2>
      <Grid min={200} gap={12}>{[...byPrefix('color/text/'), ...byPrefix('color/icon/')].map(t => <Swatch key={t.n} token={t} big />)}</Grid>
      <H2>Borders and focus</H2>
      <Grid min={200} gap={12}>{[...byPrefix('color/border/'), ...byPrefix('color/focus/')].map(t => <Swatch key={t.n} token={t} big />)}</Grid>
      <H2>Actions</H2>
      <P>Primary actions use blue-600 (#3263e4, 5.2:1 with white). The brand blue, blue-500 (#3f75ff), is kept for the focus ring and accents.</P>
      <Grid min={200} gap={12}>{byPrefix('color/action/').map(t => <Swatch key={t.n} token={t} big />)}</Grid>
      <H2>Feedback</H2>
      <P>Status colors always come with an icon or a word. The <code className="ic">bg</code>, <code className="ic">border</code>, <code className="ic">text</code> and <code className="ic">icon</code> tokens are tuned to work together.</P>
      <Grid min={200} gap={12}>{byPrefix('color/feedback/').map(t => <Swatch key={t.n} token={t} />)}</Grid>
      <H2>Pop stickers</H2>
      <P>Five bright colors give the product its personality: badges, avatars, category dots, illustration fills and celebrations. They always take ink text (<code className="ic">text-on-pop</code>, at least 9:1) and stay the same in both themes.</P>
      <div className="pops">{['pop-yellow', 'pop-lime', 'pop-pink', 'pop-orange', 'pop-violet'].map((p, i) => (
        <button type="button" key={p} className="pop" style={{ background: 'var(--' + p + ')' }} onClick={() => copyText('var(--' + p + ')').then(() => notify('Copied var(--' + p + ')'))}>
          <Icon name={['star', 'tick-02', 'favourite', 'fire', 'sparkles'][i]} variant="twotone" size={24} /><span className="pop__name">{p}</span><span className="pop__hex">{T.colorCloud.find(c => c.name === p).value}</span>
        </button>))}</div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ width: 280, padding: 16, borderRadius: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'grid', gap: 8 }}><Badge variant="lime">Free</Badge><div style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Wireframe Blocks</div><Button size="sm">Get it free</Button></div>,
          doText: 'Keep surfaces neutral and let a pop sticker carry the accent.',
          dont: <div style={{ width: 280, padding: 16, borderRadius: 16, background: 'var(--blue-50)', display: 'grid', gap: 8 }}><span style={{ font: '600 13px/24px var(--font-display)', color: 'var(--blue-600)' }}>Free</span><div style={{ font: '600 15px/20px var(--font-display)', color: 'var(--blue-800)' }}>Wireframe Blocks</div><Button size="sm">Get it free</Button></div>,
          dontText: 'Don’t wash a card in light blue. The primary button stops standing out, and blue starts to mean nothing.',
        },
        {
          do: <div style={{ display: 'flex', gap: 8 }}><Badge variant="yellow">Bestseller</Badge><Badge variant="pink">Staff pick</Badge></div>,
          doText: 'Put ink text on pop colors.',
          dont: <div style={{ display: 'flex', gap: 8 }}><span className="mds-badge" style={{ background: 'var(--pop-yellow)', color: 'var(--white)' }}>Bestseller</span><span style={{ font: '700 16px/24px var(--font-display)', color: 'var(--pop-pink)' }}>Staff pick</span></div>,
          dontText: 'Don’t put white text on a pop color, and don’t use a pop color for text. Both fail contrast.',
        },
        {
          do: <div style={{ display: 'flex', gap: 8 }}><Badge variant="success" icon="checkmark-circle-02">Approved</Badge><Badge variant="error" icon="alert-circle">Rejected</Badge></div>,
          doText: 'Pair status color with an icon and a word.',
          dont: <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ width: 12, height: 12, borderRadius: 99, background: 'var(--feedback-success-icon)' }} /><span style={{ width: 12, height: 12, borderRadius: 99, background: 'var(--feedback-error-icon)' }} /></div>,
          dontText: 'Don’t show status with color alone. About 1 in 12 men can’t tell these two dots apart.',
        },
      ]} />
      <H2>Primitive scales</H2>
      <P>The raw palette behind the semantic tokens, generated in OKLCH so steps look even. The neutrals are pure grey with no hue. Primitives are hidden from Figma pickers. Reference them only when you add a new semantic token.</P>
      {['neutral', 'blue', 'red', 'green', 'amber', 'sky'].map(n => <Scale key={n} name={n} />)}
    </>
  ),
};

/* ---------- Typography ---------- */
const typography = {
  id: 'typography', title: 'Typography', section: 'Foundations', order: 2,
  render: () => (
    <>
      <h1 className="h1">Typography</h1>
      <Lead>Inter Display is the only typeface, at 400, 500, 600 and 700. Hierarchy comes from size and weight. One family keeps every screen calm and fast to load.</Lead>
      <div className="specimen">
        <div className="specimen__big">Aa</div>
        <div className="specimen__meta">
          <div className="card__title">Inter Display</div>
          <div className="card__body">Regular 400 · Medium 500 · SemiBold 600 · Bold 700. Use tabular figures for prices, IDs and tables.</div>
          <div className="specimen__weights">{[400, 500, 600, 700].map(w => <span key={w} style={{ fontWeight: w }}>Find the right asset</span>)}</div>
        </div>
      </div>
      <H2>Type scale</H2>
      <P>Use a text style for every piece of text. Display and headings step down on tablet and mobile on their own when you use the responsive tokens.</P>
      <div className="tscale">
        {T.type.groups.flatMap(g => g.styles).map(s => (
          <div className="tscale__row" key={s.name}>
            <div className="tscale__meta"><code className="ic ic--prop">{s.name}</code><span>{s.fontSize.replace('px', '')}/{s.lineHeight.replace('px', '')} · {s.fontWeight}</span></div>
            <div className="tscale__sample" style={{ font: s.fontWeight + ' ' + s.fontSize + '/' + s.lineHeight + ' var(--font-display)', letterSpacing: s.letterSpacing, fontVariantNumeric: s.name.startsWith('numeric') ? 'tabular-nums' : undefined }}>{s.sample}</div>
            <div className="tscale__use">{s.usage}</div>
          </div>
        ))}
      </div>
      <H2>In code</H2>
      <CodeBlock lang="css" code={'.listing-title { font: var(--type-heading-3); letter-spacing: -0.48px; }\n.price { font: var(--type-numeric-md); font-variant-numeric: tabular-nums; }\n\n/* Responsive tokens step down on their own: */\nh1 { font-size: var(--type-heading-1-size); line-height: var(--type-heading-1-line-height); }'} />
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ display: 'grid', gap: 4, width: 280 }}><div style={{ font: 'var(--type-heading-3)', letterSpacing: -0.48, color: 'var(--text-primary)' }}>Trending this week</div><div style={{ font: 'var(--type-body-md)', color: 'var(--text-secondary)' }}>Fresh UI kits picked by our editors.</div></div>,
          doText: 'Write headings in sentence case and step down in size.',
          dont: <div style={{ display: 'grid', gap: 4, width: 280 }}><div style={{ font: '700 22px/28px var(--font-display)', textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-primary)' }}>Trending This Week</div><div style={{ font: '700 16px/22px var(--font-display)', color: 'var(--text-primary)' }}>Fresh UI kits picked by our editors.</div></div>,
          dontText: 'Don’t use all caps or title case, and don’t set body text in bold. Everything ends up shouting.',
        },
        {
          do: <div style={{ display: 'grid', gap: 2, font: 'var(--type-numeric-md)', fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: 'var(--text-primary)' }}><span>$1,240.00</span><span>$98.00</span><span>$11,410.50</span></div>,
          doText: 'Use tabular figures so prices line up.',
          dont: <div style={{ display: 'grid', gap: 2, font: '500 15px/20px var(--font-display)', fontVariantNumeric: 'proportional-nums', textAlign: 'left', color: 'var(--text-primary)' }}><span>$1,240.00</span><span>$98.00</span><span>$11,410.50</span></div>,
          dontText: 'Don’t left-align numbers in proportional figures. Amounts become hard to compare.',
        },
        {
          do: <div style={{ font: 'var(--type-body-md)', color: 'var(--text-secondary)', maxWidth: 300 }}>Upload your files, set a price and publish. We review new listings within 24 hours.</div>,
          doText: 'Keep lines between 45 and 75 characters.',
          dont: <div style={{ font: '400 12px/14px var(--font-display)', color: 'var(--text-muted)', maxWidth: 380 }}>Upload your files, set a price and publish. We review new listings within 24 hours, and once approved your listing appears in search and on your creator page.</div>,
          dontText: 'Don’t set long text small, tight and muted. It is hard to read and fails contrast on grey.',
        },
      ]} />
    </>
  ),
};

/* ---------- Spacing ---------- */
const spacing = {
  id: 'spacing', title: 'Spacing', section: 'Foundations', order: 3,
  render: () => (
    <>
      <h1 className="h1">Spacing</h1>
      <Lead>Everything sits on a 4px grid. Use the named steps, never a one-off number. Generous spacing is the default; tight spacing is a deliberate choice.</Lead>
      <div className="spaces">{T.cloud.spacing.tokens.filter(t => t.name !== 'space-none' && t.name !== 'space-overlap').map(t => (
        <div className="space" key={t.name}><code className="ic ic--prop">{t.name}</code><span className="space__px">{t.value}</span><span className="space__bar" style={{ width: t.value }} /><span className="space__use">{t.usage}</span></div>
      ))}</div>
      <H2>Common pairings</H2>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Where</th><th>Token</th><th>Value</th></tr></thead><tbody>
        {[['Icon to label', 'space-xs', '8px'], ['Control padding (inline)', 'space-md / space-lg', '16 / 20px'], ['Between form fields', 'space-xl', '24px'], ['Card padding', 'space-xl', '24px'], ['Grid gutter', 'space-xl', '24px'], ['Between sections (desktop)', 'space-7xl', '96px'], ['Avatar overlap', 'space-overlap', '−8px']].map(r => <tr key={r[0]}><td>{r[0]}</td><td><code className="ic">{r[1]}</code></td><td className="mds-num">{r[2]}</td></tr>)}
      </tbody></table></div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ display: 'grid', gap: 'var(--space-xl)', width: 260 }}><TextField label="Asset title" placeholder="Orbit Dashboard UI Kit" /><TextField label="Price" placeholder="$49" /></div>,
          doText: 'Space fields with one token (space-xl) so the form reads as a rhythm.',
          dont: <div style={{ display: 'grid', gap: 0, width: 260 }}><TextField label="Asset title" placeholder="Orbit Dashboard UI Kit" /><div style={{ height: 3 }} /><TextField label="Price" placeholder="$49" /></div>,
          dontText: 'Don’t use one-off gaps like 3px or 13px. Labels start to stick to the field above.',
        },
        {
          do: <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="download-01" size={20} />2.4k downloads</div>,
          doText: 'Use space-xs between an icon and its label.',
          dont: <div style={{ display: 'flex', gap: 22, alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Icon name="download-01" size={20} />2.4k downloads</div>,
          dontText: 'Don’t leave a wide gap. The icon stops belonging to its label.',
        },
      ]} />
    </>
  ),
};

/* ---------- Shape ---------- */
const shape = {
  id: 'shape', title: 'Shape', section: 'Foundations', order: 4,
  render: () => (
    <>
      <h1 className="h1">Shape</h1>
      <Lead>Every interactive control is a pill. Containers get soft, generous corners. The contrast between the two is a big part of the look.</Lead>
      <Grid min={150} gap={12}>{T.cloud.radius.tokens.filter(t => t.name !== 'radius-none').map(t => (
        <div className="card" key={t.name} style={{ justifyItems: 'start' }}><span className="radius-demo" style={{ borderRadius: t.value === '9999px' ? 999 : t.value, borderTopLeftRadius: t.value === '9999px' ? 999 : t.value }} /><code className="ic ic--prop">{t.name}</code><span className="card__body">{t.value === '9999px' ? 'Full pill' : t.value} · {t.usage}</span></div>
      ))}</Grid>
      <H2>Borders</H2>
      <P>Use 1px borders: <code className="ic">border-subtle</code> for dividers, <code className="ic">border-default</code> for chips and secondary buttons, and <code className="ic">border-strong</code> for inputs and checkboxes (3:1). Selected items get a 2px <code className="ic">border-selected</code>.</P>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ display: 'flex', gap: 8 }}><Button>Publish</Button><Chip selected>UI kits</Chip></div>,
          doText: 'Make every control a pill with radius-control.',
          dont: <div style={{ display: 'flex', gap: 8 }}><Button style={{ borderRadius: 6 }}>Publish</Button><Chip selected style={{ borderRadius: 4 }}>UI kits</Chip></div>,
          dontText: 'Don’t square off controls. They stop looking tappable and break the family.',
        },
        {
          do: <div style={{ width: 240, padding: 20, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Payout summary<div style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>$1,240.00 sent on Oct 9</div></div>,
          doText: 'Give containers radius-lg to radius-2xl.',
          dont: <div style={{ width: 240, padding: '20px 32px', borderRadius: 999, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Payout summary<div style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)' }}>$1,240.00 sent on Oct 9</div></div>,
          dontText: 'Don’t make cards pills. They look like giant buttons, and content gets clipped at the ends.',
        },
      ]} />
    </>
  ),
};

/* ---------- Elevation ---------- */
const elevation = {
  id: 'elevation', title: 'Elevation', section: 'Foundations', order: 5,
  render: () => (
    <>
      <h1 className="h1">Elevation</h1>
      <Lead>Borders separate and shadows float. Only things that sit above the page get a shadow. In Dark mode, raised surfaces also get a 1px edge, because shadows disappear on black.</Lead>
      <Grid min={200} gap={24}>{T.cloud.shadow.tokens.filter(t => t.name.startsWith('elevation')).map(t => (
        <div key={t.name} className="elev" style={{ boxShadow: 'var(--' + t.name + ')' }}><code className="ic ic--prop">{t.name}</code><span className="card__body">{t.usage.split('. In dark')[0]}</span></div>
      ))}</Grid>
      <H2>Focus</H2>
      <P><code className="ic">shadow-focus-ring</code> draws a 2px gap and a 2px brand-blue ring around controls. Inputs use <code className="ic">shadow-focus-halo</code>, a soft 4px halo. Press Tab to try them.</P>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}><Button>Tab to me</Button><Chip>Then me</Chip><SearchField placeholder="And me" /></div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ display: 'grid', gap: 8, width: 240 }}>{['Orbit UI Kit', 'Swiss Posters'].map(t => <div key={t} style={{ padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>{t}</div>)}</div>,
          doText: 'Separate cards on the page with a subtle border.',
          dont: <div style={{ display: 'grid', gap: 8, width: 240 }}>{['Orbit UI Kit', 'Swiss Posters'].map(t => <div key={t} style={{ padding: 16, borderRadius: 16, boxShadow: 'var(--elevation-4)', background: 'var(--bg-surface)', font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>{t}</div>)}</div>,
          dontText: 'Don’t give resting cards heavy shadows. Nothing reads as floating anymore, including real menus.',
        },
      ]} />
    </>
  ),
};

/* ---------- Motion ---------- */
function MotionDemo() {
  const [on, setOn] = React.useState(false);
  return (
    <div className="motion">
      {[['standard', 'cubic-bezier(0.2,0,0,1)', 'Color, layout, fades'], ['spring', 'cubic-bezier(0.34,1.56,0.64,1)', 'Things that appear or are pressed'], ['enter', 'cubic-bezier(0,0,0,1)', 'Entering the screen'], ['exit', 'cubic-bezier(0.7,0,0.84,0)', 'Leaving the screen']].map(([n, e, u], i) => (
        <div className="motion__row" key={n}>
          <div className="motion__meta"><code className="ic ic--prop">motion-easing-{n}</code><span className="card__body">{u}</span></div>
          <div className="motion__track"><span className="motion__dot" style={{ background: 'var(--' + ['pop-yellow', 'pop-pink', 'pop-lime', 'pop-violet'][i] + ')', transform: on ? 'translateX(calc(100cqw - 40px))' : 'none', transition: 'transform 600ms ' + e }} /></div>
        </div>
      ))}
      <div><Button leadingIcon="play" onClick={() => setOn(!on)}>Play</Button></div>
    </div>
  );
}
const motion = {
  id: 'motion', title: 'Motion', section: 'Foundations', order: 6,
  render: () => (
    <>
      <h1 className="h1">Motion</h1>
      <Lead>Motion confirms that something happened. Buttons squish, cards lift and menus pop with a little spring. It is quick and never in the way.</Lead>
      <H2>Durations</H2>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Token</th><th>Value</th><th>Use for</th></tr></thead><tbody>
        {[['motion-duration-instant', '0ms', 'Reduced motion'], ['motion-duration-fast', '120ms', 'Hover, press, toggle'], ['motion-duration-base', '200ms', 'Menus, tooltips, tabs'], ['motion-duration-slow', '320ms', 'Modals, sheets, toasts, switch knob']].map(r => <tr key={r[0]}><td><code className="ic">{r[0]}</code></td><td className="mds-num">{r[1]}</td><td>{r[2]}</td></tr>)}
      </tbody></table></div>
      <H2>Easing</H2>
      <MotionDemo />
      <H2>Signature moves</H2>
      <div className="tbl-wrap"><table className="tbl"><tbody>
        {[['Press', 'Buttons and chips scale to 0.96 with the spring.'], ['Lift', 'Asset cards rise 4px and tilt −0.6° with elevation-3 on hover.'], ['Pop', 'Menus, popovers and modals scale in from 0.9.'], ['Knob', 'The switch knob slides with the spring over 320ms.'], ['Sticker', 'Badges on thumbnails sit at −4°, and icon stickers at −6°.']].map(r => <tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td></tr>)}
      </tbody></table></div>
      <Callout icon="view-off" title="Reduced motion" sticker="pop-violet">When someone turns on reduce motion in their system settings, everything becomes instant or fades only. The bundle handles this for every component. Do the same in your own CSS with <code className="ic">@media (prefers-reduced-motion: reduce)</code>.</Callout>
    </>
  ),
};

/* ---------- Layout ---------- */
const layout = {
  id: 'layout', title: 'Layout', section: 'Foundations', order: 7,
  render: () => (
    <>
      <h1 className="h1">Layout</h1>
      <Lead>Three breakpoints, one fluid grid. We design web first and make it just as smooth on phones.</Lead>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Breakpoint</th><th>Width</th><th>Columns</th><th>Gutter</th><th>Margin</th><th>Asset grid</th></tr></thead><tbody>
        {[['Desktop', '≥ 1024px', 12, 24, 40, 4], ['Tablet', '640–1023px', 8, 24, 32, 3], ['Mobile', '< 640px', 4, 16, 16, 2]].map(r => <tr key={r[0]}><td><strong>{r[0]}</strong></td><td className="mds-num">{r[1]}</td><td className="mds-num">{r[2]}</td><td className="mds-num">{r[3]}px</td><td className="mds-num">{r[4]}px</td><td className="mds-num">{r[5]} columns</td></tr>)}
      </tbody></table></div>
      <H2>The grid</H2>
      {[[12, 'Desktop'], [8, 'Tablet'], [4, 'Mobile']].map(([n, l]) => <div key={l} className="lgrid"><span className="lgrid__lbl">{l} · {n}</span><div className="lgrid__cols" style={{ gridTemplateColumns: 'repeat(' + n + ', 1fr)' }}>{Array.from({ length: n }, (_, i) => <span key={i} />)}</div></div>)}
      <H2>Containers</H2>
      <div className="tbl-wrap"><table className="tbl"><tbody>
        {[['layout-container-narrow', '640px', 'Checkout, forms, settings'], ['layout-container-default', '1280px', 'Product pages, dashboards'], ['layout-container-wide', '1440px', 'Browse grids']].map(r => <tr key={r[0]}><td><code className="ic">{r[0]}</code></td><td className="mds-num">{r[1]}</td><td>{r[2]}</td></tr>)}
      </tbody></table></div>
      <CodeBlock lang="css" code={'.browse {\n  display: grid;\n  grid-template-columns: repeat(var(--layout-asset-grid-columns), minmax(0, 1fr));  /* 4 → 3 → 2 */\n  gap: var(--layout-asset-grid-gap);\n  max-width: var(--layout-container-wide);\n  margin-inline: auto;\n  padding-inline: var(--layout-grid-margin);\n}'} />
    </>
  ),
};

/* ---------- Iconography ---------- */
function IconBrowser() {
  const [q, setQ] = React.useState('');
  const [variant, setVariant] = React.useState('stroke');
  const names = Icon.names.filter(n => n.includes(q.trim().toLowerCase()));
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <SearchField placeholder={'Search ' + Icon.names.length + ' icons'} value={q} onChange={setQ} shortcut={false} className="iconsearch" />
        <Tabs label="Icon style" value={variant} onChange={setVariant} items={[{ value: 'stroke', label: 'Stroke' }, { value: 'twotone', label: 'Twotone' }]} />
      </div>
      <div className="icons">{names.map(n => (
        <button type="button" key={n} className="icons__item" onClick={() => copyText(n).then(() => notify('Copied ' + n))} title={'Copy name: ' + n}>
          <Icon name={n} variant={variant} size={24} color={variant === 'twotone' ? 'var(--focus-ring)' : undefined} /><span>{n}</span>
        </button>
      ))}</div>
      {!names.length && <EmptyState scene="search" title="No icon with that name" body="Try a shorter word, like “arrow” or “user”. The full Hugeicons library is in Figma." />}
    </div>
  );
}
const iconography = {
  id: 'iconography', title: 'Iconography', section: 'Foundations', order: 8,
  render: () => (
    <>
      <h1 className="h1">Iconography</h1>
      <Lead>We use Hugeicons Pro. Stroke · Rounded is the default for every interface icon. Twotone · Rounded is only for highlights that should look special.</Lead>
      <Grid min={260} gap={16}>
        <div className="card"><span className="sticker" style={{ background: 'var(--bg-muted)', color: 'var(--icon-primary)' }}><Icon name="search-01" size={24} /></span><span className="card__title">Stroke · default</span><span className="card__body">Buttons, inputs, navigation, menus, tables, everything you operate. 1.5px stroke, rounded caps.</span></div>
        <div className="card"><span className="sticker" style={{ background: 'var(--pop-yellow)' }}><Icon name="rocket-01" variant="twotone" size={24} /></span><span className="card__title">Twotone · highlights</span><span className="card__body">Feature callouts, empty states, onboarding, pricing perks and achievements. Tint with focus-ring or icon-primary.</span></div>
      </Grid>
      <H2>Library</H2>
      <P>Click an icon to copy its name, then use it as <code className="ic">{'<Icon name="…" />'}</code> or in any icon prop. These are the 72 curated icons. Need another one? Take it from the Hugeicons Pro Figma file in the same style, and we will add it.</P>
      <IconBrowser />
      <H2>Sizes</H2>
      <div style={{ display: 'flex', gap: 32, alignItems: 'end', flexWrap: 'wrap' }}>{[[16, 'size-icon-sm', 'Dense UI, badges'], [20, 'size-icon-md', 'Default'], [24, 'size-icon-lg', 'Mobile nav, empty states']].map(([s, t, u]) => <div key={s} style={{ display: 'grid', gap: 8, justifyItems: 'start' }}><Icon name="shopping-bag-01" size={s} /><code className="ic">{t} · {s}</code><span className="card__body">{u}</span></div>)}</div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ display: 'flex', gap: 8 }}><IconButton icon="favourite" label="Save" variant="secondary" /><IconButton icon="share-08" label="Share" variant="secondary" /><IconButton icon="more-horizontal" label="More" variant="secondary" /></div>,
          doText: 'Use Stroke icons in controls.',
          dont: <div style={{ display: 'flex', gap: 8, color: 'var(--focus-ring)' }}><button className="mds-btn mds-btn--icon mds-btn--secondary"><Icon name="favourite" variant="twotone" /></button><button className="mds-btn mds-btn--icon mds-btn--secondary"><Icon name="share-08" /></button><button className="mds-btn mds-btn--icon mds-btn--secondary"><Icon name="more-horizontal" variant="twotone" /></button></div>,
          dontText: 'Don’t mix Twotone into a row of controls. The row looks uneven and the tint reads as a state.',
        },
        {
          do: <Callout icon="gift" title="Your first sale is fee-free" sticker="pop-lime">Publish before Nov 1 to keep 100% of your first sale.</Callout>,
          doText: 'Use Twotone on a sticker to make a highlight feel special.',
          dont: <Callout icon="gift" title="Your first sale is fee-free" sticker="bg-muted">Publish before Nov 1 to keep 100% of your first sale.</Callout>,
          dontText: 'Don’t use a flat grey sticker for a celebration. It reads like a system notice.',
        },
        {
          do: <Button variant="secondary" leadingIcon="license">View license</Button>,
          doText: 'Add a label when the icon isn’t universal.',
          dont: <IconButton icon="license" label="" variant="secondary" />,
          dontText: 'Don’t rely on an uncommon icon alone. Nobody can guess what this one does.',
        },
      ]} />
    </>
  ),
};

/* ---------- Content ---------- */
const content = {
  id: 'content', title: 'Content', section: 'Foundations', order: 9,
  render: () => (
    <>
      <h1 className="h1">Content</h1>
      <Lead>We write like a helpful creator talking to another creator: plain, warm and specific. Words are part of the design.</Lead>
      <List items={['Use sentence case everywhere, including buttons, titles and menus.', 'Write from the user’s side: “Your payout was sent”, not “Payout processed”.', 'Start buttons with a verb that says exactly what happens. Confirm in the past tense: Publish → “Published”.', 'Errors say what went wrong and how to fix it. No apologies, no blame, no codes.', 'Show money with the currency and tabular figures: $1,240.00.', 'No emoji in UI copy. Pop stickers and icons carry the fun.']} />
      <H2>Examples</H2>
      <DoDont items={[
        {
          do: <div style={{ width: 340 }}><Alert variant="error" title="The file is over 2 GB">Split it into parts or compress it, then try again.</Alert></div>,
          doText: 'Say what happened and how to fix it.',
          dont: <div style={{ width: 340 }}><Alert variant="error" title="Error 413">Oops! Something went wrong. Sorry about that 😢</Alert></div>,
          dontText: 'Don’t show codes, apologies or emoji. They don’t help anyone fix the problem.',
        },
        {
          do: <Toast message="Published. It’s live on your profile." actionLabel="View" />,
          doText: 'Confirm in the past tense and offer the next step.',
          dont: <Toast message="Your request has been successfully processed by the system." />,
          dontText: 'Don’t describe what the system did. Say what changed for the person.',
        },
        {
          do: <EmptyState scene="listings" title="No listings yet" body="Upload your first asset. It takes about five minutes." action={<Button leadingIcon="upload-01">Upload asset</Button>} />,
          doText: 'In empty states, explain why it’s empty and give the next step.',
          dont: <div style={{ padding: 32, textAlign: 'center', font: 'var(--type-body-md)', color: 'var(--text-muted)' }}>No data found.</div>,
          dontText: 'Don’t leave a bare “No data”. It looks broken and gives no way forward.',
        },
      ]} />
    </>
  ),
};

export default [color, typography, spacing, shape, elevation, motion, layout, iconography, content];
