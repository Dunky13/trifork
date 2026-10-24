const path = require('node:path');
process.env.CHROME_BIN = process.env.CHROME_BIN || require('@playwright/test').chromium.executablePath();

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    proxies: { '/assets/': '/base/src/assets/' },
    files: [
      { pattern: './src/assets/**/*', included: false, watched: false },
      { pattern: './src/polyfills.ts', watched: false },
      { pattern: './src/test.ts', watched: false },
      { pattern: './node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css', watched: false },
    ],
    preprocessors: { './src/polyfills.ts': ['webpack'], './src/test.ts': ['webpack'] },
    webpack: {
      mode: 'development', devtool: 'inline-source-map', parallelism: 2,
      resolve: { extensions: ['.ts', '.js'] },
      module: { rules: [{ test: /\.ts$/, loader: path.resolve('scripts/typescript-loader.cjs') }] },
    },
    reporters: ['progress'], browsers: ['ChromeHeadless'], concurrency: 1,
    singleRun: true, autoWatch: false,
    client: { clearContext: false },
  });
};
