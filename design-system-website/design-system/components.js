  var R = window.React, h = R.createElement;
  function cx() { var out = []; for (var i = 0; i < arguments.length; i++) { if (arguments[i]) out.push(arguments[i]); } return out.join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) { if (keys.indexOf(k) < 0) r[k] = o[k]; } return r; }

  /** Icon — Hugeicons Pro, Stroke·Rounded by default; Twotone·Rounded for highlights. Inherits currentColor. */
  function Icon(p) {
    var set = p.variant === 'twotone' ? ICONS.twotone : ICONS.stroke;
    var body = set[p.name] || set['help-circle'];
    var size = p.size || 20;
    return h('svg', { className: cx('mds-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      'data-icon': p.name, role: p.label ? 'img' : undefined, 'aria-label': p.label, 'aria-hidden': p.label ? undefined : 'true',
      style: Object.assign({}, p.style, p.color ? { color: p.color } : null), dangerouslySetInnerHTML: { __html: body } });
  }
  Icon.names = Object.keys(ICONS.stroke);

  var ICON_SIZE = { sm: 16, md: 20, lg: 20 };

  /** Button — pill action. One primary per view. */
  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'loading', 'leadingIcon', 'trailingIcon', 'children', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('mds-btn', 'mds-btn--' + variant, size !== 'md' && 'mds-btn--' + size, p.className),
      'aria-busy': p.loading ? 'true' : undefined }),
      p.loading ? h('span', { className: 'mds-spinner', 'aria-hidden': 'true' })
        : p.leadingIcon ? h(Icon, { name: p.leadingIcon, size: ICON_SIZE[size] }) : null,
      p.children,
      !p.loading && p.trailingIcon ? h(Icon, { name: p.trailingIcon, size: ICON_SIZE[size] }) : null);
  }

  /** IconButton — icon-only pill/circle. Always pass a label. */
  function IconButton(p) {
    var variant = p.variant || 'ghost', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'icon', 'label', 'selected', 'loading', 'className']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('mds-btn', 'mds-btn--icon', 'mds-btn--' + variant, size !== 'md' && 'mds-btn--' + size, p.selected && 'mds-btn--selected', p.className),
      'aria-label': p.label, title: 'title' in p ? p.title : p.label, 'aria-pressed': p.selected === undefined ? undefined : String(!!p.selected), 'aria-busy': p.loading ? 'true' : undefined, disabled: p.disabled || p.loading }),
      p.loading ? h('span', { className: 'mds-spinner', 'aria-hidden': 'true' }) : h(Icon, { name: p.icon, size: size === 'lg' ? 24 : ICON_SIZE[size] }));
  }

  /** Badge — non-interactive status or sticker label. */
  function Badge(p) {
    var rest = omit(p, ['variant', 'icon', 'children', 'className']);
    return h('span', Object.assign({}, rest, { className: cx('mds-badge', 'mds-badge--' + (p.variant || 'neutral'), p.className) }),
      p.icon ? h(Icon, { name: p.icon, size: 16 }) : null, p.children);
  }

  /** Chip — filter toggle with an optional pop-color dot. */
  function Chip(p) {
    var rest = omit(p, ['selected', 'dot', 'removable', 'onRemove', 'children', 'className']);
    var dot = p.dot ? h('span', { className: 'mds-chip__dot', style: { background: 'var(--' + p.dot + ')' } }) : null;
    if (p.removable) return h('span', Object.assign({}, omit(rest, ['onClick', 'type']), { className: cx('mds-chip', 'mds-chip--removable', p.className) }), dot, p.children,
      h('button', { type: 'button', className: 'mds-chip__remove', 'aria-label': 'Remove ' + (typeof p.children === 'string' ? p.children : 'filter'), onClick: function () { if (p.onRemove) p.onRemove(); } }, h(Icon, { name: 'cancel-01', size: 16 })));
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('mds-chip', p.className), 'aria-pressed': String(!!p.selected) }),
      dot, p.children);
  }

  var uid = 0;
  /** TextField — label + pill input + helper/error. */
  function TextField(p) {
    var idRef = R.useRef(null); if (!idRef.current) idRef.current = p.id || 'mds-tf-' + (++uid);
    var id = idRef.current, size = p.size || 'md', helpId = id + '-help';
    var rest = omit(p, ['label', 'required', 'optional', 'helper', 'error', 'size', 'leadingIcon', 'trailingIcon', 'className', 'id']);
    var message = p.error || p.helper;
    return h('div', { className: cx('mds-field', p.className) },
      p.label ? h('label', { className: 'mds-field__label', htmlFor: id }, p.label,
        p.required ? h('span', { className: 'mds-field__req', 'aria-hidden': 'true' }, '*') : null,
        p.optional ? h('span', { className: 'mds-field__opt' }, '(optional)') : null) : null,
      h('div', { className: cx('mds-input', size !== 'md' && 'mds-input--' + size, p.error && 'mds-input--error', p.disabled && 'mds-input--disabled') },
        p.leadingIcon ? h(Icon, { name: p.leadingIcon, size: size === 'sm' ? 16 : 20 }) : null,
        h('input', Object.assign({}, rest, { id: id, 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': message ? helpId : undefined, required: p.required })),
        p.trailingIcon ? h(Icon, { name: p.trailingIcon, size: size === 'sm' ? 16 : 20 }) : null),
      message ? h('div', { id: helpId, className: cx('mds-field__helper', p.error && 'mds-field__helper--error') },
        p.error ? h(Icon, { name: 'alert-circle', size: 16 }) : null, message) : null);
  }

  /** Checkbox — 20px box, 44px row. */
  function Checkbox(p) {
    var rest = omit(p, ['label', 'indeterminate', 'className']), ref = R.useRef(null);
    R.useEffect(function () { if (ref.current) ref.current.indeterminate = !!p.indeterminate; }, [p.indeterminate]);
    return h('label', { className: cx('mds-check', p.disabled && 'mds-check--disabled', p.className) },
      h('input', Object.assign({ type: 'checkbox' }, rest, { ref: ref })),
      h('span', { className: cx('mds-check__box', p.indeterminate && 'mds-check__box--mixed'), 'aria-hidden': 'true' },
        h(Icon, { name: p.indeterminate ? 'minus-sign' : 'tick-02', size: 14, className: 'mds-check__mark' })),
      p.label);
  }

  /** Switch — applies a setting immediately. */
  function Switch(p) {
    var rest = omit(p, ['label', 'className']);
    return h('label', { className: cx('mds-check', p.disabled && 'mds-check--disabled', p.className) },
      h('input', Object.assign({ type: 'checkbox', role: 'switch' }, rest)),
      h('span', { className: 'mds-switch__track', 'aria-hidden': 'true' }, h('span', { className: 'mds-switch__knob' })),
      p.label);
  }

  /** Avatar — initials on a pop color, or an image. */
  function Avatar(p) {
    var size = p.size || 'md', color = p.color || 'pop-orange';
    return h('span', { className: cx('mds-avatar', 'mds-avatar--' + size, p.className), style: { background: p.src ? 'var(--bg-muted)' : 'var(--' + color + ')' }, 'aria-label': p.name, role: p.name ? 'img' : undefined },
      p.src ? h('img', { src: p.src, alt: '', style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' } }) : p.initials,
      p.status ? h('span', { className: 'mds-avatar__status' }) : null);
  }

  /** PriceTag — paid, free or sale price with tabular figures. */
  function PriceTag(p) {
    var free = p.free || p.price === 'Free';
    return h('span', { className: cx('mds-price', p.size === 'md' && 'mds-price--md', free && 'mds-price--free', p.className) },
      h('span', { className: cx(p.was && 'mds-price__now--sale') }, free ? 'Free' : p.price),
      p.was ? h('span', { className: 'mds-price__was' }, h('span', { className: 'mds-sr' }, 'was '), p.was) : null);
  }

  var ALERT_ICON = { info: 'information-circle', success: 'checkmark-circle-02', warning: 'alert-02', error: 'alert-circle' };
  /** Alert — inline message with icon, title, body, optional action and dismiss. */
  function Alert(p) {
    var v = p.variant || 'info';
    return h('div', { className: cx('mds-alert', 'mds-alert--' + v, p.className), role: v === 'error' ? 'alert' : 'status' },
      h(Icon, { name: ALERT_ICON[v], size: 20 }),
      h('div', null, p.title ? h('div', { className: 'mds-alert__title' }, p.title) : null,
        h('div', { className: 'mds-alert__body' }, p.children), p.action || null),
      p.onDismiss ? h('button', { className: 'mds-alert__close', type: 'button', 'aria-label': 'Dismiss', onClick: p.onDismiss }, h(Icon, { name: 'cancel-01', size: 20 })) : h('span'));
  }

  /** Tabs — segmented pill tabs. Controlled (value + onChange) or uncontrolled. */
  function Tabs(p) {
    var st = R.useState(p.defaultValue || (p.items[0] && p.items[0].value)), value = p.value !== undefined ? p.value : st[0];
    function pick(v) { if (p.value === undefined) st[1](v); if (p.onChange) p.onChange(v); }
    var rest = omit(p, ['items', 'value', 'defaultValue', 'onChange', 'label', 'className']);
    function key(e) {
      var on = p.items.filter(function (it) { return !it.disabled; }), i = on.findIndex(function (it) { return it.value === value; }), n = null;
      if (e.key === 'ArrowRight') n = on[(i + 1) % on.length]; if (e.key === 'ArrowLeft') n = on[(i - 1 + on.length) % on.length];
      if (e.key === 'Home') n = on[0]; if (e.key === 'End') n = on[on.length - 1];
      if (n) { e.preventDefault(); pick(n.value); var b = e.currentTarget.querySelector('[data-value="' + n.value + '"]'); if (b) b.focus(); }
    }
    return h('div', Object.assign({}, rest, { className: cx('mds-tabs', p.className), role: 'tablist', 'aria-label': p.label, onKeyDown: key }),
      p.items.map(function (it) {
        return h('button', { key: it.value, type: 'button', role: 'tab', className: 'mds-tab', 'data-value': it.value, disabled: it.disabled, tabIndex: it.value === value ? 0 : -1, 'aria-selected': String(it.value === value), 'aria-controls': it.controls, onClick: function () { pick(it.value); } },
          it.label, it.count !== undefined ? h('span', { className: 'mds-tab__count' }, it.count) : null);
      }));
  }

  /** AssetCard — marketplace listing card. */
  function AssetCard(p) {
    var st = R.useState(!!p.saved), saved = p.onSave ? !!p.saved : st[0];
    var rest = omit(p, ['title', 'creator', 'initials', 'avatarColor', 'price', 'was', 'badge', 'badgeVariant', 'image', 'thumbColor', 'saved', 'onSave', 'href', 'onOpen', 'className']);
    return h('article', Object.assign({}, rest, { className: cx('mds-card', (p.href || p.onOpen) && 'mds-card--link', p.className) }),
      h('div', { className: 'mds-card__thumb', style: p.thumbColor ? { background: 'var(--' + p.thumbColor + ')' } : undefined },
        p.image ? h('img', { src: p.image, alt: '' }) : h(Icon, { name: 'image-01', size: 24 }),
        p.badge ? h(Badge, { className: 'mds-card__badge', variant: p.badgeVariant || 'yellow' }, p.badge) : null,
        h(IconButton, { className: 'mds-card__save', variant: 'secondary', size: 'sm', icon: 'favourite', label: saved ? 'Remove from saved' : 'Save ' + p.title, selected: saved,
          onClick: function () { if (p.onSave) p.onSave(!saved); else st[1](!saved); } })),
      h('div', { className: 'mds-card__meta' },
        h('div', { style: { minWidth: 0 } },
          h('h3', { className: 'mds-card__title' }, (p.href || p.onOpen) ? h('a', { className: 'mds-card__link', href: p.href || '#', onClick: p.onOpen ? function (e) { if (!p.href) e.preventDefault(); p.onOpen(e); } : undefined }, p.title) : p.title),
          h('div', { className: 'mds-card__by' }, h(Avatar, { size: 'xs', initials: p.initials, color: p.avatarColor || 'pop-yellow' }), p.creator)),
        h(PriceTag, { price: p.price, was: p.was })));
  }

  /** Divider — 1px hairline in border-subtle; horizontal or vertical. */
  function Divider(p) {
    var rest = omit(p, ['vertical', 'className']);
    return h('hr', Object.assign({}, rest, { className: cx('mds-divider', p.vertical && 'mds-divider--v', p.className), 'aria-orientation': p.vertical ? 'vertical' : undefined }));
  }

  /** Spinner — indeterminate loader for short waits. */
  function Spinner(p) {
    var size = { sm: 16, md: 20, lg: 24 }[p.size || 'md'];
    return h('span', { className: cx('mds-spinner', p.className), role: 'status', 'aria-label': p.label || 'Loading', style: { width: size, height: size, color: p.tone === 'inverse' ? 'var(--icon-inverse)' : p.tone === 'on-action' ? 'var(--icon-on-action)' : 'var(--icon-secondary)' } });
  }

  /** Link — inline or standalone text link; Subtle for dense UI; External adds an icon. */
  function Link(p) {
    var rest = omit(p, ['subtle', 'external', 'children', 'className']);
    return h('a', Object.assign({}, rest, { className: cx('mds-link', p.subtle && 'mds-link--subtle', p.className), target: p.external ? '_blank' : p.target, rel: p.external ? 'noopener noreferrer' : p.rel }),
      p.children, p.external ? h(Icon, { name: 'link-square-02', size: 16 }) : null, p.external ? h('span', { className: 'mds-sr' }, ' (opens in a new tab)') : null);
  }

  /** ButtonGroup — 2–3 related actions; Primary last: right on desktop, bottom when stacked. */
  function ButtonGroup(p) {
    return h('div', { className: cx('mds-btn-group', p.stacked && 'mds-btn-group--stacked', p.className), role: 'group', 'aria-label': p.label }, p.children);
  }

  function Field(p) {
    return h('div', { className: cx('mds-field', p.className) },
      p.label ? h('label', { className: 'mds-field__label', htmlFor: p.id }, p.label,
        p.required ? h('span', { className: 'mds-field__req', 'aria-hidden': 'true' }, '*') : null,
        p.optional ? h('span', { className: 'mds-field__opt' }, '(optional)') : null) : null,
      p.children,
      (p.error || p.helper) ? h('div', { id: p.id + '-help', className: cx('mds-field__helper', p.error && 'mds-field__helper--error') },
        p.error ? h(Icon, { name: 'alert-circle', size: 16 }) : null, p.error || p.helper) : null);
  }
  function useId(given, prefix) { var r = R.useRef(null); if (!r.current) r.current = given || ('mds-' + prefix + '-' + (++uid)); return r.current; }

  /** Select — native select styled as a pill trigger with a chevron. */
  function Select(p) {
    var id = useId(p.id, 'sel'), size = p.size || 'md';
    var rest = omit(p, ['label', 'options', 'placeholder', 'helper', 'error', 'size', 'required', 'optional', 'className', 'id', 'leadingIcon']);
    return h(Field, { id: id, label: p.label, helper: p.helper, error: p.error, required: p.required, optional: p.optional, className: p.className },
      h('div', { className: cx('mds-input', 'mds-select', size !== 'md' && 'mds-input--' + size, p.error && 'mds-input--error', p.disabled && 'mds-input--disabled') },
        p.leadingIcon ? h(Icon, { name: p.leadingIcon, size: size === 'sm' ? 16 : 20 }) : null,
        h('select', Object.assign(p.placeholder && p.value === undefined && p.defaultValue === undefined ? { defaultValue: '' } : {}, rest, { id: id, required: p.required, 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': (p.error || p.helper) ? id + '-help' : undefined }),
          p.placeholder ? h('option', { value: '', disabled: true }, p.placeholder) : null,
          (p.options || []).map(function (o) { var v = typeof o === 'string' ? o : o.value; return h('option', { key: v, value: v }, typeof o === 'string' ? o : o.label); })),
        h(Icon, { name: 'arrow-down-01', size: size === 'sm' ? 16 : 20, className: 'mds-select__chev' })));
  }

  /** SearchField — muted pill search with ⌘K hint and a clear button. */
  function SearchField(p) {
    var st = R.useState(p.defaultValue || ''), controlled = p.value !== undefined, value = controlled ? p.value : st[0];
    function set(v) { if (!controlled) st[1](v); if (p.onChange) p.onChange(v); }
    return h('form', { role: 'search', className: cx('mds-search', p.size === 'lg' && 'mds-input--lg', p.className), onSubmit: function (e) { e.preventDefault(); if (p.onSubmit) p.onSubmit(value); } },
      h(Icon, { name: 'search-01', size: 20 }),
      h('input', { type: 'search', 'aria-label': p.label || 'Search', placeholder: p.placeholder || 'Search', value: value, onChange: function (e) { set(e.target.value); } }),
      value ? h('button', { type: 'button', className: 'mds-search__clear', 'aria-label': 'Clear search', onClick: function () { set(''); } }, h(Icon, { name: 'cancel-01', size: 20 }))
        : (p.shortcut !== false ? h('kbd', { className: 'mds-kbd' }, '⌘K') : null));
  }

  /** Textarea — multi-line input with optional character count. */
  function Textarea(p) {
    var id = useId(p.id, 'ta'), st = R.useState(p.defaultValue || ''), controlled = p.value !== undefined, value = controlled ? p.value : st[0];
    var rest = omit(p, ['label', 'helper', 'error', 'required', 'optional', 'className', 'id', 'value', 'defaultValue', 'onChange']);
    return h(Field, { id: id, label: p.label, helper: p.helper, error: p.error, required: p.required, optional: p.optional, className: p.className },
      h('div', { className: cx('mds-input', 'mds-textarea', p.error && 'mds-input--error', p.disabled && 'mds-input--disabled') },
        h('textarea', Object.assign({ rows: 4 }, rest, { id: id, value: value, required: p.required, 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': [(p.error || p.helper) ? id + '-help' : '', p.maxLength ? id + '-count' : ''].join(' ').trim() || undefined,
          onChange: function (e) { if (!controlled) st[1](e.target.value); if (p.onChange) p.onChange(e); } })),
        p.maxLength ? h('span', { id: id + '-count', className: cx('mds-textarea__count', p.error && 'mds-field__helper--error') }, value.length + ' / ' + p.maxLength) : null));
  }

  /** Radio — one choice from a short list; group with a fieldset + legend. */
  function Radio(p) {
    var rest = omit(p, ['label', 'className']);
    return h('label', { className: cx('mds-check', p.disabled && 'mds-check--disabled', p.className) },
      h('input', Object.assign({ type: 'radio' }, rest)),
      h('span', { className: 'mds-check__box mds-radio', 'aria-hidden': 'true' }, h('span', { className: 'mds-radio__dot' })),
      p.label);
  }

  /** LicenseSelector — radio cards with title, description and price. */
  function LicenseSelector(p) {
    var name = useId(p.name, 'lic'), st = R.useState(p.defaultValue || (p.options[0] && p.options[0].value)), value = p.value !== undefined ? p.value : st[0];
    return h('fieldset', { className: cx('mds-license', p.className) },
      p.legend ? h('legend', { className: 'mds-field__label' }, p.legend) : null,
      p.options.map(function (o) {
        var on = o.value === value;
        return h('label', { key: o.value, className: cx('mds-radio-card', on && 'mds-radio-card--on', o.disabled && 'mds-check--disabled') },
          h('input', { type: 'radio', name: name, value: o.value, checked: on, disabled: o.disabled, onChange: function () { if (p.value === undefined) st[1](o.value); if (p.onChange) p.onChange(o.value); } }),
          h('span', { className: 'mds-check__box mds-radio', 'aria-hidden': 'true' }, h('span', { className: 'mds-radio__dot' })),
          h('span', { className: 'mds-radio-card__body' }, h('span', { className: 'mds-radio-card__title' }, o.title), h('span', { className: 'mds-radio-card__desc' }, o.description)),
          h('span', { className: 'mds-radio-card__price' }, o.price));
      }));
  }

  /** FileUpload — dashed drop zone with icon sticker, title, rules and Browse. */
  function FileUpload(p) {
    var st = R.useState(false), drag = st[0], inputRef = R.useRef(null);
    function files(list) { if (p.onFiles) p.onFiles(Array.prototype.slice.call(list)); }
    return h('div', { className: cx('mds-dropzone', drag && 'mds-dropzone--drag', p.error && 'mds-dropzone--error', p.className),
      onDragOver: function (e) { e.preventDefault(); st[1](true); }, onDragLeave: function () { st[1](false); },
      onDrop: function (e) { e.preventDefault(); st[1](false); files(e.dataTransfer.files); } },
      h('span', { className: 'mds-dropzone__icon' }, h(Icon, { name: p.error ? 'alert-circle' : 'cloud-upload', size: 24 })),
      h('div', { className: 'mds-dropzone__title' }, p.error ? p.error : (p.title || 'Drop your files here')),
      h('div', { className: 'mds-dropzone__body' }, p.body || 'or browse · .fig, .sketch, .zip, .pdf up to 2 GB'),
      h('input', { ref: inputRef, type: 'file', multiple: true, accept: p.accept, hidden: true, onChange: function (e) { files(e.target.files); } }),
      h(Button, { variant: 'secondary', size: 'sm', onClick: function () { inputRef.current.click(); } }, 'Browse files'));
  }

  /** FileRow — one uploaded file: uploading (progress), complete or error (with retry). */
  function FileRow(p) {
    var status = p.status || 'uploading';
    return h('div', { className: cx('mds-file-row', status === 'error' && 'mds-file-row--error', p.className) },
      h('span', { className: 'mds-file-row__icon' }, h(Icon, { name: 'file-01', size: 20 })),
      h('div', { className: 'mds-file-row__body' },
        h('div', { className: 'mds-file-row__name' }, p.name),
        status === 'uploading' ? h(ProgressBar, { value: p.progress || 0, showLabel: false, label: 'Uploading ' + p.name }) : null,
        h('div', { className: cx('mds-file-row__meta', 'mds-file-row__meta--' + status) },
          status !== 'uploading' ? h(Icon, { name: status === 'complete' ? 'checkmark-circle-02' : 'alert-circle', size: 16 }) : null, p.meta)),
      h(IconButton, { size: 'sm', label: (status === 'uploading' ? 'Cancel upload of ' : status === 'complete' ? 'Delete ' : 'Retry upload of ') + p.name, icon: status === 'uploading' ? 'cancel-01' : status === 'complete' ? 'delete-02' : 'refresh', onClick: p.onAction }));
  }

  /** ProgressBar — determinate progress with label and percentage. */
  function ProgressBar(p) {
    var v = Math.max(0, Math.min(100, p.value || 0));
    return h('div', { className: cx('mds-progress', p.className) },
      p.showLabel !== false ? h('div', { className: 'mds-progress__row' }, h('span', null, p.label), h('span', { className: 'mds-progress__pct' }, Math.round(v) + '%')) : null,
      h('div', { className: 'mds-progress__track', role: 'progressbar', 'aria-valuenow': v, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': p.label || 'Progress' },
        h('div', { className: cx('mds-progress__fill', p.tone === 'success' && 'mds-progress__fill--success'), style: { width: v + '%' } })));
  }

  /** Slider — single value or price range on native range inputs. */
  function Slider(p) {
    var min = p.min || 0, max = p.max === undefined ? 100 : p.max, fmt = p.format || function (v) { return v; };
    var st = R.useState(p.defaultValue !== undefined ? p.defaultValue : (p.range ? [min, max] : min)), value = p.value !== undefined ? p.value : st[0];
    function set(v) { if (p.value === undefined) st[1](v); if (p.onChange) p.onChange(v); }
    var lo = p.range ? value[0] : min, hi = p.range ? value[1] : value;
    var pct = function (v) { return ((v - min) / (max - min)) * 100; };
    return h('div', { className: cx('mds-slider', p.className) },
      h('div', { className: 'mds-progress__row' }, h('span', { className: 'mds-field__label', style: { padding: 0 } }, p.label), h('span', { className: 'mds-progress__pct' }, p.range ? fmt(lo) + ' – ' + fmt(hi) : fmt(hi))),
      h('div', { className: 'mds-slider__rail' },
        h('div', { className: 'mds-slider__fill', style: { left: (p.range ? pct(lo) : 0) + '%', width: (pct(hi) - (p.range ? pct(lo) : 0)) + '%' } }),
        p.range ? h('input', { type: 'range', min: min, max: max, step: p.step, value: lo, 'aria-valuetext': String(fmt(lo)), 'aria-label': (p.label || 'Value') + ' minimum', onChange: function (e) { set([Math.min(+e.target.value, hi), hi]); } }) : null,
        h('input', { type: 'range', min: min, max: max, step: p.step, value: hi, 'aria-valuetext': String(fmt(hi)), 'aria-label': p.range ? (p.label || 'Value') + ' maximum' : p.label, onChange: function (e) { set(p.range ? [lo, Math.max(+e.target.value, lo)] : +e.target.value); } })));
  }

  /** OtpInput — six-digit code; auto-advance, paste fills all. */
  function OtpInput(p) {
    var len = p.length || 6, st = R.useState(p.defaultValue || ''), value = p.value !== undefined ? p.value : st[0], refs = R.useRef([]);
    function set(v) { v = v.replace(/\D/g, '').slice(0, len); if (p.value === undefined) st[1](v); if (p.onChange) p.onChange(v); if (v.length === len && p.onComplete) p.onComplete(v); }
    var cells = [];
    for (var i = 0; i < len; i++) (function (i) {
      cells.push(h('input', { key: i, ref: function (el) { refs.current[i] = el; }, className: cx('mds-otp__cell', p.error && 'mds-otp__cell--error'), inputMode: 'numeric', autoComplete: i === 0 ? 'one-time-code' : 'off', maxLength: len, 'aria-label': 'Digit ' + (i + 1) + ' of ' + len, value: value[i] || '', disabled: p.disabled,
        'aria-invalid': p.error ? 'true' : undefined, onFocus: function (e) { e.target.select(); },
        onChange: function (e) { var d = e.target.value.replace(/\D/g, ''); if (!d) return; if (value[i] && d.length === 2) d = d[0] === value[i] ? d[1] : d[0]; var nv = (value.slice(0, i) + d + value.slice(i + d.length)).slice(0, len); set(nv); var n = Math.min(i + d.length, len - 1); if (refs.current[n]) refs.current[n].focus(); },
        onKeyDown: function (e) { if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); refs.current[i - 1].focus(); } if (e.key === 'ArrowRight' && i < len - 1) { e.preventDefault(); refs.current[i + 1].focus(); } if (e.key === 'Backspace') { e.preventDefault(); set(value.slice(0, i) + value.slice(i + 1)); if (i > 0 && refs.current[i - 1]) refs.current[i - 1].focus(); } } }));
    })(i);
    var gid = useId(p.id, 'otp');
    return h('div', { className: cx('mds-field', p.className) },
      p.label ? h('div', { id: gid + '-label', className: 'mds-field__label' }, p.label) : null,
      h('div', { className: 'mds-otp', role: 'group', 'aria-labelledby': p.label ? gid + '-label' : undefined, 'aria-label': p.label ? undefined : 'Verification code', 'aria-describedby': p.error ? gid + '-help' : undefined }, cells),
      p.error ? h('div', { id: gid + '-help', className: 'mds-field__helper mds-field__helper--error' }, h(Icon, { name: 'alert-circle', size: 16 }), p.error) : null);
  }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  /** Calendar — month grid; single date or range; keyboard-friendly buttons. */
  function Calendar(p) {
    var init = p.value || new Date(), st = R.useState(new Date(init.getFullYear(), init.getMonth(), 1)), month = st[0];
    R.useEffect(function () { if (p.value) st[1](new Date(p.value.getFullYear(), p.value.getMonth(), 1)); }, [p.value && p.value.getTime()]);
    var first = month.getDay(), start = new Date(month.getFullYear(), month.getMonth(), 1 - first), today = new Date(), days = [];
    for (var i = 0; i < 42; i++) days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    function shift(n) { st[1](new Date(month.getFullYear(), month.getMonth() + n, 1)); }
    return h('div', { className: cx('mds-calendar', p.className) },
      h('div', { className: 'mds-calendar__head' },
        h(IconButton, { size: 'sm', icon: 'arrow-left-01', label: 'Previous month', onClick: function () { shift(-1); } }),
        h('span', { className: 'mds-calendar__month' }, MONTHS[month.getMonth()] + ' ' + month.getFullYear()),
        h(IconButton, { size: 'sm', icon: 'arrow-right-01', label: 'Next month', onClick: function () { shift(1); } })),
      h('div', { className: 'mds-calendar__grid', role: 'grid' },
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(function (d) { return h('span', { key: d, className: 'mds-calendar__wd' }, d); }),
        days.map(function (d) {
          var out = d.getMonth() !== month.getMonth(), dis = p.isDisabled && p.isDisabled(d);
          var sel = sameDay(d, p.value) || sameDay(d, p.rangeEnd), inRange = p.rangeEnd && p.value && d > p.value && d < p.rangeEnd;
          return h('button', { key: d.toISOString(), type: 'button', disabled: dis, className: cx('mds-day', out && 'mds-day--out', sel && 'mds-day--sel', inRange && 'mds-day--range', sameDay(d, today) && 'mds-day--today'),
            'aria-pressed': sel ? 'true' : undefined, 'aria-label': d.toDateString(), onClick: function () { if (p.onChange) p.onChange(d); } }, d.getDate());
        })));
  }

  /** DatePicker — read-only Text Field that opens a calendar popover; Esc or focus leaving closes it. */
  function DatePicker(p) {
    var st = R.useState(false), open = st[0], ref = R.useRef(null);
    R.useEffect(function () { function off(e) { if (ref.current && !ref.current.contains(e.target)) st[1](false); } function key(e) { if (e.key === 'Escape') st[1](false); } document.addEventListener('mousedown', off); document.addEventListener('focusin', off); document.addEventListener('keydown', key); return function () { document.removeEventListener('mousedown', off); document.removeEventListener('focusin', off); document.removeEventListener('keydown', key); }; }, []);
    var label = p.value ? p.value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    return h('div', { ref: ref, className: cx('mds-pop-anchor', 'mds-datepicker', p.className) },
      h(TextField, { id: p.id, name: p.name, error: p.error, required: p.required, label: p.label, leadingIcon: 'calendar-03', placeholder: p.placeholder || 'Choose a date', value: label, readOnly: true, 'aria-haspopup': 'dialog', 'aria-expanded': String(open), onFocus: function () { st[1](true); }, onClick: function () { st[1](true); }, helper: p.helper }),
      open ? h('div', { className: 'mds-popover-panel mds-popover-panel--below' }, h(Calendar, { value: p.value, isDisabled: p.isDisabled, onChange: function (d) { if (p.onChange) p.onChange(d); st[1](false); } })) : null);
  }

  /** AvatarGroup — up to 4 overlapping avatars plus a count. */
  function AvatarGroup(p) {
    var max = p.max || 4, people = p.people || [], extra = people.length - max;
    return h('div', { className: cx('mds-avatar-group', p.className), role: 'group', 'aria-label': p.label || (people.length + ' people') },
      people.slice(0, max).map(function (x, i) { return h(Avatar, { key: i, initials: x.initials, color: x.color, src: x.src, name: x.name, size: p.size || 'md' }); }),
      extra > 0 ? h('span', { className: cx('mds-avatar', 'mds-avatar--' + (p.size || 'md'), 'mds-avatar--more'), 'aria-label': extra + ' more' }, '+' + extra) : null);
  }

  /** Rating — read-only stars plus the number; never stars alone. */
  function Rating(p) {
    var v = p.value || 0, size = p.size === 'sm' ? 16 : 20, stars = [];
    for (var i = 1; i <= 5; i++) stars.push(i <= Math.round(v) ? h('svg', { key: i, className: 'mds-icon mds-star--on', width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': 'true', style: { color: 'var(--feedback-warning-icon)' } }, h('path', { d: 'M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z', fill: 'currentColor', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' })) : h(Icon, { key: i, name: 'star', size: size, color: 'var(--border-strong)' }));
    return h('span', { className: cx('mds-rating', p.className), role: 'img', 'aria-label': 'Rated ' + v + ' out of 5' + (p.count ? ' from ' + p.count + ' reviews' : '') },
      h('span', { className: 'mds-rating__stars' }, stars),
      h('span', { className: 'mds-rating__num' }, v.toFixed(1) + (p.count ? ' (' + p.count + ')' : '')));
  }

  /** CreatorCard — seller summary with avatar, bio, stats and Follow. */
  function CreatorCard(p) {
    return h('article', { className: cx('mds-surface-card', 'mds-creator', p.className) },
      h('div', { className: 'mds-creator__top' }, h(Avatar, { initials: p.initials, src: p.src, color: p.color || 'pop-violet', size: 'lg' }),
        h('div', null, h('div', { className: 'mds-creator__name' }, p.name), p.verified ? h(Badge, { variant: 'lime' }, 'Top creator') : null)),
      p.bio ? h('p', { className: 'mds-creator__bio' }, p.bio) : null,
      p.stats ? h('div', { className: 'mds-creator__stats' }, p.stats.map(function (s) { return h('div', { key: s.label }, h('div', { className: 'mds-creator__stat' }, s.value), h('div', { className: 'mds-creator__label' }, s.label)); })) : null,
      h(Button, { variant: p.following ? 'tertiary' : 'secondary', size: 'sm', onClick: p.onFollow, style: { width: '100%' }, 'aria-pressed': String(!!p.following), 'aria-label': (p.following ? 'Following ' : 'Follow ') + p.name, leadingIcon: p.following ? 'tick-02' : undefined }, p.following ? 'Following' : 'Follow'));
  }

  /** ListItem — row with leading avatar/icon, title + meta and a trailing slot. */
  function ListItem(p) {
    var Tag = p.onClick || p.href ? (p.href ? 'a' : 'button') : 'div';
    var rest = omit(p, ['leading', 'title', 'meta', 'trailing', 'chevron', 'selected', 'className', 'href', 'onClick']);
    return h(Tag, Object.assign({}, rest, { className: cx('mds-list-item', p.selected && 'mds-list-item--selected', p.className), href: p.href, type: Tag === 'button' ? 'button' : undefined, onClick: p.onClick, 'aria-current': p.selected && Tag !== 'div' ? 'true' : undefined }),
      p.leading || null,
      h('span', { className: 'mds-list-item__text' }, h('span', { className: 'mds-list-item__title' }, p.title), p.meta ? h('span', { className: 'mds-list-item__meta' }, p.meta) : null),
      p.trailing || null,
      p.chevron ? h(Icon, { name: 'arrow-right-01', size: 20, color: 'var(--icon-muted)' }) : null);
  }

  /** Table — real table markup; numbers right-aligned with tabular figures. */
  function Table(p) {
    var align = function (c) { return c.align || (c.numeric ? 'right' : 'left'); };
    return h('div', { className: cx('mds-table-wrap', p.className), tabIndex: 0, role: 'region', 'aria-label': p.label || p.caption || 'Table' }, h('table', { className: 'mds-table' },
      p.caption ? h('caption', null, p.caption) : null,
      h('thead', null, h('tr', null, p.columns.map(function (c) { return h('th', { key: c.key, scope: 'col', style: { textAlign: align(c) } }, c.label); }))),
      h('tbody', null, p.rows.length ? p.rows.map(function (r, i) {
        return h('tr', { key: p.rowKey ? r[p.rowKey] : i }, p.columns.map(function (c) { return h('td', { key: c.key, style: { textAlign: align(c) }, className: c.numeric ? 'mds-num' : undefined }, c.render ? c.render(r) : r[c.key]); }));
      }) : h('tr', null, h('td', { colSpan: p.columns.length, className: 'mds-table__empty' }, p.empty || 'Nothing here yet.')))));
  }

  /** StatTile — one KPI with a trend arrow and change text. */
  function StatTile(p) {
    var t = p.trend || 'neutral';
    return h('div', { className: cx('mds-surface-card', 'mds-stat', p.className) },
      h('div', { className: 'mds-stat__top' }, h('span', { className: 'mds-stat__label' }, p.label),
        h('span', { className: 'mds-stat__badge', style: { background: 'var(--' + (p.color || 'pop-lime') + ')' } }, h(Icon, { name: p.icon || 'dollar-01', size: 16 }))),
      h('div', { className: 'mds-stat__value' }, p.value),
      h('div', { className: 'mds-stat__change mds-stat__change--' + t }, t !== 'neutral' ? h(Icon, { name: t === 'up' ? 'arrow-up-01' : 'arrow-down-01', size: 16 }) : null, p.change));
  }

  /** Skeleton — loading placeholder that matches the real layout. */
  function Skeleton(p) {
    var shape = p.shape || 'text';
    return h('span', { className: cx('mds-skeleton', 'mds-skeleton--' + shape, p.className), 'aria-hidden': 'true', style: { width: p.width, height: p.height } });
  }
  function AssetCardSkeleton() {
    return h('div', { className: 'mds-card', 'aria-busy': 'true' }, h(Skeleton, { shape: 'media' }), h(Skeleton, { shape: 'text', width: '70%' }),
      h('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h(Skeleton, { shape: 'circle', width: 24, height: 24 }), h(Skeleton, { shape: 'text', width: '40%' })));
  }

  /** Toast — inverse pill confirmation with optional Undo/Retry. */
  function Toast(p) {
    var v = p.variant || 'success', rest = omit(p, ['variant', 'message', 'actionLabel', 'onAction', 'onDismiss', 'className']);
    return h('div', Object.assign({}, rest, { className: cx('mds-toast', p.className), role: v === 'error' ? 'alert' : 'status', 'aria-live': v === 'error' ? 'assertive' : 'polite' }),
      h('span', { className: 'mds-toast__icon mds-toast__icon--' + v }, h(Icon, { name: v === 'success' ? 'tick-02' : v === 'error' ? 'alert-circle' : v === 'warning' ? 'alert-02' : 'information-circle', size: v === 'neutral' ? 20 : 16 })),
      h('span', { className: 'mds-toast__msg' }, p.message),
      p.actionLabel ? h('button', { type: 'button', className: 'mds-toast__action', onClick: p.onAction }, p.actionLabel) : null,
      p.onDismiss ? h('button', { type: 'button', className: 'mds-toast__close', 'aria-label': 'Dismiss', onClick: p.onDismiss }, h(Icon, { name: 'cancel-01', size: 16 })) : null);
  }

  /** Tooltip — short label on hover and focus; never essential info. */
  function Tooltip(p) {
    var st = R.useState(false), id = useId(null, 'tip');
    var child = R.isValidElement(p.children) ? R.cloneElement(p.children, { 'aria-describedby': id, title: undefined }) : p.children;
    return h('span', { className: 'mds-tip-anchor', onMouseEnter: function () { st[1](true); }, onMouseLeave: function () { st[1](false); }, onFocus: function () { st[1](true); }, onBlur: function () { st[1](false); }, onKeyDown: function (e) { if (e.key === 'Escape') st[1](false); } },
      child, h('span', { id: id, role: 'tooltip', className: cx('mds-tooltip', 'mds-tooltip--' + (p.placement || 'top'), st[0] && 'mds-tooltip--open') }, p.content));
  }

  /** Illustration — sticker-style scene built only from tokens; flips in dark mode. */
  function Illustration(p) {
    var scene = p.scene || 'listings', tile = { listings: ['pop-lime', 'add-01'], search: ['pop-violet', 'search-01'], error: ['pop-orange', 'alert-02'] }[scene] || ['pop-lime', 'add-01'];
    return h('span', { className: 'mds-illus', 'aria-hidden': 'true' },
      h('svg', { width: 200, height: 140, viewBox: '0 0 200 140', fill: 'none' },
        h('rect', { x: 34, y: 22, width: 132, height: 96, rx: 16, fill: 'var(--illustration-fill)', stroke: 'var(--illustration-stroke)', strokeWidth: 2 }),
        h('path', { d: 'M34 46h132', stroke: 'var(--illustration-stroke)', strokeWidth: 2 }),
        h('circle', { cx: 50, cy: 34, r: 4, fill: 'var(--pop-pink)', stroke: 'var(--illustration-stroke)' }),
        h('circle', { cx: 62, cy: 34, r: 4, fill: 'var(--pop-yellow)', stroke: 'var(--illustration-stroke)' }),
        h('rect', { x: 50, y: 60, width: 44, height: 42, rx: 12, fill: 'var(--' + tile[0] + ')', stroke: 'var(--illustration-stroke)', strokeWidth: 2 }),
        h('rect', { x: 106, y: 62, width: 44, height: 9, rx: 4.5, fill: 'var(--illustration-muted)', stroke: 'var(--illustration-stroke)' }),
        h('rect', { x: 106, y: 80, width: 30, height: 9, rx: 4.5, fill: 'var(--illustration-muted)', stroke: 'var(--illustration-stroke)' }),
        h('circle', { cx: 166, cy: 24, r: 14, fill: 'var(--pop-yellow)', stroke: 'var(--illustration-stroke)', strokeWidth: 2 })),
      h('span', { className: 'mds-illus__icon', style: { left: 60, top: 69 } }, h(Icon, { name: tile[1], size: 24 })),
      h('span', { className: 'mds-illus__icon', style: { left: 158, top: 16 } }, h(Icon, { name: scene === 'error' ? 'cancel-01' : 'tick-02', size: 16 })));
  }

  /** EmptyState — illustration, one plain sentence of why, and the next step. */
  function EmptyState(p) {
    return h('div', { className: cx('mds-empty', p.className) }, h(Illustration, { scene: p.scene || 'listings' }),
      h(p.headingLevel ? 'h' + p.headingLevel : 'h3', { className: 'mds-empty__title' }, p.title), p.body ? h('p', { className: 'mds-empty__body' }, p.body) : null, p.action || null);
  }

  /** Pagination — full numbered pages, or compact “Page 3 of 54”. */
  function Pagination(p) {
    var page = p.page || 1, n = p.pageCount || 1;
    function go(x) { if (x >= 1 && x <= n && p.onChange) p.onChange(x); }
    var items = [];
    if (!p.compact) {
      var set = [1, page - 1, page, page + 1, n].filter(function (x, i, a) { return x >= 1 && x <= n && a.indexOf(x) === i; }).sort(function (a, b) { return a - b; });
      set.forEach(function (x, i) { if (i && x - set[i - 1] > 1) items.push(h('span', { key: 'e' + x, className: 'mds-page mds-page--gap' }, '…'));
        items.push(h('button', { key: x, type: 'button', className: 'mds-page', 'aria-label': 'Page ' + x, 'aria-current': x === page ? 'page' : undefined, onClick: function () { go(x); } }, x)); });
    } else items.push(h('span', { key: 'c', className: 'mds-page__compact' }, 'Page ' + page + ' of ' + n));
    return h('nav', { className: cx('mds-pagination', p.className), 'aria-label': 'Pagination' },
      h(IconButton, { size: 'sm', icon: 'arrow-left-01', label: 'Previous page', disabled: page <= 1, onClick: function () { go(page - 1); } }), items,
      h(IconButton, { size: 'sm', icon: 'arrow-right-01', label: 'Next page', disabled: page >= n, onClick: function () { go(page + 1); } }));
  }

  /** Breadcrumbs — home, ancestor links, current page. */
  function Breadcrumbs(p) {
    var items = p.items || [];
    return h('nav', { className: cx('mds-crumbs', p.className), 'aria-label': 'Breadcrumb' }, h('ol', null,
      h('li', null, h('a', { href: p.homeHref || '#', 'aria-label': 'Home' }, h(Icon, { name: 'home-01', size: 16 }))),
      items.map(function (it, i) {
        var last = i === items.length - 1;
        return h('li', { key: i }, h(Icon, { name: 'arrow-right-01', size: 16, className: 'mds-crumbs__sep' }),
          last ? h('span', { 'aria-current': 'page' }, it.label) : h('a', { href: it.href || '#' }, it.label));
      })));
  }

  /** Logo — placeholder brand mark: blue disc + yellow pop dot + wordmark. */
  function Logo(p) {
    return h('span', { className: cx('mds-logo', p.className) }, h('span', { className: 'mds-logo__mark' }), p.name || 'Marketplace');
  }

  /** TopNav — logo, links, search and account actions; collapses on mobile. */
  function TopNav(p) {
    var links = p.links || ['Browse', 'Creators', 'Collections'], active = p.active || links[0];
    return h('header', { className: cx('mds-topnav', p.className) },
      h(IconButton, { className: 'mds-topnav__menu', icon: 'menu-01', label: 'Open menu', size: 'sm', onClick: p.onMenu }),
      h(Logo, { name: p.brand }),
      h('nav', { className: 'mds-topnav__links', 'aria-label': 'Primary' }, links.map(function (l) {
        return h('a', { key: l, href: '#', className: 'mds-navlink', 'aria-current': l === active ? 'page' : undefined, onClick: function (e) { e.preventDefault(); if (p.onNavigate) p.onNavigate(l); } }, l); })),
      h(SearchField, { className: 'mds-topnav__search', placeholder: 'Search 48,000 assets' }),
      h('span', { className: 'mds-topnav__spacer' }),
      h('div', { className: 'mds-topnav__actions' },
        p.loggedOut ? [h(Button, { key: 'l', variant: 'ghost', size: 'sm' }, 'Log in'), h(Button, { key: 's', size: 'sm' }, 'Sign up')]
          : [h(Button, { key: 'sell', variant: 'secondary', size: 'sm', leadingIcon: 'upload-01', className: 'mds-topnav__sell' }, 'Sell'),
            h(IconButton, { key: 'n', icon: 'notification-01', label: 'Notifications', size: 'sm' }),
            h(IconButton, { key: 'c', icon: 'shopping-bag-01', label: 'Cart', size: 'sm' }),
            h(Avatar, { key: 'a', initials: p.initials || 'MO', size: 'sm', name: 'Your account' })]));
  }

  /** BottomNav — mobile primary navigation; active item gets a yellow pill. */
  function BottomNav(p) {
    var items = p.items || [{ label: 'Home', icon: 'home-01' }, { label: 'Browse', icon: 'search-01' }, { label: 'Sell', icon: 'add-01' }, { label: 'Saved', icon: 'bookmark-01' }, { label: 'Profile', icon: 'user' }];
    var st = R.useState(p.defaultValue || items[0].label), active = p.value !== undefined ? p.value : st[0];
    return h('nav', { className: cx('mds-bottomnav', p.className), 'aria-label': 'Primary' }, items.map(function (it) {
      var on = it.label === active;
      return h('button', { key: it.label, type: 'button', className: 'mds-bottomnav__item', 'aria-current': on ? 'page' : undefined, onClick: function () { if (p.value === undefined) st[1](it.label); if (p.onChange) p.onChange(it.label); } },
        h('span', { className: 'mds-bottomnav__pill' }, h(Icon, { name: it.icon, size: 24 })), it.label);
    }));
  }

  /** SidebarNav — seller dashboard navigation with sections and counts. */
  function SidebarNav(p) {
    var sections = p.sections || [], st = R.useState(p.defaultValue || (sections[0] && sections[0].items[0].label)), active = p.value !== undefined ? p.value : st[0];
    return h('nav', { className: cx('mds-sidebar', p.className), 'aria-label': p.label || 'Seller' },
      p.brand === false ? null : h('div', { className: 'mds-sidebar__brand' }, h(Logo, { name: p.brand })),
      sections.map(function (s) {
        return h('div', { key: s.label, className: 'mds-sidebar__section' }, h('div', { className: 'mds-sidebar__label' }, s.label),
          s.items.map(function (it) {
            var on = it.label === active;
            return h('a', { key: it.label, href: it.href || '#', className: 'mds-sidebar__item', 'aria-current': on ? 'page' : undefined, onClick: function (e) { if (!it.href) e.preventDefault(); if (p.value === undefined) st[1](it.label); if (p.onChange) p.onChange(it.label); } },
              h(Icon, { name: it.icon, size: 20 }), h('span', { className: 'mds-sidebar__text' }, it.label), it.count ? h(Badge, { variant: 'pink' }, it.count) : null);
          }));
      }),
      p.user ? h('div', { className: 'mds-sidebar__user' }, h(Avatar, { initials: p.user.initials, color: p.user.color || 'pop-violet' }),
        h('div', null, h('div', { className: 'mds-list-item__title' }, p.user.name), h('div', { className: 'mds-list-item__meta' }, p.user.plan))) : null);
  }

  /** Stepper — progress through a multi-step flow. */
  function Stepper(p) {
    var cur = p.current || 0;
    return h('ol', { className: cx('mds-stepper', p.className) }, (p.steps || []).map(function (s, i) {
      var state = i < cur ? 'done' : i === cur ? 'active' : 'upcoming';
      return h('li', { key: i, className: 'mds-step mds-step--' + state, 'aria-current': state === 'active' ? 'step' : undefined },
        h('span', { className: 'mds-step__marker' }, state === 'done' ? h(Icon, { name: 'tick-02', size: 16, label: 'Completed' }) : i + 1),
        h('span', null, h('span', { className: 'mds-step__label' }, s.label), s.description ? h('span', { className: 'mds-step__desc' }, s.description) : null));
    }));
  }

  function useDismiss(open, close, ref) {
    R.useEffect(function () {
      if (!open) return;
      function key(e) { if (e.key === 'Escape') close(); }
      function off(e) { if (ref && ref.current && !ref.current.contains(e.target)) close(); }
      document.addEventListener('keydown', key); document.addEventListener('mousedown', off);
      return function () { document.removeEventListener('keydown', key); document.removeEventListener('mousedown', off); };
    }, [open]);
  }

  /** Overlays render into document.body so transformed or clipped ancestors can't trap the fixed scrim. */
  function portal(node) { return window.ReactDOM && ReactDOM.createPortal && document.body ? ReactDOM.createPortal(node, document.body) : node; }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  /** Moves focus into an open overlay, keeps Tab inside it, locks page scroll, and restores focus on close. */
  function useFocusTrap(ref, active, initial) {
    R.useEffect(function () {
      if (!active || !ref.current) return;
      var prev = document.activeElement, body = document.body, overflow = body.style.overflow;
      body.style.overflow = 'hidden';
      var el = ref.current, first = initial && initial.current ? initial.current : el;
      first.focus();
      function key(e) {
        if (e.key !== 'Tab') return;
        var f = el.querySelectorAll(FOCUSABLE); if (!f.length) return;
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
      el.addEventListener('keydown', key);
      return function () { el.removeEventListener('keydown', key); body.style.overflow = overflow; if (prev && prev.focus) prev.focus(); };
    }, [active]);
  }

  /** DropdownMenu — actions in a raised panel that springs open from its trigger. */
  function DropdownMenu(p) {
    var st = R.useState(false), open = st[0], ref = R.useRef(null), menuId = useId(null, 'menu');
    function close(refocus) { st[1](false); if (refocus && ref.current) { var t = ref.current.querySelector('[aria-haspopup="menu"]'); if (t) t.focus(); } }
    useDismiss(open, function () { close(false); }, ref);
    R.useEffect(function () { if (open && ref.current) { var f = ref.current.querySelector('[role="menuitem"]:not([disabled])'); if (f) f.focus(); } }, [open]);
    function nav(e) {
      var items = Array.prototype.slice.call(ref.current.querySelectorAll('[role="menuitem"]:not([disabled])')), i = items.indexOf(document.activeElement), n = null;
      if (e.key === 'ArrowDown') n = items[(i + 1) % items.length]; if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
      if (e.key === 'Home') n = items[0]; if (e.key === 'End') n = items[items.length - 1];
      if (e.key === 'Tab') st[1](false);
      if (e.key === 'Escape') { e.preventDefault(); close(true); }
      if (n) { e.preventDefault(); n.focus(); }
    }
    var trig = { 'aria-haspopup': 'menu', 'aria-expanded': String(open), 'aria-controls': open ? menuId : undefined, onClick: function () { st[1](!open); } };
    return h('div', { ref: ref, className: 'mds-pop-anchor' },
      p.icon ? h(IconButton, Object.assign({ variant: p.triggerVariant || 'ghost', icon: p.icon, label: p.label || 'More actions' }, trig))
        : h(Button, Object.assign({ variant: p.triggerVariant || 'secondary', trailingIcon: 'arrow-down-01' }, trig), p.label || 'Actions'),
      open ? h('div', { id: menuId, className: cx('mds-menu', p.align === 'end' && 'mds-menu--end'), role: 'menu', 'aria-label': p.label || 'Actions', onKeyDown: nav }, (p.items || []).map(function (it, i) {
        if (it.divider) return h('hr', { key: i, className: 'mds-divider mds-menu__divider' });
        return h('button', { key: i, type: 'button', role: 'menuitem', disabled: it.disabled, className: cx('mds-menu__item', it.destructive && 'mds-menu__item--danger'), onClick: function () { close(true); if (it.onSelect) it.onSelect(); } },
          it.icon ? h(Icon, { name: it.icon, size: 20 }) : null, h('span', { className: 'mds-menu__label' }, it.label), it.shortcut ? h('span', { className: 'mds-menu__kbd' }, it.shortcut) : null);
      })) : null);
  }

  /** Modal — focused decision over a dimmed page; one task, two actions max. */
  function Modal(p) {
    var ref = R.useRef(null), tid = useId(null, 'modal-title');
    useFocusTrap(ref, p.open && !p.inline);
    R.useEffect(function () { if (!p.open || p.inline) return; function key(e) { if (e.key === 'Escape' && p.onClose) p.onClose(); } document.addEventListener('keydown', key); return function () { document.removeEventListener('keydown', key); }; }, [p.open]);
    if (!p.open) return null;
    var des = p.tone === 'destructive';
    var panel = h('div', { ref: ref, tabIndex: -1, role: 'dialog', 'aria-modal': p.inline ? undefined : 'true', 'aria-labelledby': tid, className: cx('mds-modal', 'mds-modal--' + (p.size || 'sm'), p.inline && 'mds-inline', p.className), style: p.style },
        h('div', { className: 'mds-modal__top' }, p.icon !== false ? h('span', { className: cx('mds-modal__icon', des && 'mds-modal__icon--danger') }, h(Icon, { name: p.icon || (des ? 'delete-02' : 'rocket-01'), size: 24 })) : h('span'),
          h(IconButton, { size: 'sm', icon: 'cancel-01', label: 'Close', onClick: p.onClose })),
        h('h2', { id: tid, className: 'mds-modal__title' }, p.title),
        h('div', { className: 'mds-modal__body' }, p.children),
        h(ButtonGroup, { className: 'mds-modal__actions' },
          h(Button, { variant: 'secondary', onClick: p.onClose }, p.secondaryLabel || 'Cancel'),
          h(Button, { variant: des ? 'destructive' : 'primary', onClick: p.onPrimary, loading: p.loading, disabled: p.primaryDisabled }, p.primaryLabel || 'Confirm')));
    return p.inline ? panel : portal(h('div', { className: 'mds-scrim', onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } }, panel));
  }

  /** Drawer — side drawer (desktop) or bottom sheet (mobile) with a footer action. */
  function Drawer(p) {
    var ref = R.useRef(null);
    useDismiss(p.open && !p.inline, function () { if (p.onClose) p.onClose(); });
    useFocusTrap(ref, p.open && !p.inline);
    if (!p.open) return null;
    var side = p.side || 'right';
    var panel = h('div', { ref: ref, tabIndex: -1, role: 'dialog', 'aria-modal': p.inline ? undefined : 'true', 'aria-label': p.title, className: cx('mds-drawer', 'mds-drawer--' + side, p.inline && 'mds-inline', p.className), style: p.style },
        side === 'bottom' ? h('span', { className: 'mds-drawer__handle' }) : null,
        h('div', { className: 'mds-drawer__head' }, h('h2', { className: 'mds-drawer__title' }, p.title), h(IconButton, { size: 'sm', icon: 'cancel-01', label: 'Close', onClick: p.onClose })),
        h('div', { className: 'mds-drawer__body' }, p.children),
        p.footer ? h('div', { className: 'mds-drawer__foot' }, p.footer) : null);
    return p.inline ? panel : portal(h('div', { className: 'mds-scrim mds-scrim--' + side, onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } }, panel));
  }

  /** Popover — click-triggered panel for extra detail next to a control. */
  function Popover(p) {
    var st = R.useState(false), open = st[0], ref = R.useRef(null), pid = useId(null, 'pop');
    useDismiss(open, function () { st[1](false); }, ref);
    var trigger = R.isValidElement(p.trigger) ? R.cloneElement(p.trigger, { 'aria-expanded': String(open), 'aria-haspopup': 'dialog', 'aria-controls': open ? pid : undefined, onClick: function (e) { if (p.trigger.props.onClick) p.trigger.props.onClick(e); st[1](!open); } }) : h('span', { onClick: function () { st[1](!open); } }, p.trigger);
    return h('span', { ref: ref, className: 'mds-pop-anchor' }, trigger,
      open ? h('div', { id: pid, className: 'mds-popover-panel mds-popover-panel--below', role: 'dialog', 'aria-label': p.title || p.label },
        p.title ? h('div', { className: 'mds-alert__title' }, p.title) : null, h('div', { className: 'mds-popover__body' }, p.children)) : null);
  }

  /** CommandPalette — ⌘K search across assets, creators and actions. */
  function CommandPalette(p) {
    var q = R.useState(''), act = R.useState(0), inputRef = R.useRef(null), ref = R.useRef(null), cid = useId(null, 'cmd');
    R.useEffect(function () { if (p.open) { q[1](''); act[1](0); } }, [p.open]);
    useFocusTrap(ref, p.open && !p.inline, inputRef);
    if (!p.open) return null;
    var flat = [];
    var groups = (p.groups || []).map(function (g) { var items = g.items.filter(function (it) { return it.label.toLowerCase().indexOf(q[0].toLowerCase()) >= 0; }); items.forEach(function (it) { flat.push(it); }); return { label: g.label, items: items }; }).filter(function (g) { return g.items.length; });
    function key(e) { if (e.key === 'ArrowDown') { e.preventDefault(); act[1](Math.min(act[0] + 1, flat.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); act[1](Math.max(act[0] - 1, 0)); } if (e.key === 'Enter' && flat[act[0]]) { if (flat[act[0]].onSelect) flat[act[0]].onSelect(); if (p.onClose) p.onClose(); } if (e.key === 'Escape' && p.onClose) p.onClose(); }
    var n = -1;
    var panel = h('div', { ref: ref, className: cx('mds-command', p.inline && 'mds-inline'), role: 'dialog', 'aria-modal': p.inline ? undefined : 'true', 'aria-label': 'Command palette', onKeyDown: key },
        h('div', { className: 'mds-command__search' }, h(Icon, { name: 'search-01', size: 20 }),
          h('input', { ref: inputRef, role: 'combobox', 'aria-label': p.label || 'Search', 'aria-expanded': 'true', 'aria-controls': cid + '-list', 'aria-activedescendant': flat.length ? cid + '-opt-' + act[0] : undefined, 'aria-autocomplete': 'list', placeholder: p.placeholder || 'Search assets, creators and actions', value: q[0], onChange: function (e) { q[1](e.target.value); act[1](0); } }), h('kbd', { className: 'mds-kbd' }, 'Esc')),
        h('div', { id: cid + '-list', role: 'listbox', className: 'mds-command__list' }, !flat.length ? h('div', { className: 'mds-command__empty' }, p.emptyText || 'No results for “' + q[0] + '”. Try a shorter word.') : null, groups.map(function (g) {
          return h('div', { key: g.label }, h('div', { className: 'mds-sidebar__label' }, g.label), g.items.map(function (it) {
            n++; var on = n === act[0], idx = n;
            return h('div', { key: it.label, id: cid + '-opt-' + idx, role: 'option', 'aria-selected': String(on), className: cx('mds-command__item', on && 'mds-command__item--on'), onMouseEnter: function () { act[1](idx); }, onClick: function () { if (it.onSelect) it.onSelect(); if (p.onClose) p.onClose(); } },
              h(Icon, { name: it.icon || 'file-01', size: 20 }), h('span', null, it.label), h('span', { className: 'mds-command__hint' }, it.hint), on ? h(Icon, { name: 'arrow-right-01', size: 16 }) : null);
          }));
        })),
        h('div', { className: 'mds-command__foot' }, h('span', null, h('kbd', { className: 'mds-kbd' }, '↑↓'), ' Navigate'), h('span', null, h('kbd', { className: 'mds-kbd' }, '↵'), ' Open'), h('span', null, h('kbd', { className: 'mds-kbd' }, '⌘K'), ' Toggle')));
    return p.inline ? panel : portal(h('div', { className: 'mds-scrim mds-scrim--top', onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } }, panel));
  }

  /** Carousel — preview gallery: arrows + thumbnails (gallery) or dots (inline). */
  function Carousel(p) {
    var slides = p.slides || [], st = R.useState(0), i = st[0];
    function go(n) { st[1]((n + slides.length) % slides.length); }
    var slide = slides[i] || {};
    return h('div', { className: cx('mds-carousel', p.className), 'aria-roledescription': 'carousel' },
      h('div', { className: 'mds-carousel__stage', style: { background: slide.image ? undefined : 'var(--' + (slide.color || 'bg-muted') + ')' }, 'aria-live': 'polite', 'aria-label': 'Preview ' + (i + 1) + ' of ' + slides.length },
        slide.image ? h('img', { src: slide.image, alt: slide.alt || '' }) : h(Icon, { name: 'image-01', size: 24, color: 'var(--icon-on-pop)' }),
        p.variant !== 'inline' ? h(IconButton, { className: 'mds-carousel__prev', variant: 'secondary', size: 'sm', icon: 'arrow-left-01', label: 'Previous preview', onClick: function () { go(i - 1); } }) : null,
        p.variant !== 'inline' ? h(IconButton, { className: 'mds-carousel__next', variant: 'secondary', size: 'sm', icon: 'arrow-right-01', label: 'Next preview', onClick: function () { go(i + 1); } }) : null),
      p.variant === 'inline' ? h('div', { className: 'mds-carousel__dots' }, slides.map(function (s, n) { return h('button', { key: n, type: 'button', className: cx('mds-carousel__dot', n === i && 'mds-carousel__dot--on'), 'aria-label': 'Show preview ' + (n + 1), onClick: function () { go(n); } }); }))
        : h('div', { className: 'mds-carousel__thumbs' }, slides.map(function (s, n) { return h('button', { key: n, type: 'button', className: cx('mds-carousel__thumb', n === i && 'mds-carousel__thumb--on'), style: { background: s.image ? undefined : 'var(--' + (s.color || 'bg-muted') + ')' }, 'aria-label': 'Show preview ' + (n + 1), onClick: function () { go(n); } }, s.image ? h('img', { src: s.image, alt: '' }) : null); })));
  }

  /** NotificationCenter — activity panel under the bell: unread dots, tabs, mark all read. */
  function NotificationCenter(p) {
    return h('div', { className: cx('mds-popover-panel', 'mds-notifs', p.className), role: 'region', 'aria-label': 'Notifications' },
      h('div', { className: 'mds-notifs__head' }, h('span', { className: 'mds-drawer__title' }, 'Notifications'), h(Link, { href: '#', onClick: function (e) { e.preventDefault(); if (p.onMarkAll) p.onMarkAll(); } }, 'Mark all read')),
      h(Tabs, { label: 'Filter', items: [{ value: 'all', label: 'All' }, { value: 'sales', label: 'Sales' }] }),
      (p.items || []).map(function (n, i) {
        return h('div', { key: i, className: cx('mds-notif', n.unread && 'mds-notif--unread') }, h(Avatar, { size: 'sm', initials: n.initials, color: n.color, src: n.src }),
          h('div', { className: 'mds-list-item__text' }, h('span', { className: n.unread ? 'mds-notif__msg' : 'mds-notif__msg mds-notif__msg--read' }, n.message), h('span', { className: 'mds-list-item__meta' }, n.time)),
          n.unread ? h('span', { className: 'mds-notif__dot', 'aria-label': 'Unread' }) : null);
      }));
  }

  window.MarketplaceDS = { Icon: Icon, Button: Button, IconButton: IconButton, Badge: Badge, Chip: Chip, TextField: TextField, Checkbox: Checkbox, Switch: Switch, Avatar: Avatar, PriceTag: PriceTag, Alert: Alert, Tabs: Tabs, AssetCard: AssetCard, Divider: Divider, Spinner: Spinner, Link: Link, ButtonGroup: ButtonGroup, Select: Select, SearchField: SearchField, Textarea: Textarea, Radio: Radio, LicenseSelector: LicenseSelector, FileUpload: FileUpload, FileRow: FileRow, ProgressBar: ProgressBar, Slider: Slider, OtpInput: OtpInput, Calendar: Calendar, DatePicker: DatePicker, AvatarGroup: AvatarGroup, Rating: Rating, CreatorCard: CreatorCard, ListItem: ListItem, Table: Table, StatTile: StatTile, Skeleton: Skeleton, AssetCardSkeleton: AssetCardSkeleton, Toast: Toast, Tooltip: Tooltip, Illustration: Illustration, EmptyState: EmptyState, Pagination: Pagination, Breadcrumbs: Breadcrumbs, Logo: Logo, TopNav: TopNav, BottomNav: BottomNav, SidebarNav: SidebarNav, Stepper: Stepper, DropdownMenu: DropdownMenu, Modal: Modal, Drawer: Drawer, Popover: Popover, CommandPalette: CommandPalette, Carousel: Carousel, NotificationCenter: NotificationCenter };
