const esbuild = require('esbuild');
// const globals = require('esbuild-plugin-node-globals');
// const polyfills = require('esbuild-plugin-node-modules-polyfill');

esbuild.build({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outfile: './dist/bundle.js',
  platform: 'browser',
  // plugins: [globals.default(), polyfills.default()],
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  loader: {
    '.js': 'jsx',
    '.tsx': 'tsx',
    '.css': 'css'
  },
}).catch(() => process.exit(1));
