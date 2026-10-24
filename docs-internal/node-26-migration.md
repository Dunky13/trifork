# Node 26 compatibility handoff

The original Angular CLI 1 installation fails on Node 26.12.1 in native
`node-sass` and `node-gyp` 3.8. The replacement keeps the Angular 4.4.7 runtime
and its matching template compiler, and replaces the CLI's bundler with Webpack
5 and Sass with Dart Sass. Normal peer resolution and lifecycle scripts remain
enabled. No Node downgrade or cryptographic compatibility flag is used.

`scripts/compiler.cjs` compiles a temporary source copy, selects the existing
production environment and supplies compiled component Sass through Angular's
resource-host interface. Generated factories are included in TypeScript
checking and compilation. Webpack bundles those factories. Development builds
watch original sources and regenerate their AOT output. Generated intermediates
are ignored by Git. Compiler failures become recoverable development compilation
errors while production still fails. Each successful AOT pass invalidates the
generated-file read cache. `npm run test:watch` checks TypeScript and Sass error
recovery and production rejection in an isolated temporary source copy.

All original TSLint rules remain enabled, including the template access and
injectable rules. Codelyzer 3.2.2 supports those rules with TSLint 5.20.1 while
removing the old notifier/argument-parser vulnerabilities. Production source
changes are formatting only, verified by token comparison. Component tests keep
the creation/title checks, correct the stale rendered-heading assertion to the
actual header/body, supply required providers and add choice, validation,
submission-payload and reset assertions. The compiler promise is returned to
Jasmine so asynchronous compilation is awaited exactly once.

Workbox implements the declared static offline capability with a precache and
root navigation fallback. It uses the existing worker filename. The application
has no direct dependency on legacy Angular service-worker message APIs.

## Remaining security boundary

The candidate's normal audit reports 12 legacy Angular-family dependency
findings: four high and eight moderate, with zero critical. They include Angular
sanitization/XSS advisories; some other advisories describe newer APIs or SSR
that this application does not use. An audit listing is not a runtime
exploitability proof. No claim that these framework advisories are fixed is made.

There is no patched Angular 4 release. Removing the framework findings requires
a supported Angular major, replacing removed `@angular/http` APIs, and migrating
the legacy Material component APIs. That is a separate framework migration with
UI fidelity and API-contract review, beyond this behavior-preserving toolchain
candidate. Do not represent a successful Node build as full dependency-security
approval. Root owns the decision on any retained framework risk and the
subsequent merge or delivery gates.

No established publication workflow or owned deployment endpoint has been
identified in this repository. The existing configuration is preserved; no new
destination is invented.

References:
- https://sass-lang.com/blog/node-sass-is-end-of-life/
- https://webpack.js.org/migrate/5/
- https://github.com/angular/angular/tree/4.4.7/packages/compiler-cli
