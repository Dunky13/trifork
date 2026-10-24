# Trifork

Use Node.js 26.12.1, selected by `.nvmrc` and the package engine.

```sh
npm ci
npx playwright install chromium
npm run lint
npm test
npm run build
npm run e2e
```

`npm start` serves the development build on all interfaces at port 4200 and
rebuilds when source files change. `npm run build` writes an AOT production site
to `dist/`. `npm run ng -- build` retains a compatibility command for the build,
serve, test, lint and e2e tasks; obsolete CLI scaffolding is no longer installed.

The build uses the matching Angular 4 compiler, modern Webpack and Dart Sass.
The existing survey components, templates, styles, assets and HTTP payloads are
preserved. Workbox generates the static offline worker at `worker-basic.min.js`.
Karma runs the Angular unit tests in Chromium; Playwright replaces Protractor
for production submission, mobile and offline-navigation checks. Browser tests
use fixture configuration and intercept submission requests.

See [the migration handoff](docs-internal/node-26-migration.md) for the remaining
legacy framework security boundary. This change does not establish a release or
deployment target and does not publish the site.
