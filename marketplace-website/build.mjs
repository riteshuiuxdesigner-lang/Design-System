// Builds the Nudge prototype into out/: app.js (React app on the Marketplace DS), app.css, plus the DS tokens.css, bundle.js/.css and fonts.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const oi = process.argv.indexOf('--out'), out = oi > 0 ? path.resolve(process.argv[oi + 1]) : path.join(root, 'out'); // --out <dir> for private preview builds
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
const dev = process.argv.includes('--dev'), verify = process.argv.includes('--verify');
await esbuild.build({
  entryPoints: [path.join(root, 'src/app.jsx')], bundle: true, format: 'iife', target: 'es2019', minify: !dev,
  jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', logLevel: 'warning',
  outfile: verify ? path.join(process.env.TMPDIR || '/tmp', 'nudge-verify-' + process.pid + '.js') : path.join(out, 'app.js'),
});
if (verify) { console.log('verify ok'); process.exit(0); }
// The design system comes from the sibling design-system-website folder (build it first).
const ds = path.join(root, '../design-system-website/out'), cloud = path.join(root, '../design-system-website/design-system/dist');
fs.copyFileSync(path.join(ds, 'tokens.css'), path.join(out, 'tokens.css'));
fs.copyFileSync(path.join(cloud, 'bundle.js'), path.join(out, 'bundle.js'));
fs.copyFileSync(path.join(cloud, 'bundle.css'), path.join(out, 'bundle.css'));
// app.css = global styles + every page's own stylesheet (src/pages/*.css)
const pageCss = fs.readdirSync(path.join(root, 'src/pages')).filter(f => f.endsWith('.css')).sort().map(f => `\n/* ---- pages/${f} ---- */\n` + fs.readFileSync(path.join(root, 'src/pages', f), 'utf8'));
fs.writeFileSync(path.join(out, 'app.css'), fs.readFileSync(path.join(root, 'src/app.css'), 'utf8') + pageCss.join(''));
const fontsSrc = path.join(root, '../design-system-website/design-system/fonts');
for (const f of fs.readdirSync(fontsSrc)) fs.copyFileSync(path.join(fontsSrc, f), path.join(out, 'fonts', f));
fs.copyFileSync(path.join(root, 'src/index.html'), path.join(out, 'index.html'));
fs.mkdirSync(path.join(out, 'people'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'src/people'))) if (f.endsWith('.jpg')) fs.copyFileSync(path.join(root, 'src/people', f), path.join(out, 'people', f));
fs.writeFileSync(path.join(out, 'dev.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n' + fs.readFileSync(path.join(root, 'src/index.html'), 'utf8') + '</body></html>');
console.log('built app.js', (fs.statSync(path.join(out, 'app.js')).size / 1024).toFixed(0) + 'KB');
