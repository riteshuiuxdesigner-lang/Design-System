export default {
  id: 'modal',
  name: 'Modal',
  group: 'Overlays',
  order: 1,
  status: 'Stable',
  figma: '44:319',
  exports: ['Modal'],
  summary: 'A focused panel over a dimmed page that asks for one decision, like publishing a listing or deleting it. It has a sticker icon, a title, a short body and two actions.',

  examples: [
    {
      title: 'Default',
      desc: 'Open the Modal from a Button and keep open in state. The secondary button and the close button call onClose; the primary calls onPrimary. Escape and a click on the scrim also close it. Set loading while the action runs, so the primary shows a spinner and people can’t press it twice.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  function publish() {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setSubmitted(true);
      setOpen(false);
    }, 1200);
  }
  return (
    <>
      <Button leadingIcon="rocket-01" onClick={() => setOpen(true)} disabled={submitted}>
        {submitted ? 'In review' : 'Publish listing'}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Publish Orbit UI Kit?"
        primaryLabel={publishing ? 'Publishing' : 'Publish'}
        secondaryLabel="Keep editing"
        loading={publishing}
        onPrimary={publish}
      >
        Buyers can find it after a review that takes about 2 days. You can still edit the description while it is in review.
      </Modal>
    </>
  );
}`),
    },
    {
      title: 'Destructive',
      desc: 'Set tone="destructive" for actions that delete or remove something. The sticker turns red with delete-02, and the primary becomes a Destructive button. Name the object in the title and the button.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  if (deleted) {
    return <Button variant="secondary" onClick={() => setDeleted(false)}>Restore demo listing</Button>;
  }
  return (
    <>
      <Button variant="destructive" leadingIcon="delete-02" onClick={() => setOpen(true)}>Delete listing</Button>
      <Modal
        open={open}
        tone="destructive"
        onClose={() => setOpen(false)}
        title="Delete Neon Icon Pack?"
        primaryLabel="Delete listing"
        secondaryLabel="Keep listing"
        onPrimary={() => { setDeleted(true); setOpen(false); }}
      >
        This removes the listing and its 3 preview images. The 128 people who bought it keep their downloads. You can’t undo this.
      </Modal>
    </>
  );
}`),
    },
    {
      title: 'Sizes',
      desc: 'Small (400px) is the default and fits a confirmation. Medium (560px) fits a short form. Large (720px) fits a comparison or a preview.',
      ...ex(`function Example() {
  const [size, setSize] = useState(null);
  const content = {
    sm: { title: 'Unpublish Orbit UI Kit?', body: 'Buyers can’t find it until you publish it again. People who bought it keep their downloads.', primary: 'Unpublish', icon: 'view-off' },
    md: { title: 'Add a refund note', body: 'Tell Mira why you are asking for a refund. She can reply within 3 days, and you keep access until then.', primary: 'Send note', icon: 'message-01' },
    lg: { title: 'Compare licenses', body: 'Personal ($49) covers your own projects. Commercial ($79) covers client work and products you sell. Extended ($249) covers templates and themes you resell.', primary: 'Choose Commercial', icon: 'license' },
  }[size || 'sm'];
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => setSize('sm')}>Small</Button>
        <Button variant="secondary" onClick={() => setSize('md')}>Medium</Button>
        <Button variant="secondary" onClick={() => setSize('lg')}>Large</Button>
      </div>
      <Modal
        open={!!size}
        size={size || 'sm'}
        icon={content.icon}
        onClose={() => setSize(null)}
        title={content.title}
        primaryLabel={content.primary}
        onPrimary={() => setSize(null)}
      >
        {content.body}
      </Modal>
    </>
  );
}`),
    },
    {
      title: 'Custom icon or none',
      desc: 'The sticker defaults to rocket-01 (or delete-02 when destructive). Pass any icon name that fits the decision, or icon={false} to leave it out.',
      ...ex(`function Example() {
  const [which, setWhich] = useState(null);
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <Button variant="secondary" leadingIcon="dollar-01" onClick={() => setWhich('payout')}>Request payout</Button>
        <Button variant="secondary" onClick={() => setWhich('plain')}>Leave without saving</Button>
      </div>
      <Modal
        open={which === 'payout'}
        icon="dollar-01"
        onClose={() => setWhich(null)}
        title="Send $1,240.00 to your bank?"
        primaryLabel="Request payout"
        onPrimary={() => setWhich(null)}
      >
        It arrives in the account ending 4821 in 1–3 business days.
      </Modal>
      <Modal
        open={which === 'plain'}
        icon={false}
        onClose={() => setWhich(null)}
        title="Leave without saving?"
        primaryLabel="Leave page"
        secondaryLabel="Stay"
        onPrimary={() => setWhich(null)}
      >
        Your changes to the description will be lost.
      </Modal>
    </>
  );
}`),
    },
    {
      title: 'Inline preview',
      desc: 'inline renders the panel in place, with no scrim and no focus handling. Use it for docs, onboarding and design reviews; never for a real decision.',
      stage: 'muted',
      ...ex(`
<Modal inline open title="Publish Orbit UI Kit?" primaryLabel="Publish" secondaryLabel="Keep editing">
  Buyers can find it after a review that takes about 2 days.
</Modal>`),
    },
    {
      title: 'With a form',
      desc: 'Use Medium for a short form. Keep it to the fields needed for this one decision. primaryDisabled blocks saving while the field shows why.',
      ...ex(`function Example() {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState('49');
  const [saved, setSaved] = useState('49');
  const valid = Number(price) >= 1;
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <PriceTag price={'$' + saved} size="md" />
        <Button variant="secondary" size="sm" leadingIcon="edit-02" onClick={() => setOpen(true)}>Edit price</Button>
      </div>
      <Modal
        open={open}
        size="md"
        icon="tag-01"
        onClose={() => { setPrice(saved); setOpen(false); }}
        title="Edit price for Orbit UI Kit"
        primaryLabel="Save price"
        primaryDisabled={!valid}
        onPrimary={() => { setSaved(price); setOpen(false); }}
      >
        <div style={{ display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
          <TextField
            label="Price in USD"
            leadingIcon="dollar-01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            inputMode="decimal"
            helper={valid ? 'You get $' + (Number(price) * 0.88).toFixed(2) + ' per sale after the 12% fee.' : undefined}
            error={valid ? undefined : 'Set a price of $1 or more, or make the listing free.'}
          />
        </div>
      </Modal>
    </>
  );
}`),
    },
  ],

  props: {
    Modal: [
      ['open', 'boolean', 'false', 'Shows the Modal. When false, nothing renders.'],
      ['onClose', '() => void', '', 'Called by the close button, the secondary button, Escape and a click on the scrim.'],
      ['title', 'ReactNode', '', 'The question or decision. heading-2 size, linked with aria-labelledby.'],
      ['children', 'ReactNode', '', 'The body. One or two sentences, or a short form.'],
      ['primaryLabel', 'string', "'Confirm'", 'Label of the primary button. Start with a verb and name the result: “Publish”, “Delete listing”.'],
      ['secondaryLabel', 'string', "'Cancel'", 'Label of the secondary button, which closes the Modal. Say what staying means: “Keep editing”.'],
      ['onPrimary', '() => void', '', 'Called by the primary button. Close the Modal yourself when the action succeeds.'],
      ['tone', "'destructive'", '', 'Red sticker with delete-02 and a Destructive primary button.'],
      ['icon', 'IconName | false', "'rocket-01'", 'Icon in the 48px sticker. Defaults to delete-02 when destructive. false removes the sticker.'],
      ['size', "'sm' | 'md' | 'lg'", "'sm'", 'Maximum width 400 / 560 / 720px (size-modal-*).'],
      ['loading', 'boolean', 'false', 'Shows a spinner in the primary button and sets aria-busy. Use it while onPrimary runs.'],
      ['primaryDisabled', 'boolean', 'false', 'Disables the primary button. Show the reason in the body, like a field error.'],
      ['inline', 'boolean', 'false', 'Renders the panel in place with no scrim, no Escape handling and no focus trap. For docs and previews only.'],
      ['className', 'string', '', 'Extra class on the panel.'],
      ['style', 'CSSProperties', '', 'Inline style on the panel. Use tokens only.'],
    ],
  },

  usage: {
    when: [
      'To confirm an action that is hard to undo: publishing, deleting, requesting a payout.',
      'For a short task that has to happen before people continue, like setting a price.',
    ],
    whenNot: [
      'To confirm that something worked. Use a Toast.',
      'For long forms or settings people want to compare with the page. Use a Drawer or a full page.',
      'For warnings people can act on later. Use an Alert.',
      'For extra detail next to a control. Use a Popover.',
    ],
    anatomy: {
      render: (
        <Modal inline open tone="destructive" title="Delete Neon Icon Pack?" primaryLabel="Delete listing" secondaryLabel="Keep listing">
          This removes the listing and its 3 preview images. You can’t undo this.
        </Modal>
      ),
      parts: [
        'Scrim: bg-overlay over the whole page, fades in over 200ms. Not shown in inline previews.',
        'Panel: bg-raised, radius-2xl, elevation-4, padded with space-xl. Springs in over 320ms.',
        'Sticker: 48px circle (size-avatar-lg) tilted −6°. pop-yellow with icon-on-pop, or feedback-error-bg with feedback-error-icon when destructive.',
        'Close button: small ghost IconButton with cancel-01, top right.',
        'Title: Inter Display SemiBold 24/32 in text-primary.',
        'Body: body-md (Inter Display 15/22) in text-secondary.',
        'Actions: Button Group with a Secondary and a Primary (or Destructive), space-md above.',
      ],
    },
    sections: [
      {
        title: 'Two actions, no more',
        body: 'A Modal asks one question, so it gets two answers: do it, or don’t. If you need a third option, the question is too broad. Split it, or move the extra action back to the page.',
        dos: [
          {
            do: (
              <Modal inline open title="Publish Orbit UI Kit?" primaryLabel="Publish" secondaryLabel="Keep editing">
                Buyers can find it after a review that takes about 2 days.
              </Modal>
            ),
            doText: 'Offer one Primary and one way back.',
            dont: (
              <Modal inline open title="Publish Orbit UI Kit?" primaryLabel="Publish" secondaryLabel="Cancel">
                Buyers can find it after a review that takes about 2 days.
                <div style={{ marginTop: 'var(--space-md)' }}><Button variant="secondary" style={{ width: '100%' }}>Save as draft</Button></div>
              </Modal>
            ),
            dontText: 'Don’t add a third button. People stop to compare three options and often pick the wrong one.',
          },
        ],
      },
      {
        title: 'Destructive confirmations',
        body: 'Say exactly what will be lost and whether it can be undone. The primary button repeats the verb and the object, so people can answer without reading the body again.',
        dos: [
          {
            do: (
              <Modal inline open tone="destructive" title="Delete Neon Icon Pack?" primaryLabel="Delete listing" secondaryLabel="Keep listing">
                This removes the listing and its 3 preview images. Buyers keep their downloads. You can’t undo this.
              </Modal>
            ),
            doText: 'Name the object in the title and the button, and say what happens to it.',
            dont: (
              <Modal inline open tone="destructive" title="Are you sure?" primaryLabel="Yes" secondaryLabel="No">
                This action cannot be undone.
              </Modal>
            ),
            dontText: 'Don’t ask “Are you sure?” with Yes and No. People can’t tell what they are deleting, and “Yes” says nothing.',
          },
        ],
      },
    ],
    dos: [
      {
        do: (
          <Modal inline open icon="dollar-01" title="Send $1,240.00 to your bank?" primaryLabel="Request payout" secondaryLabel="Not now">
            It arrives in the account ending 4821 in 1–3 business days.
          </Modal>
        ),
        doText: 'Label buttons with what they do.',
        dont: (
          <Modal inline open icon="dollar-01" title="Payout">
            Do you want to request a payout of $1,240.00 to the account ending 4821?
          </Modal>
        ),
        dontText: 'Don’t keep the default “Confirm” and “Cancel”. People have to read the body to know what Confirm does.',
      },
      {
        do: <Toast message="Added to Dashboard kits" actionLabel="Undo" onAction={() => {}} />,
        doText: 'Confirm a finished action with a Toast.',
        dont: (
          <Modal inline open icon="checkmark-circle-02" title="Success" primaryLabel="OK" secondaryLabel="Close">
            Orbit UI Kit was added to your collection.
          </Modal>
        ),
        dontText: 'Don’t open a Modal just to say something worked. It interrupts people for no decision.',
      },
      {
        do: (
          <Modal inline open icon="license" title="Switch to a Commercial license?" primaryLabel="Switch for $30" secondaryLabel="Keep Personal">
            You can sell products built with Orbit UI Kit. The full terms are in <Link href="#">License details</Link>.
          </Modal>
        ),
        doText: 'Keep the body short and link to the details.',
        dont: (
          <Modal inline open icon="license" title="License agreement" primaryLabel="Accept" secondaryLabel="Decline">
            The Commercial license grants you a worldwide, non-exclusive, non-transferable right to use the Item in End Products that are sold, provided the Item is not redistributed on its own, the End Product adds significant value, attribution is kept where required, and the license is held by the person or company that bills the client.
          </Modal>
        ),
        dontText: 'Don’t put long legal text in a Modal. Nobody reads it in a small box; give it a page.',
      },
    ],
    content: [
      'Title: a short question with the object. “Publish Orbit UI Kit?”, “Delete Neon Icon Pack?”.',
      'Body: what happens next, in one or two sentences. Say if it can’t be undone.',
      'Primary: verb plus object, matching the title. “Delete listing”, “Request payout”.',
      'Secondary: what staying means, like “Keep editing” or “Keep listing”. Use “Cancel” only when nothing better fits.',
    ],
  },

  a11y: {
    keyboard: [
      ['Escape', 'Closes the Modal (calls onClose).'],
      ['Tab / Shift+Tab', 'Moves between the close button, any fields and the two actions, and wraps around inside the Modal.'],
      ['Enter / Space', 'Activates the focused button.'],
    ],
    notes: [
      'The panel has role="dialog", aria-modal="true" and aria-labelledby pointing to the title.',
      'Each Modal gets its own title id, so several on one page never clash.',
      'When it opens, focus moves to the panel, Tab stays inside it and the page behind stops scrolling. When it closes, focus goes back to the element that opened it.',
      'While loading, the primary button keeps its label and sets aria-busy="true".',
      'The close button is an IconButton with the label “Close”. The sticker icon is decorative.',
      'Title and body are text-primary and text-secondary on bg-raised, at least 4.5:1 in both themes.',
      'The panel springs in over 320ms and the scrim fades in over 200ms. Under prefers-reduced-motion both appear at once.',
    ],
  },

  related: ['drawer', 'toast', 'popover', 'button-group'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Added', notes: 'Added a focus trap with scroll lock and focus return, a unique title id, and the loading, primaryDisabled, className and style props.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Modal in React and HTML/CSS, matching the Figma component (3 sizes, default and destructive). Adds inline for previews.' },
    { v: '0.2.0', date: '2026-10-08', type: 'Changed', notes: 'Panels moved to radius-2xl with a tilted pop-yellow sticker, and actions became pills.' },
  ],
};
