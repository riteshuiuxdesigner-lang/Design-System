// Builds the docs site into out/: site.js (app + docs), tokens.css (gen_tokens.py), bundle.js/.css (design-system/build_bundle.py), fonts.
// Docs live in src/docs/*.jsx. Inside them, ex(`<JSX/>`) compiles a live example AND keeps its source string for the code panel.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { makeExPlugin } from './plugin.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const ds = path.join(root, 'design-system');
const out = path.join(root, 'out');
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
const watch = process.argv.includes('--check');
const verify = process.argv.includes('--verify'); // compile only, to a temp file (safe to run in parallel)

// 1. Component sources, split per exported component, so engineers can copy one component.
const compSrc = fs.readFileSync(path.join(ds, 'components.js'), 'utf8');
const exportLine = compSrc.match(/window\.MarketplaceDS = \{([^}]*)\}/)[1];
const EXPORTS = exportLine.split(',').map(s => s.split(':')[0].trim()).filter(Boolean);
const sources = {};
const blocks = compSrc.split(/\n(?=  \/\*\* |  function |  var [A-Z_]+ = )/);
for (const b of blocks) {
  const m = b.match(/function ([A-Za-z]+)\(/);
  if (m) sources[m[1]] = (sources[m[1]] ? sources[m[1]] + '\n' : '') + b.replace(/^\n+/, '').replace(/\n  window\.MarketplaceDS[\s\S]*$/, '').split('\n').map(l => l.replace(/^  /, '')).join('\n').trimEnd();
}
fs.mkdirSync(path.join(root, 'src/gen'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/gen/sources.json'), JSON.stringify({ exports: EXPORTS, sources }));

// 2. Docs registry.
const docFiles = fs.readdirSync(path.join(root, 'src/docs')).filter(f => f.endsWith('.jsx')).sort();
fs.writeFileSync(path.join(root, 'src/gen/docs-index.js'),
  docFiles.map((f, i) => `import d${i} from '../docs/${f}';`).join('\n') + `\nexport default [${docFiles.map((_, i) => 'd' + i).join(', ')}];\n`);

// 3. ex(`...`) compiler plugin + DS globals for docs/pages (plugin.mjs).
const exPlugin = makeExPlugin(EXPORTS);

await esbuild.build({
  entryPoints: [path.join(root, 'src/app.jsx')],
  bundle: true, format: 'iife', target: 'es2019', minify: !watch,
  jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment',
  loader: { '.json': 'json' },
  outfile: verify ? path.join(process.env.TMPDIR || '/tmp', 'dsw-verify-' + process.pid + '.js') : path.join(out, 'site.js'), plugins: [exPlugin], logLevel: 'warning',
});

if (verify) { console.log('verify ok:', docFiles.length, 'docs compiled'); process.exit(0); }
// 4. Static files.
execSync(`python3 ${path.join(ds, 'build_bundle.py')}`, { stdio: 'inherit' });
execSync(`python3 ${path.join(root, 'gen_tokens.py')}`, { stdio: 'inherit' });
fs.copyFileSync(path.join(ds, 'dist/bundle.js'), path.join(out, 'bundle.js'));
fs.copyFileSync(path.join(ds, 'dist/bundle.css'), path.join(out, 'bundle.css'));
fs.copyFileSync(path.join(root, 'src/site.css'), path.join(out, 'site.css'));
fs.copyFileSync(path.join(root, 'src/index.html'), path.join(out, 'index.html'));
// dev.html = index.html wrapped in a full document, for the local server (serve.mjs).
fs.writeFileSync(path.join(out, 'dev.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n' + fs.readFileSync(path.join(root, 'src/index.html'), 'utf8') + '</body></html>');
const size = f => (fs.statSync(path.join(out, f)).size / 1024).toFixed(0) + 'KB';
console.log('built', docFiles.length, 'docs ·', 'site.js', size('site.js'), '· bundle.js', size('bundle.js'));
