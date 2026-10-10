"""Builds the component bundle: dist/bundle.js (React components on window.MarketplaceDS, icons inlined) and dist/bundle.css.
Icons: put Hugeicons Pro SVGs in icons/stroke/ and icons/twotone/ (not committed; see icons/*/README.md). Without them, icons render empty."""
import json, re, glob, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
def body(path):
    s = open(path).read()
    inner = re.sub(r'^<svg[^>]*>', '', s.strip())[:-len('</svg>')]
    inner = re.sub(r'\sid="[^"]*"', '', inner)
    inner = inner.replace('#0B0B0B', 'currentColor').replace('#3F75FF', 'currentColor').replace('#3f75ff', 'currentColor')
    inner = re.sub(r'>\s+<', '><', inner)
    assert '</script' not in inner and '<!--' not in inner
    return inner
icons = {'stroke': {}, 'twotone': {}}
for kind in icons:
    for f in sorted(glob.glob(os.path.join(HERE, 'icons', kind, '*.svg'))): icons[kind][os.path.basename(f)[:-4]] = body(f)
# No local SVGs (they're licensed and not committed)? Keep the committed dist/bundle.js, which already has the icons inlined.
if not icons['stroke'] and os.path.exists(os.path.join(HERE, 'dist', 'bundle.js')):
    shutil.copy(os.path.join(HERE, 'components.css'), os.path.join(HERE, 'dist', 'bundle.css'))
    print('icons not found locally: kept the committed dist/bundle.js')
    raise SystemExit(0)
src = open(os.path.join(HERE, 'components.js')).read()
comps = [s.split(':')[0].strip() for s in re.search(r'window\.MarketplaceDS = \{([^}]*)\}', src).group(1).split(',') if s.strip()]
header = '/* @ds-bundle: ' + json.dumps({"format": 4, "namespace": "MarketplaceDS", "components": [{"name": c} for c in comps]}) + ' */\n'
js = header + '(function () {\n  var ICONS = ' + json.dumps(icons, separators=(',', ':')) + ';\n' + src + '})();\n'
assert '</script' not in js and '<!--' not in js
os.makedirs(os.path.join(HERE, 'dist'), exist_ok=True)
open(os.path.join(HERE, 'dist', 'bundle.js'), 'w').write(js)
shutil.copy(os.path.join(HERE, 'components.css'), os.path.join(HERE, 'dist', 'bundle.css'))
print('bundle.js', len(js), 'components', len(comps), 'icons', len(icons['stroke']), len(icons['twotone']))
