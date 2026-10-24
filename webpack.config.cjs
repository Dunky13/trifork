const fs = require('node:fs');
const path = require('node:path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const { compile } = require('./scripts/compiler.cjs');

module.exports = (env, argv) => {
  const production = argv.mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    target: ['web', 'es5'],
    entry: ['./scripts/bootstrap.js', './src/styles.css',
      ...(production ? ['./scripts/register-service-worker.js'] : [])],
    output: { path: path.resolve('dist'), filename: 'main.[contenthash].js', clean: true },
    devtool: 'source-map',
    cache: false,
    parallelism: 2,
    watchOptions: { ignored: /[\\/](\.build|\.build-source)[\\/]/ },
    resolve: { extensions: ['.js', '.ts'] },
    module: { rules: [
      { test: /\.css$/, use: [CssPlugin.loader, 'css-loader'] },
      { test: /\.(png|jpe?g|gif|svg|ico|woff2?|ttf|eot)$/, type: 'asset/resource' },
    ] },
    optimization: { minimizer: [new TerserPlugin({ parallel: 2 })] },
    devServer: { host: '0.0.0.0', port: 4200, historyApiFallback: true },
    plugins: [
      { apply(compiler) {
        compiler.hooks.beforeCompile.tapPromise('AngularAot', () => compile(production));
        compiler.hooks.thisCompilation.tap('SourceInputs', compilation => {
          for (const file of fs.globSync('src/**/*')) {
            if (fs.statSync(file).isFile()) compilation.fileDependencies.add(path.resolve(file));
          }
        });
      } },
      new HtmlPlugin({ template: 'src/index.html' }),
      new CssPlugin({ filename: 'styles.[contenthash].css' }),
      new CopyPlugin({ patterns: [{ from: 'src/assets', to: 'assets', globOptions: { ignore: ['**/.gitkeep'] } }, { from: 'src/favicon.ico' }] }),
      ...(production ? [new GenerateSW({
        swDest: 'worker-basic.min.js', clientsClaim: true, cleanupOutdatedCaches: true,
        navigateFallback: '/index.html', navigateFallbackAllowlist: [/^\/$/],
      })] : []),
    ],
  };
};
