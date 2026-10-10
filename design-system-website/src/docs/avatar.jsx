export default {
  id: 'avatar',
  name: 'Avatar',
  group: 'Data display',
  order: 2,
  status: 'Stable',
  figma: '27:90',
  exports: ['Avatar', 'AvatarGroup'],
  summary: 'A round picture of a creator or buyer: initials on a pop color, or a photo. Avatar group overlaps up to four and counts the rest.',

  examples: [
    {
      title: 'Sizes',
      desc: 'Extra small (24px) sits in bylines on cards. Small (32px) fits list rows and tables. Medium (40px) is the default. Large (56px) is for profile headers and creator cards.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <Avatar size="xs" initials="MO" name="Mira Okafor" />
  <Avatar size="sm" initials="MO" name="Mira Okafor" />
  <Avatar initials="MO" name="Mira Okafor" />
  <Avatar size="lg" initials="MO" name="Mira Okafor" />
</div>`),
    },
    {
      title: 'Pop colors',
      desc: 'Pass a pop token name as color. Give each person one color and keep it everywhere they appear. Initials always use ink text (text-on-pop).',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <Avatar initials="MO" color="pop-orange" name="Mira Okafor" />
  <Avatar initials="JW" color="pop-yellow" name="Jonas Weber" />
  <Avatar initials="AT" color="pop-lime" name="Aiko Tanaka" />
  <Avatar initials="LM" color="pop-pink" name="Leo Martins" />
  <Avatar initials="PR" color="pop-violet" name="Priya Raman" />
</div>`),
    },
    {
      title: 'Online status',
      desc: 'Status adds a green dot in the bottom-right corner, with a ring in bg-surface so it reads on any color. The dot has no text, so say “Online” next to it.',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <Avatar initials="AT" color="pop-lime" name="Aiko Tanaka" status />
  <div style={{ display: 'grid' }}>
    <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Aiko Tanaka</span>
    <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Online now · replies in about 1 hour</span>
  </div>
</div>`),
    },
    {
      title: 'Avatar group',
      desc: 'Avatar group overlaps people with a 2px bg-surface ring. It shows up to max (4 by default) and turns the rest into a “+N” count. Give it a label that says who these people are.',
      ...ex(`
<AvatarGroup
  label="7 collaborators on Orbit UI kit"
  people={[
    { initials: 'MO', color: 'pop-orange', name: 'Mira Okafor' },
    { initials: 'JW', color: 'pop-yellow', name: 'Jonas Weber' },
    { initials: 'AT', color: 'pop-lime', name: 'Aiko Tanaka' },
    { initials: 'LM', color: 'pop-pink', name: 'Leo Martins' },
    { initials: 'PR', color: 'pop-violet', name: 'Priya Raman' },
    { initials: 'SR', color: 'pop-yellow', name: 'Sam Rivera' },
    { initials: 'NK', color: 'pop-lime', name: 'Nora Kim' },
  ]}
/>`),
    },
    {
      title: 'Small group with a caption',
      desc: 'Use a small group to show who bought or collaborated, and say the total in words next to it.',
      ...ex(`
<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <AvatarGroup
    size="sm"
    max={3}
    label="Recent buyers"
    people={[
      { initials: 'JW', color: 'pop-yellow', name: 'Jonas Weber' },
      { initials: 'AT', color: 'pop-lime', name: 'Aiko Tanaka' },
      { initials: 'LM', color: 'pop-pink', name: 'Leo Martins' },
      { initials: 'PR', color: 'pop-violet', name: 'Priya Raman' },
    ]}
  />
  <span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}>Bought by 1,240 designers</span>
</div>`),
    },
    {
      title: 'In a byline',
      desc: 'Next to a name, the avatar helps people recognise a creator at a glance. The name stays the main way to identify them.',
      stage: 'muted',
      ...ex(`
<div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 'var(--space-md) var(--space-lg)', background: 'var(--bg-surface)', border: 'var(--border-width-default) solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
  <Avatar size="md" initials="MO" color="pop-orange" name="Mira Okafor" />
  <div style={{ display: 'grid' }}>
    <span style={{ font: '600 15px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor</span>
    <span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>48 listings · Lagos</span>
  </div>
  <Button variant="secondary" size="sm" style={{ marginLeft: 'auto' }}>Follow</Button>
</div>`),
    },
  ],

  props: {
    Avatar: [
      ['initials', 'string', '', 'One or two letters, shown when there is no src.'],
      ['src', 'string', '', 'Photo URL. Shown as a cover-cropped circle on bg-muted. The image itself has empty alt; use name for the accessible name.'],
      ['name', 'string', '', 'The person’s name. Sets role="img" and aria-label. Leave it out when the name is already written next to the avatar.'],
      ['size', "'xs' | 'sm' | 'md' | 'lg'", "'md'", '24 / 32 / 40 / 56px (size-avatar-*).'],
      ['color', "'pop-yellow' | 'pop-lime' | 'pop-pink' | 'pop-orange' | 'pop-violet'", "'pop-orange'", 'Background behind the initials, as a pop token name. Keep it stable per person.'],
      ['status', 'boolean', 'false', 'Shows the green online dot in the bottom-right corner.'],
      ['className', 'string', '', 'Extra classes on the avatar.'],
    ],
    AvatarGroup: [
      ['people', 'Array<{ initials, color?, src?, name? }>', '[]', 'The people to show, in order. Each item takes the same fields as Avatar.'],
      ['max', 'number', '4', 'How many avatars to show before the “+N” count.'],
      ['size', "'xs' | 'sm' | 'md' | 'lg'", "'md'", 'Size of every avatar in the group, including the count.'],
      ['label', 'string', "'N people'", 'aria-label for the group (role="group"). Defaults to the number of people, like “7 people”.'],
      ['className', 'string', '', 'Extra classes on the group.'],
    ],
  },

  usage: {
    when: [
      'To show who made a listing, who left a review, or who is in a conversation.',
      'Next to a name in bylines, lists, tables and creator cards.',
      'To show a few buyers or collaborators at once (Avatar group).',
    ],
    whenNot: [
      'To show a listing or a brand. Use the listing thumbnail or the Logo.',
      'As the only way to identify a person. Write their name next to it.',
      'For an exact count of people. Write the number in words next to the group.',
    ],
    anatomy: {
      render: <Avatar size="lg" initials="AT" color="pop-lime" name="Aiko Tanaka" status />,
      parts: [
        'Container: circle (radius-full), 40px by default (size-avatar-md).',
        'Fill: a pop token (pop-orange by default), or bg-muted behind a photo.',
        'Initials: Inter Display SemiBold in text-on-pop (ink).',
        'Status dot (optional): size-track-md, feedback-success-icon, with a 2px bg-surface ring.',
      ],
    },
    sections: [
      {
        title: 'Avatar group',
        body: <p className="p">A group says “these people and more”. It is not a list. Show up to four, let the count cover the rest, and put the real total in words next to it. Avatar group has its own <Link external href="https://www.figma.com/design/sc4yzKdTRekt8TLQZYPkAV/Claude-design-system?node-id=27-121">Figma component</Link>.</p>,
        dos: [
          {
            do: <AvatarGroup people={[{ initials: 'MO', color: 'pop-orange' }, { initials: 'JW', color: 'pop-yellow' }, { initials: 'AT', color: 'pop-lime' }, { initials: 'LM', color: 'pop-pink' }, { initials: 'PR', color: 'pop-violet' }, { initials: 'SR', color: 'pop-yellow' }, { initials: 'NK', color: 'pop-lime' }, { initials: 'DB', color: 'pop-orange' }]} />,
            doText: 'Keep the default max of 4 and let “+N” stand for the rest.',
            dont: <AvatarGroup max={8} people={[{ initials: 'MO', color: 'pop-orange' }, { initials: 'JW', color: 'pop-yellow' }, { initials: 'AT', color: 'pop-lime' }, { initials: 'LM', color: 'pop-pink' }, { initials: 'PR', color: 'pop-violet' }, { initials: 'SR', color: 'pop-yellow' }, { initials: 'NK', color: 'pop-lime' }, { initials: 'DB', color: 'pop-orange' }]} />,
            dontText: 'Don’t raise max to show everyone. A long row of faces is hard to scan and takes too much room.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={{ display: 'grid', gap: 8 }}><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="MO" color="pop-orange" /><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor</span></div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="MO" color="pop-orange" /><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor replied</span></div></div>,
        doText: 'Give each person one pop color and keep it everywhere they appear.',
        dont: <div style={{ display: 'grid', gap: 8 }}><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="MO" color="pop-orange" /><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor</span></div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="MO" color="pop-violet" /><span style={{ font: '500 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Mira Okafor replied</span></div></div>,
        dontText: 'Don’t pick a random color on each screen. People learn to spot a creator by color and get confused when it changes.',
      },
      {
        do: <Avatar initials="MO" color="pop-orange" name="Mira Okafor" />,
        doText: 'Use one or two initials: first and last name.',
        dont: <Avatar initials="MIRA" color="pop-orange" name="Mira Okafor" />,
        dontText: 'Don’t squeeze a whole name into the circle. It overflows, and the circle is meant to be recognised, not read.',
      },
      {
        do: <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="LM" color="pop-pink" /><span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Leo Martins</span><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>· Online</span></div>,
        doText: 'Say “Online” in words next to the status dot.',
        dont: <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="sm" initials="LM" color="pop-pink" status /><span style={{ font: '600 14px/20px var(--font-display)', color: 'var(--text-primary)' }}>Leo Martins</span></div>,
        dontText: 'Don’t rely on the green dot alone. Screen readers don’t announce it and some people can’t see the color.',
      },
      {
        do: <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Avatar size="xs" initials="PR" color="pop-violet" /><span style={{ font: '500 12px/16px var(--font-display)', color: 'var(--text-muted)' }}>Priya Raman</span></div>,
        doText: 'Pair the avatar with the person’s name.',
        dont: <Avatar size="xs" initials="PR" color="pop-violet" />,
        dontText: 'Don’t show an avatar on its own in a byline. Initials alone don’t tell people who made the listing.',
      },
    ],
    content: [
      'Initials are the first letter of the first and last name, in capitals: “MO” for Mira Okafor.',
      'When there is no name, use the first letter of the username.',
      'Write group totals in words with real numbers: “Bought by 1,240 designers”.',
    ],
  },

  a11y: {
    notes: [
      'With name, the avatar has role="img" and aria-label, so screen readers announce the person. Without name, screen readers read the initials as text.',
      'Leave name out when the name is already written next to the avatar, so it isn’t read twice.',
      'Initials use text-on-pop (ink) on pop colors at 9:1 or more.',
      'The status dot is visual only and has no accessible text. Say the status in words nearby.',
      'Avatar group has role="group" and an aria-label (label, or “N people” by default). The “+N” count is announced as “N more”.',
      'Still write the total in words next to the group when it matters, like “Bought by 1,240 designers”. The group only knows the people you pass in.',
    ],
  },

  related: ['creator-card', 'list-item', 'badge'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Avatar group now has role="group" with a label prop (default “N people”), and the “+N” count is announced as “N more”.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Avatar and Avatar group in React and HTML/CSS, matching the Figma components (4 sizes, initials or photo, online status).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
