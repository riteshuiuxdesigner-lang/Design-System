import { Lead, P, H2, List, Callout, CodeBlock, DoDont, Grid } from '../ui.jsx';
import T from '../gen/tokens.json';

const SEM = Object.fromEntries(T.semantic.map(p => [p.n, p]));
const short = n => (SEM[n] && SEM[n].code ? SEM[n].code : '--' + n.replace(/\//g, '-')).replace(/^--/, '');

const a11yOverview = {
  id: 'accessibility', title: 'Overview', section: 'Accessibility', order: 1,
  render: () => (
    <>
      <h1 className="h1">Accessibility</h1>
      <Lead>Everyone should be able to find, buy and sell assets: with a keyboard, a screen reader, a phone in one hand or reduce motion turned on. The system builds this in, so you get it for free when you use it.</Lead>
      <Grid min={220} gap={16}>
        {[['Contrast', 'Text 4.5:1, large text and controls 3:1, checked in Light and Dark.', 'a11y-color', 'view', 'pop-yellow'], ['Keyboard and focus', 'Every control is reachable with Tab and shows a clear focus ring.', 'a11y-keyboard', 'command', 'pop-lime'], ['Touch and motion', '44px targets, and no movement when reduce motion is on.', 'a11y-touch', 'play', 'pop-pink'], ['Checklist', 'What to check before you ship a screen.', 'a11y-checklist', 'checkmark-circle-02', 'pop-violet']].map(([t, b, h, i, c]) => (
          <a key={t} className="card" href={'#' + h}><span className="sticker" style={{ background: 'var(--' + c + ')' }}><Icon name={i} variant="twotone" size={24} /></span><span className="card__title">{t}</span><span className="card__body">{b}</span></a>
        ))}
      </Grid>
      <H2>What the components already do</H2>
      <List tone="yes" items={['Use native elements (button, input, select, table) so assistive tech understands them.', 'Set roles and states: aria-pressed on toggles, aria-invalid on errors, aria-current in navigation, aria-modal on dialogs.', 'Connect labels, helper text and errors to their inputs.', 'Show the focus ring only for keyboard users (:focus-visible).', 'Close menus, popovers and dialogs with Escape and return focus.', 'Turn motion off under prefers-reduced-motion.']} />
      <H2>What you still own</H2>
      <List items={['Writing real labels: a visible label for every field, and a label on every Icon Button.', 'Giving every image meaningful alt text, or alt="" when it’s decorative.', 'Keeping headings in order (one h1, then h2, h3) so people can jump around.', 'Checking your own colors when you go beyond the tokens.']} />
    </>
  ),
};

const a11yColor = {
  id: 'a11y-color', title: 'Color and contrast', section: 'Accessibility', order: 2,
  render: () => (
    <>
      <h1 className="h1">Color and contrast</h1>
      <Lead>We check every text and control pairing in both themes. All {T.contrast.length} required pairs pass. If you combine tokens the way this table does, you’re covered.</Lead>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Sample</th><th>Foreground on background</th><th>Needs</th><th>Light</th><th>Dark</th></tr></thead><tbody>
        {T.contrast.map((c, i) => {
          const ok = c.Light >= c.need && c.Dark >= c.need;
          return <tr key={i}>
            <td><span className="csample" style={{ color: 'var(--' + short(c.fg) + ')', background: 'var(--' + short(c.bg) + ')' }}>Aa</span></td>
            <td><code className="ic">{short(c.fg)}</code> on <code className="ic">{short(c.bg)}</code></td>
            <td className="mds-num">{c.need}:1</td>
            <td className="mds-num">{c.Light.toFixed(2)}</td><td className="mds-num">{c.Dark.toFixed(2)}</td>
            <td style={{ display: 'none' }}>{ok ? 'pass' : 'fail'}</td>
          </tr>;
        })}
      </tbody></table></div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <div style={{ font: 'var(--type-body-sm)', color: 'var(--text-secondary)', width: 260 }}>Commercial license includes client work and up to 10,000 sales.</div>,
          doText: 'Use text-secondary or text-muted for supporting copy. Both pass on every surface.',
          dont: <div style={{ font: 'var(--type-body-sm)', color: 'var(--neutral-300)', width: 260 }}>Commercial license includes client work and up to 10,000 sales.</div>,
          dontText: 'Don’t pick a lighter grey to look “quieter”. This one is 1.5:1 and most people can’t read it.',
        },
        {
          do: <TextField label="Email" defaultValue="mira@studio" error="Add the full address, like mira@studio.com" />,
          doText: 'Show errors with an icon, a message and the red border together.',
          dont: <div style={{ display: 'grid', gap: 8 }}><span className="mds-field__label">Email</span><div className="mds-input" style={{ borderColor: 'var(--feedback-error-solid)' }}><input defaultValue="mira@studio" aria-label="Email" /></div></div>,
          dontText: 'Don’t mark an error with a red border alone. Color-blind users and screen readers get nothing.',
        },
      ]} />
    </>
  ),
};

