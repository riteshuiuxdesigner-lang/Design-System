const w = (n) => ({ width: n || 300, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' });

export default {
  id: 'file-upload',
  name: 'File upload',
  group: 'Inputs',
  order: 8,
  status: 'Stable',
  figma: '21:139',
  exports: ['FileUpload', 'FileRow'],
  summary: 'A drop zone for adding source files and previews to a listing, plus a File row for each file that shows progress, success or an error with retry.',

  examples: [
    {
      title: 'Default',
      desc: 'The drop zone takes files dragged onto it or picked with Browse files. The rules line says which formats and sizes work.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%' }}>
  <FileUpload onFiles={files => console.log(files)} />
</div>`),
    },
    {
      title: 'Custom rules',
      desc: 'Change the title and rules for each use, and pass accept to limit what the file picker shows.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%' }}>
  <FileUpload
    title="Drop preview images here"
    body="PNG or JPG · 1600 × 1200 px or larger · up to 10 MB each"
    accept="image/png,image/jpeg"
  />
</div>`),
    },
    {
      title: 'Error',
      desc: 'An error replaces the title, turns the border red and swaps the icon. Say what is wrong with the file and how to fix it.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%' }}>
  <FileUpload error="Orbit-source.zip is over 2 GB. Compress it or split it into parts, then try again." />
</div>`),
    },
    {
      title: 'File rows',
      desc: 'Each file gets a row. Uploading shows a progress bar and a cancel button, complete shows a check and delete, and error keeps the file with a retry button.',
      ...ex(`
<div style={{ width: 440, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' }}>
  <FileRow name="Orbit-UI-kit-v2.fig" status="uploading" progress={64} meta="38 MB of 60 MB · 12 seconds left" />
  <FileRow name="Orbit-previews.zip" status="complete" meta="Uploaded · 24 MB" />
  <FileRow name="Orbit-source.sketch" status="error" meta="Upload failed. Check your connection and retry." />
</div>`),
    },
    {
      title: 'Upload flow',
      desc: 'Drop or browse some files to try it. onFiles gives you an array of File objects; add a row for each and update its progress.',
      ...ex(`function Example() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const t = setInterval(() => {
      setFiles(list => list.map(f => f.progress < 100 ? Object.assign({}, f, { progress: Math.min(100, f.progress + 20) }) : f));
    }, 500);
    return () => clearInterval(t);
  }, []);
  function add(list) {
    setFiles(prev => prev.concat(list.map(f => ({ name: f.name, size: f.size, progress: 0 }))));
  }
  function remove(name) {
    setFiles(prev => prev.filter(f => f.name !== name));
  }
  const mb = n => (n / 1048576).toFixed(1) + ' MB';
  return (
    <div style={{ width: 440, maxWidth: '100%', display: 'grid', gap: 'var(--space-sm)' }}>
      <FileUpload onFiles={add} />
      {files.map(f => (
        <FileRow
          key={f.name}
          name={f.name}
          status={f.progress < 100 ? 'uploading' : 'complete'}
          progress={f.progress}
          meta={f.progress < 100 ? f.progress + '% of ' + mb(f.size) : 'Uploaded · ' + mb(f.size)}
          onAction={() => remove(f.name)}
        />
      ))}
    </div>
  );
}`),
    },
    {
      title: 'In the listing editor',
      desc: 'The Files step of a new listing: what to upload, the drop zone, the files so far and the actions.',
      stage: 'muted',
      ...ex(`
<div style={{ width: 480, maxWidth: '100%', display: 'grid', gap: 'var(--space-md)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-surface)' }}>
  <div style={{ display: 'grid', gap: 'var(--space-2xs)' }}>
    <span style={{ font: '600 20px/28px var(--font-display)', color: 'var(--text-primary)' }}>Upload your files</span>
    <span style={{ font: '400 15px/22px var(--font-display)', color: 'var(--text-secondary)' }}>Buyers download exactly what you add here.</span>
  </div>
  <FileUpload />
  <FileRow name="Orbit-UI-kit-v2.fig" status="complete" meta="Uploaded · 60 MB" />
  <FileRow name="Orbit-icons.svg.zip" status="uploading" progress={30} meta="9 MB of 31 MB · 20 seconds left" />
  <ButtonGroup>
    <Button variant="secondary">Save draft</Button>
    <Button trailingIcon="arrow-right-01">Continue</Button>
  </ButtonGroup>
