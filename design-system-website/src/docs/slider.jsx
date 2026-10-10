const w = { width: 280, maxWidth: '100%' };
const usd = (v) => '$' + v;

export default {
  id: 'slider',
  name: 'Slider',
  group: 'Inputs',
  order: 7,
  status: 'Stable',
  figma: '22:73',
  exports: ['Slider'],
  summary: 'A rail with a draggable thumb for picking a value, or two thumbs for a range. Use it where the rough position matters more than an exact number, like a price filter.',

  examples: [
    {
      title: 'Single value',
      desc: 'The label sits on the left and the current value on the right. format turns the number into what people read, like a percentage.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <Slider label="Discount" min={0} max={90} step={5} defaultValue={20} format={v => v + '%'} />
</div>`),
    },
    {
      title: 'Range',
      desc: 'Set range for two thumbs. The value is [min, max] and the thumbs can’t cross.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%' }}>
  <Slider label="Price" range min={0} max={200} step={5} defaultValue={[20, 120]} format={v => '$' + v} />
</div>`),
    },
    {
      title: 'Step',
      desc: 'step sets the size of each move. Match it to the values people care about: whole stars, $5 jumps, 10 screens.',
      ...ex(`
<div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-lg)' }}>
  <Slider label="Minimum rating" min={1} max={5} step={0.5} defaultValue={4} format={v => v.toFixed(1) + ' stars'} />
  <Slider label="Screens in the kit" range min={0} max={200} step={10} defaultValue={[40, 120]} />
</div>`),
    },
    {
      title: 'With exact inputs',
      desc: 'Pair a range with two Text fields when people may want an exact number. Both stay in sync through value and onChange.',
      ...ex(`function Example() {
  const [price, setPrice] = useState([20, 120]);
  function setEdge(i, text) {
    const n = Math.max(0, Math.min(200, Number(text) || 0));
    setPrice(i === 0 ? [Math.min(n, price[1]), price[1]] : [price[0], Math.max(n, price[0])]);
  }
  return (
    <div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)' }}>
      <Slider label="Price" range min={0} max={200} step={5} value={price} onChange={setPrice} format={v => '$' + v} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
        <TextField size="sm" label="Min" leadingIcon="dollar-01" inputMode="numeric" value={String(price[0])} onChange={e => setEdge(0, e.target.value)} />
        <TextField size="sm" label="Max" leadingIcon="dollar-01" inputMode="numeric" value={String(price[1])} onChange={e => setEdge(1, e.target.value)} />
      </div>
    </div>
  );
}`),
    },
    {
      title: 'In a filter panel',
      desc: 'The browse filters: a price range, a format choice and the results action. The count updates as people drag.',
      stage: 'muted',
      ...ex(`function Example() {
  const [price, setPrice] = useState([0, 80]);
  const [figma, setFigma] = useState(true);
  const [sketch, setSketch] = useState(false);
  const count = Math.round(40 + (price[1] - price[0]) * 3.4);
  return (
    <div style={{ width: 320, maxWidth: '100%', display: 'grid', gap: 'var(--space-lg)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
      <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Filters</span>
      <Slider label="Price" range min={0} max={200} step={5} value={price} onChange={setPrice} format={v => '$' + v} />
      <div style={{ display: 'grid' }}>
        <Checkbox label="Figma files" checked={figma} onChange={e => setFigma(e.target.checked)} />
        <Checkbox label="Sketch files" checked={sketch} onChange={e => setSketch(e.target.checked)} />
      </div>
      <Button style={{ width: '100%' }}>{'Show ' + count + ' results'}</Button>
    </div>
  );
}`),
    },
  ],

  props: {
    Slider: [
      ['label', 'string', '', 'Shown above the rail and used as the aria-label of the thumb. Range thumbs get “ minimum” and “ maximum” added.'],
      ['min', 'number', '0', 'Lowest value.'],
      ['max', 'number', '100', 'Highest value.'],
      ['step', 'number', '1', 'Size of each move (native default).'],
      ['range', 'boolean', 'false', 'Shows two thumbs. The value becomes [low, high].'],
      ['value', 'number | [number, number]', '', 'Controlled value. Pair with onChange.'],
      ['defaultValue', 'number | [number, number]', 'min, or [min, max]', 'Starting value when uncontrolled.'],
      ['onChange', '(value) => void', '', 'Called with the new number, or the new [low, high] pair, while dragging.'],
      ['format', '(value: number) => ReactNode', 'v => v', 'Formats the value shown on the right and the aria-valuetext of each thumb, e.g. v => "$" + v. Return a string so it reads well.'],
      ['className', 'string', '', 'Added to the wrapper.'],
    ],
  },

  usage: {
    when: [
      'To filter by a range where rough position is enough: price, rating, number of screens.',
      'To set a value people adjust by feel and see right away, such as a discount on a preview.',
    ],
    whenNot: [
      'To enter an exact value, like the price of your own listing. Use a Text field.',
      'To pick from a few named options. Use Radio buttons or Chips.',
      'For values with no natural order.',
    ],
    anatomy: {
      render: <div style={{ width: 300 }}><Slider label="Price" range min={0} max={200} step={5} defaultValue={[20, 120]} format={usd} /></div>,
      parts: [
        'Label: Inter Display SemiBold 14/20 in text-primary.',
        'Value: 500 14/20 with tabular-nums in text-secondary, right-aligned.',
        'Rail: size-track-sm tall, radius-full, bg-muted.',
        'Fill: action-primary-default between the thumbs (or from the start).',
        'Thumb: 24px circle (size-icon-lg) in control-knob with a 2px action-primary-default border and elevation-1. Grows to 1.15 with a spring while dragged.',
        'Focus: shadow-focus-ring on the thumb.',
      ],
    },
    sections: [
      {
        title: 'Show the unit',
        body: 'People read the number on the right, not the thumb position. Format it with its unit so it means something.',
        dos: [
          {
            do: <div style={w}><Slider label="Price" range min={0} max={200} step={5} defaultValue={[20, 120]} format={usd} /></div>,
            doText: 'Format the value with its unit: $20 – $120.',
            dont: <div style={w}><Slider label="Price" range min={0} max={200} step={5} defaultValue={[20, 120]} /></div>,
            dontText: 'Don’t show bare numbers. “20 – 120” could be dollars, downloads or screens.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={w}><Slider label="Price" range min={0} max={200} step={5} defaultValue={[45, 110]} format={usd} /></div>,
        doText: 'Use a step that lands on round values people think in.',
        dont: <div style={w}><Slider label="Price" range min={0} max={200} step={0.01} defaultValue={[47.83, 112.27]} format={usd} /></div>,
        dontText: 'Don’t allow cents on a filter. Nobody looks for items under $112.27.',
      },
      {
        do: <div style={w}><Slider label="Price" range min={0} max={200} step={5} defaultValue={[0, 80]} format={usd} /></div>,
        doText: 'Set min and max to the real spread of the catalog.',
        dont: <div style={w}><Slider label="Price" range min={0} max={10000} step={5} defaultValue={[0, 80]} format={usd} /></div>,
        dontText: 'Don’t stretch the rail for a few outliers. Every useful value is crammed into the first few pixels.',
      },
      {
        do: <div style={w}><TextField label="Your price" leadingIcon="dollar-01" inputMode="decimal" defaultValue="49" /></div>,
        doText: 'Use a Text field when the exact number matters, like the price of your listing.',
        dont: <div style={w}><Slider label="Your price" min={0} max={200} defaultValue={49} format={usd} /></div>,
        dontText: 'Don’t use a slider for exact values. Landing on $49 by dragging is fiddly, and on a phone it is nearly impossible.',
      },
    ],
    content: [
      'Labels are short nouns: “Price”, “Minimum rating”.',
      'Format values with units and currency: “$20 – $120”, “4.0 stars”, “20%”.',
      'Show the effect next to the slider when you can, such as the number of results.',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to the thumb. In a range, Tab moves from the low thumb to the high thumb.'],
      ['← / ↓', 'Decreases the value by one step.'],
      ['→ / ↑', 'Increases the value by one step.'],
      ['Page Up / Page Down', 'Moves by a larger step (browser default).'],
      ['Home / End', 'Jumps to min or max.'],
    ],
    notes: [
      'Built on native <input type="range">, so keyboard and screen readers work without extra code.',
      'Each thumb is named from label. In a range, they are “Price minimum” and “Price maximum”.',
      'Each thumb sets aria-valuetext from format, so screen readers hear “$40”, not “40”.',
      'The fill and thumb border use action-primary-default, 3:1 or more against the rail and surface.',
      'The thumb grows with a spring while dragged. Under prefers-reduced-motion, it only changes color.',
    ],
  },

  related: ['text-field', 'chip', 'radio'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'Thumbs set aria-valuetext from format, so screen readers hear the formatted value.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'Slider in React and HTML/CSS, matching the Figma component (single and range × default, hover, dragging, focus).' },
  ],
};
