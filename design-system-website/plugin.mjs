// Compiles ex(`<JSX/>`) in docs/pages into { code, js, render } and injects the MarketplaceDS globals.
import * as esbuild from 'esbuild';
import fs from 'node:fs';

export function makeExPlugin(EXPORTS, opts = {}) {
const HEADER = `const { ${EXPORTS.join(', ')} } = window.MarketplaceDS; const { useState, useEffect, useRef, Fragment } = React;\n`;
const exPlugin = {
  name: 'ds-examples',
  setup(build) {
    build.onLoad({ filter: /src\/(docs|pages)\/.*\.jsx$/ }, async (args) => {
      let src = fs.readFileSync(args.path, 'utf8');
      const errors = [];
      src = src.replace(/\bex\(`([\s\S]*?)`\)/g, (m, code) => {
        const c = code.replace(/^\n+|\s+$/g, '');
        const fn = /^function\s/.test(c) ? c : `function Example() {\n  return (\n    <>\n${c}\n    </>\n  );\n}`;
        try {
          const js = esbuild.transformSync(fn, { loader: 'jsx', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' }).code;
          return `({ code: ${JSON.stringify(c)}, ${opts.js ? 'js: ' + JSON.stringify(js) + ',' : ''} render: (function () { ${js}; return Example; })() })`;
        } catch (e) {
          errors.push({ text: 'Example failed to compile: ' + e.message.split('\n')[0] + '\n' + c.slice(0, 200) });
          return '({ code: "", render: function () { return null; } })';
        }
      });
      return { contents: HEADER + src, loader: 'jsx', errors };
    });
  },
};
return exPlugin;
}