</div>`),
    },
  ],

  props: {
    FileUpload: [
      ['onFiles', '(files: File[]) => void', '', 'Called with the files that were dropped or picked. Multiple files are always allowed.'],
      ['accept', 'string', '', 'Limits what the file picker shows, e.g. "image/png,image/jpeg" or ".fig,.zip". Dropped files are not filtered, so check them in onFiles.'],
      ['title', 'string', "'Drop your files here'", 'Main line inside the zone.'],
      ['body', 'string', "'or browse · .fig, .sketch, .zip, .pdf up to 2 GB'", 'The rules: formats, sizes and limits.'],
      ['error', 'string', '', 'Replaces the title with the message, turns the border red and swaps the icon to alert-circle.'],
      ['className', 'string', '', 'Added to the drop zone.'],
    ],
    FileRow: [
      ['name', 'string', '', 'File name. Long names are cut with an ellipsis.'],
      ['status', "'uploading' | 'complete' | 'error'", "'uploading'", 'Sets the meta color, icon and the action button.'],
      ['progress', 'number', '0', '0–100. Shown as a progress bar while uploading.'],
      ['meta', 'ReactNode', '', 'Line under the name: size and time left, “Uploaded · 24 MB” or what went wrong.'],
      ['onAction', '() => void', '', 'Called by the action button: cancel, delete or retry, depending on status. Its label includes the file name.'],
      ['className', 'string', '', 'Added to the row.'],
    ],
  },

  usage: {
    when: [
      'To add source files, previews and fonts to a listing.',
      'To attach files to a support ticket or a refund request.',
    ],
    whenNot: [
      'For a single profile photo. Use an Avatar with an Edit button that opens the file picker.',
      'To import data that needs mapping, like a CSV of listings. Use a dedicated import flow.',
    ],
    anatomy: {
      render: <div style={w(360)}><FileUpload /><FileRow name="Orbit-UI-kit-v2.fig" status="uploading" progress={64} meta="38 MB of 60 MB · 12 seconds left" /></div>,
      parts: [
        'Drop zone: 2px dashed border-strong, radius-xl, bg-surface, padded space-2xl by space-xl.',
        'Icon sticker: 48px pop-yellow circle tilted -6°, with cloud-upload in icon-on-pop.',
        'Title: Inter Display SemiBold 16/24 in text-primary. Rules: 400 14/20 in text-muted.',
        'Browse files: a Small Secondary Button that opens the native file picker.',
        'Drag state: border turns focus-ring, the fill turns bg-subtle and the zone grows to 1.01 with a spring.',
        'File row: radius-lg, 1px border-default, a 40px file icon tile, the name (600 15/20), a progress bar or meta, and a Small Icon button.',
      ],
    },
    sections: [
      {
        title: 'Say the rules up front',
        body: 'People should know what will be accepted before they look for a file. Put formats and the size limit in the rules line.',
        dos: [
          {
            do: <div style={w()}><FileUpload title="Drop preview images here" body="PNG or JPG · 1600 × 1200 px or larger · up to 10 MB" /></div>,
            doText: 'List formats, minimum size and maximum file size.',
            dont: <div style={w()}><FileUpload title="Upload" body="Select files to upload" /></div>,
            dontText: 'Don’t leave out the rules. People find out by failing, one file at a time.',
          },
        ],
      },
    ],
    dos: [
      {
        do: <div style={w()}><FileUpload error="Orbit-source.zip is over 2 GB. Compress it or split it into parts." /></div>,
        doText: 'Name the file, the problem and the fix.',
        dont: <div style={w()}><FileUpload error="Upload error" /></div>,
        dontText: 'Don’t show a generic error. People can’t tell which file failed or what to change.',
      },
      {
        do: <div style={w()}><FileRow name="Orbit-UI-kit-v2.fig" status="uploading" progress={64} meta="38 MB of 60 MB · 12 seconds left" /><FileRow name="Orbit-icons.zip" status="uploading" progress={20} meta="4 MB of 20 MB · 30 seconds left" /></div>,
        doText: 'Show progress for each file, with time left for large ones.',
        dont: <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', font: '500 14px/20px var(--font-display)', color: 'var(--text-secondary)' }}><Spinner />Uploading 2 files…</div>,
        dontText: 'Don’t show a lone spinner for big uploads. People can’t tell if it is stuck or almost done.',
      },
      {
        do: <div style={w()}><FileRow name="Orbit-source.sketch" status="error" meta="Upload failed. Check your connection and retry." /></div>,
        doText: 'Keep a failed file in the list with a Retry button.',
        dont: <Toast variant="error" message="Something went wrong" />,
        dontText: 'Don’t report a failed upload only in a Toast. It disappears, and the file is gone from the list.',
      },
    ],
    content: [
      'Title: say what to drop, “Drop preview images here”. Keep “or browse” in the rules line.',
      'Rules list formats, then size: “PNG or JPG · 1600 × 1200 px or larger · up to 10 MB each”.',
      'Progress meta: “38 MB of 60 MB · 12 seconds left”. Complete: “Uploaded · 24 MB”.',
      'Errors name the file and the fix: “Orbit-source.zip is over 2 GB. Compress it or split it into parts.”',
    ],
  },

  a11y: {
    keyboard: [
      ['Tab', 'Moves focus to Browse files, then to each File row action.'],
      ['Enter / Space', 'On Browse files, opens the system file picker. On a row action, cancels, deletes or retries.'],
    ],
    notes: [
      'Dragging is mouse and touch only. Browse files is the keyboard and screen reader path, and it opens the native file input.',
      'Row actions are Icon buttons that name the file: “Cancel upload of Orbit-UI-kit-v2.fig”, “Delete Orbit-previews.zip”, “Retry upload of Orbit-source.sketch”.',
      'The progress bar uses role="progressbar" with aria-valuenow and is labelled “Uploading {name}”.',
      'The drop zone has no live region. Announce finished or failed uploads with a Toast, and keep failures in the list.',
      'Complete and error states pair color with an icon and text. The drop zone’s spring scale is off under prefers-reduced-motion.',
    ],
  },

  related: ['progress-bar', 'button', 'toast'],

  changelog: [
    { v: '1.0.1', date: '2026-10-10', type: 'Fixed', notes: 'File row action buttons and the progress bar now include the file name in their labels.' },
    { v: '1.0.0', date: '2026-10-10', type: 'Added', notes: 'File upload and File row in React and HTML/CSS, matching the Figma components (drop zone default, drag, error; row uploading, complete, error).' },
  ],
};
