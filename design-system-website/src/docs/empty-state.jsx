export default {
  id: 'empty-state',
  name: 'Empty state',
  group: 'Feedback',
  order: 7,
  status: 'Stable',
  figma: '35:210',
  exports: ['EmptyState', 'Illustration'],
  summary: 'What people see when there is nothing to show yet: no listings, no search results, no sales. A sticker illustration, one plain sentence of why, and the next step to fill the space.',

  examples: [
    {
      title: 'Default',
      desc: 'Title says what is empty, body says how to fill it, and one Primary button starts that step. The listings scene is the default.',
      ...ex(`
<EmptyState
  title="You haven’t listed anything yet"
  body="Upload a UI kit, icon pack or template, and buyers can find it in about 2 days."
  action={<Button leadingIcon="upload-01">Upload your first asset</Button>}
/>`),
    },
    {
      title: 'Scenes',
      desc: 'Illustration has three scenes built only from tokens: listings (lime tile), search (violet tile) and error (orange tile). They flip with the theme, so dark mode needs no extra art.',
      ...ex(`
<div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
  <Illustration scene="listings" />
  <Illustration scene="search" />
  <Illustration scene="error" />
</div>`),
    },
    {
      title: 'No search results',
      desc: 'Repeat what people searched for and suggest a way to widen it. A Secondary button is enough here, because the search field is still the main control.',
      ...ex(`
<EmptyState
  scene="search"
  title="No results for “glassmorphism dashboard”"
  body="Check the spelling or try a broader word, like “dashboard”."
  action={<Button variant="secondary" leadingIcon="filter-horizontal">Clear filters</Button>}
/>`),
    },
    {
      title: 'Error',
      desc: 'When content fails to load, use the error scene. Say what failed and how to fix it, and offer Retry.',
      ...ex(`
<EmptyState
  scene="error"
  title="Couldn’t load your sales"
  body="Check your connection, then retry. Your sales data is safe."
  action={<Button variant="secondary" leadingIcon="refresh">Retry</Button>}
/>`),
    },
    {
      title: 'Two actions',
      desc: 'If there are two good next steps, pass a Button Group with a Secondary and a Primary. Never more than two.',
      ...ex(`
<EmptyState
  title="This collection is empty"
  body="Save assets you like from any listing, and they show up here."
  action={
    <ButtonGroup label="Next steps">
      <Button variant="secondary">Import from Figma</Button>
      <Button leadingIcon="search-01">Browse UI kits</Button>
    </ButtonGroup>
  }
/>`),
    },
    {
      title: 'In a filtered list',
      desc: 'Show the empty state inside the area that is empty, under the search and filters, so people can change them right there.',
      stage: 'muted',
      ...ex(`function Example() {
  const kits = ['Orbit UI Kit', 'Neon Icon Pack', 'Pitch Deck Template', 'Dashboard UI Kit'];
  const [query, setQuery] = useState('glass');
  const results = kits.filter(k => k.toLowerCase().indexOf(query.toLowerCase()) >= 0);

  return (
    <div style={{ width: 420, display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <SearchField value={query} onChange={setQuery} placeholder="Search your purchases" shortcut={false} />
      {results.length ? (
        <div style={{ display: 'grid' }}>
          {results.map(k => <ListItem key={k} title={k} meta="Purchased · Commercial license" leading={<Icon name="package" />} />)}
        </div>
      ) : (
        <EmptyState
          scene="search"
          title={'No purchases match “' + query + '”'}
          body="Try another word, or clear the search to see all 4 purchases."
          action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
        />
      )}
    </div>
  );
}`),
    },
  ],

  props: {
    EmptyState: [
      ['title', 'ReactNode', '', 'What is empty, in plain words. Rendered as a heading (h3 by default).'],
      ['headingLevel', '1 | 2 | 3 | 4 | 5 | 6', '3', 'Heading level of the title, so it fits the page’s heading order. The look stays the same.'],
      ['body', 'ReactNode', '', 'One sentence on why it is empty or how to fill it.'],
      ['action', 'ReactNode', '', 'The next step. One Button, or a Button Group of two.'],
      ['scene', "'listings' | 'search' | 'error'", "'listings'", 'Which Illustration to show above the title.'],
      ['className', 'string', '', 'Extra class on the wrapper.'],
    ],
    Illustration: [
      ['scene', "'listings' | 'search' | 'error'", "'listings'", 'A 200 × 140 sticker scene (Figma 35:57): a window frame with a pop-lime, pop-violet or pop-orange tile and a yellow sticker (a tick, or a cross for error). Unknown scenes fall back to listings. Built from illustration-* and pop-* tokens.'],
    ],
  },

  usage: {
    when: [
      'When a list, grid or page has nothing in it yet: no listings, no sales, an empty collection.',
      'When a search or filter returns no results.',
      'When content fails to load and the whole area is empty.',
    ],
    whenNot: [
      'While content is loading. Use a Skeleton.',
      'For a small empty part of a busy page, like an empty table cell. Use a short line of text in text-muted.',
      'For an error in one part of a page that still works. Use an Alert.',
    ],
    anatomy: {
      render: (
        <EmptyState
          title="You haven’t listed anything yet"
          body="Upload a UI kit, icon pack or template to start selling."
          action={<Button leadingIcon="upload-01">Upload your first asset</Button>}
        />
      ),
      parts: [
        'Illustration: 200 × 140 sticker scene in illustration-fill, illustration-stroke and one pop color. Decorative.',
        'Title: heading-4 (Inter Display SemiBold 20/28) in text-primary, space-md below the illustration.',
        'Body: body-md (Inter Display 15/22) in text-secondary. One sentence.',
        'Action: one Button or a Button Group of two, space-sm below the body.',
        'Container: centered, up to 400px wide, padded with space-2xl and space-lg.',
      ],
    },
    sections: [
      {
        title: 'Pick the scene from the cause',
        body: 'The scene tells people at a glance whether the space is empty because they haven’t started, because a search missed, or because something broke.',
        dos: [
          {
            do: <EmptyState scene="error" title="Couldn’t load your sales" body="Check your connection, then retry." action={<Button variant="secondary" size="sm">Retry</Button>} />,
            doText: 'Use the error scene when loading fails, and offer Retry.',
            dont: <EmptyState title="No sales yet" body="Share your listings to get your first sale." action={<Button size="sm">Share listings</Button>} />,
            dontText: 'Don’t show “No sales yet” when the request failed. People think their sales are gone.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <EmptyState title="No listings yet" body="Upload a UI kit or icon pack to start selling." action={<Button size="sm" leadingIcon="upload-01">Upload asset</Button>} />,
        doText: 'Say what is empty and give the next step.',
        dont: (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: 200, font: '400 15px/22px var(--font-display)', color: 'var(--text-muted)' }}>No data</div>
        ),
        dontText: 'Don’t leave a bare “No data”. People can’t tell if something broke or what to do next.',
      },
      {
        do: <EmptyState scene="search" title="No results for “glassmorphism”" body="Try a broader word, like “dashboard”." action={<Button variant="secondary" size="sm">Clear filters</Button>} />,
        doText: 'Repeat the search and suggest how to widen it.',
        dont: <EmptyState scene="search" title="Your search returned 0 results" body="Please modify your query and try again." />,
        dontText: 'Don’t use system language with no way forward. People don’t know what to change.',
      },
      {
        do: <EmptyState title="This collection is empty" body="Save assets you like, and they show up here." action={<Button size="sm">Browse UI kits</Button>} />,
        doText: 'Give one clear action, two at most.',
        dont: (
          <EmptyState
            title="This collection is empty"
            body="Save assets you like, and they show up here."
            action={
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button size="sm">Browse UI kits</Button>
                <Button size="sm">Browse icons</Button>
                <Button size="sm">Import</Button>
              </div>
            }
          />
        ),
        dontText: 'Don’t offer a row of Primary buttons. With three equal choices, people pick none.',
      },
    ],
    content: [
      'Title: what is empty, from the user’s side, like “You haven’t listed anything yet”. For searches, repeat the search term.',
      'Body: one sentence on how to fill it, or what went wrong and how to fix it. No apologies.',
      'Action: a verb and an object, like “Upload your first asset” or “Clear filters”.',
      'First-use states can be warm. Error states stay calm and plain.',
    ],
  },

  a11y: {
    keyboard: [['Tab', 'Moves focus to the action buttons.'], ['Enter / Space', 'Activates the focused button.']],
    notes: [
      'The illustration is aria-hidden="true". The title and body carry all the meaning.',
      'The title is an h3 by default. Set headingLevel so it follows the heading above it, like 2 under the page’s h1.',
      'When a search empties the list, the change is not announced. Add a polite live region with the result count, like “0 results”.',
      'Title is text-primary and body is text-secondary on bg-surface, both at least 4.5:1.',
      'The illustration uses illustration-* tokens, so it keeps its contrast in dark mode.',
    ],
  },

  related: ['skeleton', 'alert', 'search-field', 'button'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added headingLevel. Illustration now falls back to the listings scene for unknown names, and the error scene shows a cross sticker instead of a tick.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Empty state and Illustration in React and HTML/CSS, matching the Figma components (3 scenes).' },
  ],
};
