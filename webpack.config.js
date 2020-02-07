const path = require('path');

module.exports = [
  {
    entry: './src/ww-exports.js',
    output: { filename: 'ww-exports.js', path: __dirname + '/dist' },
    watch: true,
  },
  {
    entry: './src/web/index.js',
    output: { filename: 'svelte.js', path: __dirname + '/dist' },
    watch: true,
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true
            }
          }
        },
      ]
    },
  }
];