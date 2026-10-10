export default {
  id: 'link',
  name: 'Link',
  group: 'Actions',
  order: 3,
  status: 'Stable',
  figma: '17:467',
  exports: ['Link'],
  summary: 'Underlined text that takes people somewhere else: a license page, a creator profile, help docs. Use a Button when something happens instead.',

  examples: [
    {
      title: 'Inline',
      desc: 'The default link sits inside a sentence. It uses text-link, a SemiBold weight and an underline, so it stands out from body text without relying on color alone.',
      ...ex(`
<p style={{ margin: 0, maxWidth: 420, font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>
  Every purchase includes a Standard license. Read the <Link href="/licenses/standard">license terms</Link> before you use an asset in a product you sell.
</p>`),
    },
    {
      title: 'Standalone',
      desc: 'A link can stand on its own, for example under a section to see more. The underline already says it is a link, so it needs no arrow or icon.',
      ...ex(`
<div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
  <Link href="/creators/mira-okafor">View Mira Okafor’s profile</Link>
  <Link href="/ui-kits">See all UI kits</Link>
</div>`),
    },
    {
      title: 'Subtle',
      desc: 'Subtle drops the underline and uses text-secondary. Use it only in dense areas where links are expected, such as footers, meta rows and breadcrumbs. Hover brings the underline back.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', font: '500 14px/20px var(--font-display)' }}>
  <Link subtle href="/help">Help centre</Link>
  <Link subtle href="/licenses">Licenses</Link>
  <Link subtle href="/sell">Start selling</Link>
  <Link subtle href="/terms">Terms</Link>
</div>`),
    },
    {
      title: 'External',
      desc: 'External opens the page in a new tab, adds rel="noopener noreferrer" and shows an icon after the text so people know they are leaving the marketplace.',
      ...ex(`
<p style={{ margin: 0, maxWidth: 420, font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>
  This kit is built with Figma variables. Learn how to <Link external href="https://help.figma.com">import a library in Figma</Link>.
</p>`),
    },
    {
      title: 'In context',
      desc: 'Links carry the secondary paths next to a form or a purchase, like reading the license or contacting the creator. The main action stays a Button.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 320, display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ font: '600 16px/24px var(--font-display)', color: 'var(--text-primary)' }}>Orbit UI kit</span>
    <PriceTag size="md" price="$49" />
  </div>
  <Button size="lg" style={{ width: '100%' }}>Buy for $49</Button>
  <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>
    Includes a Standard license. <Link href="/licenses/standard">Compare licenses</Link>
  </span>
</div>`),
    },
  ],

  props: {
    Link: [
      ['href', 'string', '', 'Where the link goes. Always set it, so the link works with middle-click and Open in new tab.'],
      ['subtle', 'boolean', 'false', 'No underline and text-secondary until hover. For footers, meta rows and breadcrumbs only.'],
      ['external', 'boolean', 'false', 'Opens in a new tab with rel="noopener noreferrer" and adds the link-square-02 icon plus visually hidden “(opens in a new tab)” text after the link text.'],
      ['target', 'string', '', 'Native target. Ignored when external is set.'],
      ['rel', 'string', '', 'Native rel. Ignored when external is set.'],
      ['children', 'ReactNode', '', 'The link text. Say where it goes.'],
      ['...rest', 'AnchorHTMLAttributes', '', 'Any native anchor attribute: onClick, download, aria-*, style.'],
    ],
  },

  usage: {
    when: [
      'To go to another page or place: a license, a creator profile, a help article.',
      'Inside body copy, to point to more detail without breaking the sentence.',
      'For lists of destinations in footers and meta rows (Subtle).',
    ],
    whenNot: [
      'To start an action like buy, publish or delete. Use a Button.',
      'For the main call to action on a page. Use a Primary Button so it is easy to find.',
      'For an action with only an icon. Use an Icon Button.',
    ],
    anatomy: {
      render: <Link external href="https://help.figma.com">Import a library in Figma</Link>,
      parts: [
        'Text: inherits the size around it, SemiBold (600), color text-link, text-link-hover on hover.',
        'Underline: 1px, offset 3px, thickens to 2px on hover.',
        'External icon (optional): link-square-02 at 16px, added by the external prop with hidden “(opens in a new tab)” text for screen readers.',
        'Focus ring: shadow-focus-ring with radius-xs, shows on keyboard focus only.',
      ],
    },
    sections: [
      {
        title: 'Link or button',
        body: 'A link goes somewhere. A button does something. People expect links to open in a new tab with a middle-click and buttons to change data, so mixing them up breaks both habits.',
        dos: [
          {
            do: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>Sold under a <Link href="#link.usage">Standard license</Link>.</span>,
            doText: 'Use a Link to send people to another page, like the license terms.',
            dont: <Button variant="secondary">View Standard license</Button>,
            dontText: 'Don’t use a Button to navigate. It can’t open in a new tab and it reads as an action.',
          },
          {
            do: <Button variant="destructive">Delete listing</Button>,
            doText: 'Use a Button for actions that change data, like deleting a listing.',
            dont: <Link href="#link.usage">Delete listing</Link>,
            dontText: 'Don’t use a Link for an action. People expect a link to take them somewhere, not to delete things.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>Read the <Link href="#link.usage">payout schedule</Link>.</span>,
        doText: 'Make the link text say where it goes. It should make sense read on its own.',
        dont: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>To see the payout schedule, <Link href="#link.usage">click here</Link>.</span>,
        dontText: 'Don’t use “click here” or “learn more”. Screen reader users often jump from link to link and hear only the link text.',
      },
      {
        do: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>See the <Link external href="https://help.figma.com">Figma help centre</Link>.</span>,
        doText: 'Use external for links that leave the marketplace. The icon warns people before they go.',
        dont: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>See the <Link target="_blank" href="https://help.figma.com">Figma help centre</Link>.</span>,
        dontText: 'Don’t open a new tab without the external prop. There is no icon, so the new tab comes as a surprise.',
      },
      {
        do: <p style={{ margin: 0, width: 280, font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>Payouts go out on the 1st. Read the <Link href="#link.usage">payout schedule</Link> for bank holidays.</p>,
        doText: 'Use the default link inside sentences, so the underline marks it.',
        dont: <p style={{ margin: 0, width: 280, font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>Payouts go out on the 1st. Read the <Link subtle href="#link.usage">payout schedule</Link> for bank holidays.</p>,
        dontText: 'Don’t use Subtle in body text. Without the underline, the link looks like the rest of the sentence.',
      },
      {
        do: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)' }}>Made by <Link href="#link.usage">Mira Okafor</Link>.</span>,
        doText: 'Link only the words that name the destination.',
        dont: <span style={{ font: '400 15px/24px var(--font-display)', color: 'var(--text-secondary)', display: 'block', width: 280 }}><Link href="#link.usage">Made by Mira Okafor, see her other 48 listings and follow her for updates</Link></span>,
        dontText: 'Don’t turn a whole sentence into a link. Long underlined text is hard to read and to scan.',
      },
    ],
    content: [
      'Use sentence case and keep it short: “Compare licenses”, not “Click Here To Compare All Of Our Licenses”.',
      'Name the destination: “View Mira Okafor’s profile”, “Read the license terms”.',
      'Don’t add “(opens in a new tab)” by hand. Use external, which adds the icon and the same words for screen readers.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the link and shows the focus ring.'], ['Enter', 'Follows the link.']],
    notes: [
      'Renders a native <a>, so it works with the browser’s Open in new tab and with every screen reader. Always set href.',
      'Links are underlined by default, so color is never the only signal. text-link is at least 4.5:1 on bg-surface.',
      'Subtle links have no underline at rest. Use them only where the context makes clear they are links.',
      'External adds visually hidden text, “(opens in a new tab)”, after the link text, so screen readers warn people before they leave. The icon itself is decorative (aria-hidden).',
    ],
  },

  related: ['button', 'icon-button'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'External links now include visually hidden “(opens in a new tab)” text for screen readers.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Link in React and HTML/CSS, matching the Figma component (Default, Subtle and External).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Neutrals became pure grey and Inter Display became the only typeface, links included.' },
  ],
};
