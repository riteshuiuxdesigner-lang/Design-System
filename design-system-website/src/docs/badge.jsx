export default {
  id: 'badge',
  name: 'Badge',
  group: 'Data display',
  order: 1,
  status: 'Stable',
  figma: '25:129',
  exports: ['Badge'],
  summary: 'A small, non-interactive pill that labels something: a pop-color sticker like “New” or “Bestseller”, or a status like “Paid” or “Failed”.',

  examples: [
    {
      title: 'Pop stickers',
      desc: 'The five pop colors are for marketing labels on listings and creators. They always use ink text (text-on-pop), so they pass contrast on any surface.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Badge variant="yellow">New</Badge>
  <Badge variant="lime">Bestseller</Badge>
  <Badge variant="pink">Staff pick</Badge>
  <Badge variant="orange">Sale</Badge>
  <Badge variant="violet">Free update</Badge>
</div>`),
    },
    {
      title: 'Neutral and ink',
      desc: 'Neutral is the default, for quiet facts like file type or version. Ink is the strongest badge, for a single label that must stand out, like Pro.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Badge>Figma</Badge>
  <Badge>v2.4</Badge>
  <Badge>Draft</Badge>
  <Badge variant="ink">Pro</Badge>
</div>`),
    },
    {
      title: 'Status',
      desc: 'Success, warning, error and info show the state of an order, payout or listing. Each one has a word and an icon, so color is never the only signal.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Badge variant="success" icon="checkmark-circle-02">Paid</Badge>
  <Badge variant="warning" icon="alert-02">Pending</Badge>
  <Badge variant="error" icon="alert-circle">Failed</Badge>
  <Badge variant="info" icon="information-circle">In review</Badge>
</div>`),
    },
    {
      title: 'With an icon',
      desc: 'A 16px icon before the text helps people scan a sticker. The word still carries the meaning.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Badge variant="lime" icon="fire">Trending</Badge>
  <Badge variant="yellow" icon="crown">Top creator</Badge>
  <Badge icon="license">Extended license</Badge>
</div>`),
    },
    {
      title: 'On a thumbnail',
      desc: 'AssetCard places one sticker in the top-left corner of the thumbnail and tilts it by -4° for a playful, stuck-on look.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 240 }}>
  <AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" price="$49" badge="New" badgeVariant="yellow" thumbColor="pop-violet" />
</div>`),
    },
    {
      title: 'In a list',
      desc: 'Put a status badge at the end of a row, so people can scan down the column and spot what needs attention.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 380, maxWidth: '100%', padding: 'var(--space-xs)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <ListItem title="Orbit UI kit" meta="Updated 2 days ago" trailing={<Badge variant="success" icon="checkmark-circle-02">Live</Badge>} />
  <ListItem title="Mono icon pack" meta="Submitted today" trailing={<Badge variant="info" icon="information-circle">In review</Badge>} />
  <ListItem title="Pitch deck template" meta="Edited 1 week ago" trailing={<Badge>Draft</Badge>} />
</div>`),
    },
  ],

  props: {
    Badge: [
      ['variant', "'neutral' | 'ink' | 'yellow' | 'lime' | 'pink' | 'orange' | 'violet' | 'success' | 'warning' | 'error' | 'info'", "'neutral'", 'Pop colors are stickers, feedback variants are status. Pop variants always take ink text.'],
      ['icon', 'IconName', '', '16px icon before the text. Use one on every status badge.'],
      ['children', 'ReactNode', '', 'The text. One or two words.'],
      ['className', 'string', '', 'Extra classes on the badge.'],
      ['...rest', 'HTMLAttributes', '', 'Any native attribute on the <span>: style, id, title, aria-*, data-*.'],
    ],
  },

  usage: {
    when: [
      'To mark a listing as New, Bestseller, Sale or Staff pick.',
      'To show the status of an order, payout or listing: Paid, Pending, Failed, In review.',
      'To add a quiet fact like file format, version or license type.',
    ],
    whenNot: [
      'For something people can click or remove. Use a Chip.',
      'For a message that needs a sentence. Use an Alert.',
    ],
    anatomy: {
      render: <Badge variant="success" icon="checkmark-circle-02">Paid</Badge>,
      parts: [
        'Container: pill (radius-control), 24px tall (size-avatar-xs), padded with space-sm.',
        'Icon (optional): 16px, inherits the text color.',
        'Text: label-sm (Inter Display SemiBold 13/16), never wraps.',
        'Border: 1px in the feedback-*-border color on status variants. Pop and neutral variants have none.',
      ],
    },
    sections: [
      {
        title: 'Stickers and status',
        body: 'Pop stickers sell. Status badges report. Keep them apart: use pop colors for marketing labels and the feedback variants for anything that tells people the state of their money or work.',
        dos: [
          {
            do: <Badge variant="error" icon="alert-circle">Payout failed</Badge>,
            doText: 'Use the feedback variants for status, so a problem looks like a problem.',
            dont: <Badge variant="pink">Payout failed</Badge>,
            dontText: 'Don’t use a pop color for status. Pink reads like a promotion, not an error.',
          },
          {
            do: <Badge variant="lime">Bestseller</Badge>,
            doText: 'Use pop colors for marketing labels on listings and creators.',
            dont: <Badge variant="success" icon="checkmark-circle-02">Bestseller</Badge>,
            dontText: 'Don’t use Success for a sales label. Green with a check mark means something finished, not something popular.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'flex', gap: 8 }}><Badge variant="success" icon="checkmark-circle-02">Paid</Badge><Badge variant="error" icon="alert-circle">Failed</Badge></div>,
        doText: 'Always put a word in a status badge, and add the icon.',
        dont: <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Badge variant="success" style={{ width: 12, height: 12, padding: 0 }} /><Badge variant="error" style={{ width: 12, height: 12, padding: 0 }} /></div>,
        dontText: 'Don’t show status with a colored dot alone. People with color blindness can’t tell green from red.',
      },
      {
        do: <Badge variant="warning" icon="alert-02">Pending</Badge>,
        doText: 'Keep it to one or two words.',
        dont: <Badge variant="warning" icon="alert-02">Waiting for the bank to confirm</Badge>,
        dontText: 'Don’t write a sentence in a badge. It never wraps, so it stretches the layout. Use an Alert.',
      },
      {
        do: <Badge variant="yellow">New</Badge>,
        doText: 'Use sentence case, like the rest of the interface.',
        dont: <Badge variant="yellow">NEW!!</Badge>,
        dontText: 'Don’t use all caps or exclamation marks. The pop color already does the shouting.',
      },
      {
        do: <div style={{ width: 200 }}><AssetCard title="Orbit UI kit" creator="Mira Okafor" initials="MO" price="$49" badge="Bestseller" badgeVariant="lime" thumbColor="pop-violet" /></div>,
        doText: 'Use one sticker per listing, the one that matters most.',
        dont: <div style={{ position: 'relative', width: 200, aspectRatio: '4 / 3', borderRadius: 'var(--radius-xl)', background: 'var(--pop-violet)' }}><div style={{ position: 'absolute', left: 8, top: 8, display: 'grid', gap: 4, justifyItems: 'start' }}><Badge variant="lime">Bestseller</Badge><Badge variant="yellow">New</Badge><Badge variant="orange">Sale</Badge><Badge variant="pink">Staff pick</Badge></div></div>,
        dontText: 'Don’t stack stickers on a thumbnail. They hide the work and none of them stands out.',
      },
      {
        do: <Chip selected>Figma</Chip>,
        doText: 'Use a Chip for a filter people can turn on and off.',
        dont: <Badge>Figma</Badge>,
        dontText: 'Don’t make a Badge clickable. It has no hover, focus or pressed state, so nobody knows it does anything.',
      },
    ],
    content: [
      'Use one or two words in sentence case: “In review”, not “IN REVIEW”.',
      'Status words describe the state, not the action: “Paid”, “Failed”, “Pending”.',
      'Use the same word for the same state everywhere. Don’t mix “Live”, “Published” and “Active”.',
    ],
  },

  a11y: {
    notes: [
      'Badge is a plain <span> and isn’t focusable. Screen readers read its text in line with the content around it.',
      'Color is never the only signal: every status badge needs a word, and should carry its icon too.',
      'Pop variants use text-on-pop (ink) at 9:1 or more. Feedback variants use their feedback-*-text color at 4.5:1 or more on their own background.',
      'The icon is decorative (aria-hidden). The text carries the meaning.',
    ],
  },

  related: ['chip', 'asset-card', 'avatar'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Badge now passes native attributes (id, title, aria-*, data-*) through to the <span>.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Badge in React and HTML/CSS, matching the Figma component (5 pop stickers, neutral, ink and 4 status variants).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