const a11yKeyboard = {
  id: 'a11y-keyboard', title: 'Keyboard and focus', section: 'Accessibility', order: 3,
  render: () => (
    <>
      <h1 className="h1">Keyboard and focus</h1>
      <Lead>Everything you can click, you can reach and use with a keyboard. The focus ring is a 2px brand-blue ring with a 2px gap, and it shows only for keyboard users.</Lead>
      <H2>Try it</H2>
      <P>Click in the empty space below, then press Tab.</P>
      <div className="kbdemo" tabIndex={-1}>
        <Button>Publish</Button><Button variant="secondary">Preview</Button><IconButton icon="favourite" label="Save" variant="secondary" /><Chip>UI kits</Chip><Checkbox label="Source files" /><Switch label="Dark previews" /><Link href="#a11y-keyboard">License terms</Link>
      </div>
      <H2>Standard keys</H2>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Key</th><th>What it does</th></tr></thead><tbody>
        {[['Tab / Shift+Tab', 'Move to the next or previous control.'], ['Enter', 'Activate a button or link, submit a form.'], ['Space', 'Activate a button, toggle a checkbox or switch.'], ['Arrow keys', 'Move within radios, sliders, menus, the calendar and the command palette.'], ['Escape', 'Close a menu, popover, tooltip, modal, drawer or the command palette.'], ['⌘K / Ctrl+K', 'Open search (command palette).']].map(r => <tr key={r[0]}><td><kbd className="mds-kbd">{r[0]}</kbd></td><td>{r[1]}</td></tr>)}
      </tbody></table></div>
      <H2>Best practices</H2>
      <DoDont items={[
        {
          do: <Button leadingIcon="upload-01">Upload asset</Button>,
          doText: 'Use a real button for actions. It is focusable and works with Enter and Space.',
          dont: <div onClick={() => {}} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 20px', borderRadius: 999, background: 'var(--action-primary-default)', color: 'var(--text-on-action)', font: 'var(--type-label-md)', cursor: 'pointer' }}><Icon name="upload-01" />Upload asset</div>,
          dontText: 'Don’t fake a button with a div. Keyboard and screen reader users can’t reach it.',
        },
        {
          do: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" className="force-focus">Preview</Button></div>,
          doText: 'Keep the focus ring visible on every control.',
          dont: <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" style={{ boxShadow: 'none', outline: 'none' }}>Preview</Button></div>,
          dontText: 'Don’t remove outlines or the ring. Keyboard users lose track of where they are.',
        },
      ]} />
    </>
  ),
};

const a11yTouch = {
  id: 'a11y-touch', title: 'Touch and motion', section: 'Accessibility', order: 4,
  render: () => (
    <>
      <h1 className="h1">Touch and motion</h1>
      <Lead>Controls are at least 44px tall, so they’re easy to hit with a thumb. Motion helps people follow what happened, and it switches off for anyone who asks.</Lead>
      <DoDont items={[
        {
          do: <div style={{ display: 'flex', gap: 8 }}><IconButton icon="favourite" label="Save" variant="secondary" /><IconButton icon="share-08" label="Share" variant="secondary" /></div>,
          doText: 'Use the 44px default size on touch screens.',
          dont: <div style={{ display: 'flex', gap: 2 }}><button className="mds-btn mds-btn--icon mds-btn--secondary" style={{ width: 24, height: 24 }} aria-label="Save"><Icon name="favourite" size={16} /></button><button className="mds-btn mds-btn--icon mds-btn--secondary" style={{ width: 24, height: 24 }} aria-label="Share"><Icon name="share-08" size={16} /></button></div>,
          dontText: 'Don’t shrink targets below 44px or pack them together on mobile. People tap the wrong one.',
        },
      ]} />
      <H2>Reduced motion</H2>
      <P>Under <code className="ic">prefers-reduced-motion: reduce</code>, the bundle turns off springs, slides, shimmer and spinners. Fades stay, and state changes are instant. Do the same in your own CSS:</P>
      <CodeBlock lang="css" code={'@media (prefers-reduced-motion: reduce) {\n  .promo-banner { animation: none; transition: opacity var(--motion-duration-fast) linear; }\n}'} />
    </>
  ),
};

const a11yChecklist = {
  id: 'a11y-checklist', title: 'Checklist', section: 'Accessibility', order: 5,
  render: () => (
    <>
      <h1 className="h1">Before you ship</h1>
      <Lead>Run through this list on every new screen. Most of it takes a minute with a keyboard and the theme toggle.</Lead>
      <H2>Design</H2>
      <List tone="yes" items={['Every color is a semantic token, and the screen works in Light and Dark.', 'Status is shown with an icon or a word as well as color.', 'Every field has a visible label. Placeholders are only examples.', 'Touch targets are at least 44px on mobile.', 'Headings follow one order: one h1 per page.']} />
      <H2>Code</H2>
      <List tone="yes" items={['You can reach and use everything with Tab, Enter, Space, the arrows and Escape.', 'Focus is always visible and never trapped, except inside an open modal.', 'Icon-only buttons have a label. Images have alt text, or alt="" when decorative.', 'Errors are announced: aria-invalid plus a message linked with aria-describedby.', 'The screen works at 200% zoom and at 320px wide without horizontal scrolling.', 'Nothing moves under reduce motion.']} />
    </>
  ),
};

export default [a11yOverview, a11yColor, a11yKeyboard, a11yTouch, a11yChecklist];
