export default {
  id: 'creator-card',
  name: 'Creator card',
  group: 'Data display',
  order: 6,
  status: 'Stable',
  figma: '29:345',
  exports: ['CreatorCard'],
  summary: 'A short summary of a seller: avatar, name, a one-line bio, three stats and a Follow button. Use it to help buyers decide whose work to trust.',

  examples: [
    {
      title: 'Default',
      desc: 'Name, bio and stats sit in a bordered surface card (radius-xl, space-xl padding). The Follow button stretches to the full width at the bottom.',
      ...ex(`
<div style={{ width: 300 }}>
  <CreatorCard
    name="Mira Okafor"
    initials="MO"
    color="pop-orange"
    bio="UI kits and design systems for SaaS teams."
    stats={[
      { label: 'Listings', value: '48' },
      { label: 'Sales', value: '12.4k' },
      { label: 'Rating', value: '4.9' },
    ]}
  />
</div>`),
    },
    {
      title: 'Top creator',
      desc: 'Set verified to add the lime “Top creator” sticker under the name. Reserve it for creators who meet the marketplace’s top-seller bar.',
      ...ex(`
<div style={{ width: 300 }}>
  <CreatorCard
    name="Jonas Weber"
    initials="JW"
    color="pop-yellow"
    verified
    bio="Pixel-perfect icon packs, drawn on a 24px grid."
    stats={[
      { label: 'Listings', value: '31' },
      { label: 'Sales', value: '40.2k' },
      { label: 'Rating', value: '4.8' },
    ]}
  />
</div>`),
    },
    {
      title: 'Following',
      desc: 'Pass following and onFollow to make the button a toggle. When following, it switches to Tertiary with a tick and reads “Following”, and aria-pressed tells screen readers it is on.',
      ...ex(`function Example() {
  const [following, setFollowing] = useState(false);
  return (
    <div style={{ width: 300 }}>
      <CreatorCard
        name="Aiko Tanaka"
        initials="AT"
        color="pop-lime"
        bio="Presentation templates for founders."
        stats={[
          { label: 'Listings', value: '12' },
          { label: 'Sales', value: '3.1k' },
          { label: 'Rating', value: '4.7' },
        ]}
        following={following}
        onFollow={() => setFollowing(!following)}
      />
    </div>
  );
}`),
    },
    {
      title: 'Compact',
      desc: 'Bio and stats are optional. Leave them out in tight spaces like a sidebar, where the name and the Follow button are enough.',
      ...ex(`
<div style={{ width: 260 }}>
  <CreatorCard name="Leo Martins" initials="LM" color="pop-pink" />
</div>`),
    },
    {
      title: 'Creator grid',
      desc: 'On a “Top creators” page, lay cards in a grid of equal columns, the same way as asset cards.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 900, maxWidth: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
  <CreatorCard name="Mira Okafor" initials="MO" color="pop-orange" verified bio="UI kits and design systems for SaaS teams." stats={[{ label: 'Listings', value: '48' }, { label: 'Sales', value: '12.4k' }, { label: 'Rating', value: '4.9' }]} />
  <CreatorCard name="Priya Raman" initials="PR" color="pop-violet" bio="Dashboards and data viz kits." stats={[{ label: 'Listings', value: '22' }, { label: 'Sales', value: '8.9k' }, { label: 'Rating', value: '4.8' }]} />
  <CreatorCard name="Sam Rivera" initials="SR" color="pop-yellow" bio="Playful 3D shapes and illustrations." stats={[{ label: 'Listings', value: '17' }, { label: 'Sales', value: '5.6k' }, { label: 'Rating', value: '4.9' }]} />
</div>`),
    },
  ],

  props: {
    CreatorCard: [
      ['name', 'string', '', 'The creator’s display name. Also used in the Follow button’s aria-label.'],
      ['initials', 'string', '', 'Initials for the 56px avatar, shown when there is no src.'],
      ['src', 'string', '', 'Photo URL for the avatar. Cropped to a circle on bg-muted.'],
      ['color', 'PopToken', "'pop-violet'", 'Pop token name for the avatar. Use the creator’s stable color.'],
      ['verified', 'boolean', 'false', 'Shows the lime “Top creator” Badge under the name.'],
      ['bio', 'string', '', 'One short sentence about what they make.'],
      ['stats', 'Array<{ label: string, value: string }>', '', 'Up to three stats, shown in a 3-column row between hairlines.'],
      ['following', 'boolean', 'false', 'Switches the button to Tertiary with a tick and the label “Following”, and sets aria-pressed.'],
      ['onFollow', '() => void', '', 'Called when the Follow button is pressed.'],
      ['className', 'string', '', 'Extra classes on the card.'],
    ],
  },

  usage: {
    when: [
      'On a listing page, to introduce the person who made it.',
      'In “Top creators” and search results for creators.',
      'Anywhere buyers decide whether to follow a creator.',
    ],
    whenNot: [
      'For a listing. Use an Asset card.',
      'For a short byline on a card or in a review. Use an Avatar with the name.',
      'For a full profile page. Build a profile header with the same parts at a larger size.',
    ],
    anatomy: {
      render: <div style={{ width: 300 }}><CreatorCard name="Mira Okafor" initials="MO" color="pop-orange" verified bio="UI kits and design systems for SaaS teams." stats={[{ label: 'Listings', value: '48' }, { label: 'Sales', value: '12.4k' }, { label: 'Rating', value: '4.9' }]} /></div>,
      parts: [
        'Container: bg-surface, 1px border-subtle, radius-xl, space-xl padding, space-md between parts.',
        'Avatar: 56px (size-avatar-lg) on the creator’s pop color.',
        'Name: Inter Display SemiBold 16/24, with the optional “Top creator” Badge below.',
        'Bio (optional): body-sm in text-secondary.',
        'Stats (optional): three columns between border-subtle hairlines. Value SemiBold 16/24 with tabular figures, label in caption text-muted.',
        'Follow: Secondary Button, small, full width. Tertiary with a tick-02 icon when following.',
      ],
    },
    dos: [
      {
        do: <div style={{ width: 260 }}><CreatorCard name="Mira Okafor" initials="MO" color="pop-orange" bio="UI kits and design systems for SaaS teams." /></div>,
        doText: 'Keep the bio to one sentence about what they make.',
        dont: <div style={{ width: 260 }}><CreatorCard name="Mira Okafor" initials="MO" color="pop-orange" bio="Hi! I’m a product designer based in Lagos with over ten years of experience. I love building UI kits, design systems, icon sets and templates for SaaS teams, startups and agencies all over the world." /></div>,
        dontText: 'Don’t paste a long bio. It pushes the stats and Follow below the fold. Put the full story on the profile.',
      },
      {
        do: <div style={{ width: 260 }}><CreatorCard name="Jonas Weber" initials="JW" color="pop-yellow" stats={[{ label: 'Listings', value: '31' }, { label: 'Sales', value: '40.2k' }, { label: 'Rating', value: '4.8' }]} /></div>,
        doText: 'Show exactly three stats with short labels and rounded values.',
        dont: <div style={{ width: 260 }}><CreatorCard name="Jonas Weber" initials="JW" color="pop-yellow" stats={[{ label: 'Listings', value: '31' }, { label: 'Total lifetime sales', value: '40,218' }, { label: 'Rating', value: '4.83' }, { label: 'Followers', value: '9,412' }, { label: 'Joined', value: '2019' }]} /></div>,
        dontText: 'Don’t add more stats or long labels. The row wraps out of its grid and the numbers become hard to compare.',
      },
      {
        do: <div style={{ width: 260 }}><CreatorCard name="Aiko Tanaka" initials="AT" color="pop-lime" verified /></div>,
        doText: 'Use verified for the one badge the card supports.',
        dont: <div style={{ width: 260, display: 'grid', gap: 8 }}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}><Badge variant="pink">Rising star</Badge><Badge variant="violet">Fast replies</Badge><Badge variant="orange">Featured</Badge></div><CreatorCard name="Aiko Tanaka" initials="AT" color="pop-lime" verified /></div>,
        dontText: 'Don’t pile extra stickers around the card. When everyone has three badges, none of them mean anything.',
      },
    ],
    content: [
      'Use the creator’s display name, the same as on their profile and asset cards.',
      'Write the bio in the third person or as a plain description: “UI kits for SaaS teams.”',
      'Round big numbers in stats: “12.4k”, not “12,418”. Ratings take one decimal.',
      'Stat labels are one word: “Listings”, “Sales”, “Rating”.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the Follow button.'], ['Enter / Space', 'Follows or unfollows the creator.']],
    notes: [
      'The card is an <article>, so screen readers announce it as a separate piece of content.',
      'The Follow button’s aria-label matches its visible label plus the name (“Follow Mira Okafor” or “Following Mira Okafor”), so it makes sense out of context and works with voice control.',
      'The button sets aria-pressed, so screen readers announce it as a toggle that is on or off.',
      'Stats are text, with values in text-primary and labels in text-muted at 4.5:1 or more.',
      'The Follow button is Small (36px tall) but spans the full card width, so it stays easy to hit.',
    ],
  },

  related: ['avatar', 'asset-card', 'badge'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Follow now sets aria-pressed and an aria-label that matches the visible label, and turns Tertiary with a tick when following. Added src for the avatar photo.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Creator card in React and HTML/CSS, matching the Figma component (with bio, stats, Top creator and Following).' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Everything became pills, neutrals became pure grey, and Inter Display became the only typeface.' },
  ],
};
